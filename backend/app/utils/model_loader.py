from catboost import CatBoostRegressor
import joblib
import pandas as pd

model = CatBoostRegressor()
model.load_model("app/model/trade_model.cbm")

features = joblib.load("app/model/features.pkl")

from app.utils.feature_engineering import create_features

# Long-format dataset: one row per (date, country)
historical_df = pd.read_csv("app/model/final_dataset_2011_2025.csv")
historical_df['date'] = pd.to_datetime(historical_df['date'])
historical_df = historical_df.sort_values(['country', 'date']).reset_index(drop=True)
historical_df = create_features(historical_df)

COUNTRIES = ["russia", "china", "usa"]

latest_market_data = {
    'oil_price': None,
    'usd_inr': None
}

try:
    oil_df = pd.read_csv("../dataset_creation/oil_2026.csv")
    usd_inr_df = pd.read_csv("../dataset_creation/usd_inr_2026.csv")

    latest_oil = oil_df.dropna(subset=['oil_price']).iloc[-1]['oil_price']
    latest_market_data['oil_price'] = float(latest_oil)

    usd_inr_df['usd_inr'] = pd.to_numeric(usd_inr_df['usd_inr'], errors='coerce')
    latest_usd_inr = usd_inr_df.dropna(subset=['usd_inr']).iloc[-1]['usd_inr']
    latest_market_data['usd_inr'] = float(latest_usd_inr)
except Exception as e:
    print("Could not load latest oil/usd data:", e)

# Build feature importance dynamically from the CatBoost model
importance_values = model.get_feature_importance()

feature_importance = [
    {
        "feature": feature,
        "importance": float(importance)
    }
    for feature, importance in sorted(
        zip(features, importance_values),
        key=lambda x: x[1],
        reverse=True
    )[:10]
]


def latest_row_for(country: str):
    """Most recent feature row for a single country (russia/china/usa)."""
    sub = historical_df[historical_df['country'] == country]
    return sub.iloc[-1:].copy()


def predict_total(df_source=None):
    """Sum the model's next-month prediction across russia/china/usa,
    reproducing India's combined trade-deficit forecast (matches the old
    wide-format single-target semantics the frontend expects)."""
    source = df_source if df_source is not None else historical_df
    total = 0.0
    per_country = {}
    for country in COUNTRIES:
        sub = source[source['country'] == country]
        row = sub.iloc[-1:].reindex(columns=features, fill_value=0)
        pred = float(model.predict(row)[0])
        per_country[country] = pred
        total += pred
    return total, per_country


def historical_wide():
    """Pivot the long-format historical_df back to one row per date with
    imports_<country>/exports_<country> columns, for endpoints that expose
    the original wide shape (e.g. /historical-data)."""
    base = historical_df[['date', 'country', 'imports', 'exports', 'oil_price', 'usd_inr']]
    pivot = base.pivot(index='date', columns='country', values=['imports', 'exports'])
    pivot.columns = [f"{a}_{b}" for a, b in pivot.columns]
    pivot = pivot.reset_index()

    totals = historical_df.groupby('date').agg(
        trade_deficit=('trade_deficit', 'sum'),
        trade_deficit_next=('trade_deficit_next', 'sum'),
        oil_price=('oil_price', 'first'),
        usd_inr=('usd_inr', 'first'),
    ).reset_index()

    wide = totals.merge(pivot, on='date', how='left')
    wide['total_imports'] = wide[[f'imports_{c}' for c in COUNTRIES]].sum(axis=1)
    wide['total_exports'] = wide[[f'exports_{c}' for c in COUNTRIES]].sum(axis=1)
    return wide.sort_values('date').reset_index(drop=True)
