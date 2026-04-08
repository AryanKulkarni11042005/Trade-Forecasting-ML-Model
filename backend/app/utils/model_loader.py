from catboost import CatBoostRegressor
import joblib
import pandas as pd

model = CatBoostRegressor()
model.load_model("app/model/trade_model.cbm")

features = joblib.load("app/model/features.pkl")

from app.utils.feature_engineering import create_features

# Use your original dataset directly
historical_df = pd.read_csv("app/model/final_dataset_2011_2025.csv")

try:
    oil_df = pd.read_csv("../dataset_creation/oil_2026.csv")
    usd_inr_df = pd.read_csv("../dataset_creation/usd_inr_2026.csv")
    
    latest_oil = oil_df.dropna(subset=['oil_price']).iloc[-1]['oil_price']
    historical_df.loc[historical_df.index[-1], 'oil_price'] = float(latest_oil)

    usd_inr_df['usd_inr'] = pd.to_numeric(usd_inr_df['usd_inr'], errors='coerce')
    latest_usd_inr = usd_inr_df.dropna(subset=['usd_inr']).iloc[-1]['usd_inr']
    historical_df.loc[historical_df.index[-1], 'usd_inr'] = float(latest_usd_inr)
except Exception as e:
    print("Could not load latest oil/usd data:", e)

historical_df['date'] = pd.to_datetime(historical_df['date'])
historical_df = historical_df.sort_values('date').reset_index(drop=True)
historical_df = create_features(historical_df)

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