from fastapi import APIRouter
from app.utils.model_loader import historical_df, latest_market_data

router = APIRouter()

@router.get("/dashboard")
def dashboard():
    latest = historical_df.iloc[-1]
    
    oil_price = latest_market_data['oil_price'] if latest_market_data['oil_price'] is not None else latest["oil_price"]
    usd_inr = latest_market_data['usd_inr'] if latest_market_data['usd_inr'] is not None else latest["usd_inr"]

    return {
        "current_trade_deficit": float(latest["trade_deficit"]),
        "predicted_trade_deficit": float(latest["trade_deficit_next"]),
        "risk": "Medium",
        "model": "CatBoost",
        "oil_price": float(oil_price),
        "usd_inr": float(usd_inr),
        "last_updated": str(latest["date"])
    }