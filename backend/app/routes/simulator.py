from fastapi import APIRouter
from app.schemas.simulator_schema import SimulatorInput
from app.utils.model_loader import model, features, historical_df

router = APIRouter()

from app.utils.feature_engineering import create_features

@router.post("/simulate")
def simulate(data: SimulatorInput):
    # Use full historical_df so that rolling/lag calculations work
    df_sim = historical_df.copy()
    
    # Target the last row
    idx = df_sim.index[-1]
    
    df_sim.loc[idx, "oil_price"] *= (1 + data.oil_change / 100)
    df_sim.loc[idx, "usd_inr"] *= (1 + data.usd_change / 100)
    df_sim.loc[idx, "imports_china"] *= (1 + data.china_change / 100)
    df_sim.loc[idx, "imports_usa"] *= (1 + data.usa_change / 100)
    df_sim.loc[idx, "imports_russia"] *= (1 + data.russia_change / 100)

    # Re-run feature engineering on the WHOLE dataframe to consistently derive features for the last row
    df_sim = create_features(df_sim)
    
    # Extract the simulated last row
    latest = df_sim.iloc[-1:].copy()

    row = latest.reindex(columns=features, fill_value=0)

    prediction = float(model.predict(row)[0])
    current = float(historical_df.iloc[-1]["trade_deficit_next"])

    return {
        "current_prediction": current,
        "new_prediction": prediction,
        "difference": round(prediction - current, 2),
        "difference_percent": round(((prediction - current) / abs(current)) * 100, 2)
    }