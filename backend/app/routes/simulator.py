from fastapi import APIRouter
from app.schemas.simulator_schema import SimulatorInput
from app.utils.model_loader import model, features, historical_df, latest_market_data, COUNTRIES

router = APIRouter()

from app.utils.feature_engineering import create_features

COUNTRY_CHANGE_FIELD = {
    "russia": "russia_change",
    "china": "china_change",
    "usa": "usa_change",
}

def _predict_for(df_source):
    """Re-run feature engineering per country and sum next-month predictions."""
    df = create_features(df_source)
    total = 0.0
    for country in COUNTRIES:
        sub = df[df['country'] == country]
        row = sub.iloc[-1:].reindex(columns=features, fill_value=0)
        total += float(model.predict(row)[0])
    return total

@router.post("/simulate")
def simulate(data: SimulatorInput):
    # Baseline: latest known row per country, with live oil/usd overrides applied
    df_baseline = historical_df.copy()
    latest_date = df_baseline['date'].max()
    baseline_idx = df_baseline.index[df_baseline['date'] == latest_date]

    if latest_market_data['oil_price'] is not None:
        df_baseline.loc[baseline_idx, 'oil_price'] = latest_market_data['oil_price']
    if latest_market_data['usd_inr'] is not None:
        df_baseline.loc[baseline_idx, 'usd_inr'] = latest_market_data['usd_inr']

    baseline_prediction = _predict_for(df_baseline)

    # Apply slider changes: oil/usd affect every country's latest row,
    # each country's own import change only affects its own row
    df_sim = historical_df.copy()
    sim_idx = df_sim.index[df_sim['date'] == latest_date]

    base_oil = latest_market_data['oil_price'] if latest_market_data['oil_price'] is not None else df_sim.loc[sim_idx[0], "oil_price"]
    base_usd = latest_market_data['usd_inr'] if latest_market_data['usd_inr'] is not None else df_sim.loc[sim_idx[0], "usd_inr"]

    df_sim.loc[sim_idx, "oil_price"] = base_oil * (1 + data.oil_change / 100)
    df_sim.loc[sim_idx, "usd_inr"] = base_usd * (1 + data.usd_change / 100)

    for country, field in COUNTRY_CHANGE_FIELD.items():
        change = getattr(data, field)
        row_idx = df_sim.index[(df_sim['date'] == latest_date) & (df_sim['country'] == country)]
        df_sim.loc[row_idx, "imports"] *= (1 + change / 100)

    prediction = _predict_for(df_sim)

    print("Baseline Prediction:", baseline_prediction)
    print("New Prediction:", prediction)

    return {
        "current_prediction": baseline_prediction,
        "new_prediction": prediction,
        "difference": round(prediction - baseline_prediction, 2),
        "difference_percent": round(((prediction - baseline_prediction) / abs(baseline_prediction)) * 100, 2)
    }