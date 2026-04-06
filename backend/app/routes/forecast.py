from fastapi import APIRouter
from app.utils.model_loader import model, features, historical_df
import pandas as pd

router = APIRouter()

@router.get("/forecast")
def forecast():
    latest = historical_df.iloc[-1:].copy()

    row = latest.copy()

    # Ensure only required feature columns are used
    row = row.reindex(columns=features, fill_value=0)

    prediction = float(model.predict(row)[0])

    return {
        "next_month_forecast": prediction,
        "three_month_forecast": round(prediction * 1.03, 2),
        "six_month_forecast": round(prediction * 1.06, 2),
        "risk": "Medium",
        "chart": {
            "historical": historical_df[["date", "trade_deficit"]].tail(24).to_dict("records"),
            "forecast": [
                {
                    "date": "2025-11-01",
                    "value": prediction
                },
                {
                    "date": "2025-12-01",
                    "value": round(prediction * 1.03, 2)
                },
                {
                    "date": "2026-01-01",
                    "value": round(prediction * 1.05, 2)
                }
            ]
        }
    }