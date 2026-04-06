from fastapi import APIRouter
from app.utils.model_loader import historical_df

router = APIRouter()

@router.get("/dashboard")
def dashboard():
    latest = historical_df.iloc[-1]

    return {
        "current_trade_deficit": float(latest["trade_deficit"]),
        "predicted_trade_deficit": float(latest["trade_deficit_next"]),
        "risk": "Medium",
        "model": "CatBoost",
        "oil_price": float(latest["oil_price"]),
        "usd_inr": float(latest["usd_inr"]),
        "last_updated": str(latest["date"])
    }