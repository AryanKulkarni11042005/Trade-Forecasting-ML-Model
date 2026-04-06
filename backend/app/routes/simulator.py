from fastapi import APIRouter
from app.schemas.simulator_schema import SimulatorInput
from app.utils.model_loader import model, features, historical_df

router = APIRouter()

@router.post("/simulate")
def simulate(data: SimulatorInput):
    latest = historical_df.iloc[-1:].copy()

    latest["oil_price"] *= (1 + data.oil_change / 100)
    latest["usd_inr"] *= (1 + data.usd_change / 100)
    latest["imports_china"] *= (1 + data.china_change / 100)
    latest["imports_usa"] *= (1 + data.usa_change / 100)
    latest["imports_russia"] *= (1 + data.russia_change / 100)

    latest["usd_oil_interaction"] = latest["usd_inr"] * latest["oil_price"]

    row = latest.reindex(columns=features, fill_value=0)

    prediction = float(model.predict(row)[0])
    current = float(historical_df.iloc[-1]["trade_deficit_next"])

    return {
        "current_prediction": current,
        "new_prediction": prediction,
        "difference": round(prediction - current, 2),
        "difference_percent": round(((prediction - current) / current) * 100, 2)
    }