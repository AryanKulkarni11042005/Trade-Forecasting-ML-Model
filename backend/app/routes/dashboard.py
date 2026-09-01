from fastapi import APIRouter
from app.utils.model_loader import historical_df, latest_market_data, predict_total

router = APIRouter()

@router.get("/dashboard")
def dashboard():
    latest_date = historical_df['date'].max()
    latest_rows = historical_df[historical_df['date'] == latest_date]

    current_total = float(latest_rows['trade_deficit'].sum())
    predicted_total, _ = predict_total()

    oil_price = latest_market_data['oil_price'] if latest_market_data['oil_price'] is not None else float(latest_rows['oil_price'].iloc[0])
    usd_inr = latest_market_data['usd_inr'] if latest_market_data['usd_inr'] is not None else float(latest_rows['usd_inr'].iloc[0])

    return {
        "current_trade_deficit": current_total,
        "predicted_trade_deficit": predicted_total,
        "risk": "Medium",
        "model": "CatBoost",
        "oil_price": float(oil_price),
        "usd_inr": float(usd_inr),
        "last_updated": str(latest_date)
    }
