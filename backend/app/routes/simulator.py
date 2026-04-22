from fastapi import APIRouter
from app.schemas.simulator_schema import SimulatorInput
from app.utils.model_loader import model, features, historical_df, latest_market_data

router = APIRouter()

from app.utils.feature_engineering import create_features

@router.post("/simulate")
def simulate(data: SimulatorInput):
    # Calculate baseline first on the untouched dataset
    df_baseline = historical_df.copy()
    idx = df_baseline.index[-1]
    
    if latest_market_data['oil_price'] is not None:
        df_baseline.loc[idx, 'oil_price'] = latest_market_data['oil_price']
    if latest_market_data['usd_inr'] is not None:
        df_baseline.loc[idx, 'usd_inr'] = latest_market_data['usd_inr']
        
    df_baseline = create_features(df_baseline)
    baseline_latest = df_baseline.iloc[-1:].copy()
    baseline_row = baseline_latest.reindex(columns=features, fill_value=0)
    baseline_prediction = float(model.predict(baseline_row)[0])

    # Now apply slider changes
    df_sim = historical_df.copy()
    
    base_oil = latest_market_data['oil_price'] if latest_market_data['oil_price'] is not None else df_sim.loc[idx, "oil_price"]
    base_usd = latest_market_data['usd_inr'] if latest_market_data['usd_inr'] is not None else df_sim.loc[idx, "usd_inr"]
    
    df_sim.loc[idx, "oil_price"] = base_oil * (1 + data.oil_change / 100)
    df_sim.loc[idx, "usd_inr"] = base_usd * (1 + data.usd_change / 100)
    df_sim.loc[idx, "imports_china"] *= (1 + data.china_change / 100)
    df_sim.loc[idx, "imports_usa"] *= (1 + data.usa_change / 100)
    df_sim.loc[idx, "imports_russia"] *= (1 + data.russia_change / 100)

    # Re-run feature engineering on the WHOLE dataframe to consistently derive features for the last row
    df_sim = create_features(df_sim)
    
    # Extract the simulated last row
    latest = df_sim.iloc[-1:].copy()

    row = latest.reindex(columns=features, fill_value=0)

    prediction = float(model.predict(row)[0])

    print("Baseline Prediction:", baseline_prediction)
    print("New Prediction:", prediction)
    print("Oil Price:", latest["oil_price"].values[0])
    print("USD/INR:", latest["usd_inr"].values[0])

    return {
        "current_prediction": baseline_prediction,
        "new_prediction": prediction,
        "difference": round(prediction - baseline_prediction, 2),
        "difference_percent": round(((prediction - baseline_prediction) / abs(baseline_prediction)) * 100, 2)
    }