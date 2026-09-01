from fastapi import APIRouter
from app.utils.model_loader import historical_df, predict_total

router = APIRouter()

@router.get("/forecast")
def forecast():
    prediction, per_country = predict_total()

    history = (
        historical_df.groupby('date')['trade_deficit']
        .sum()
        .reset_index()
        .sort_values('date')
        .tail(24)
    )

    return {
        "next_month_forecast": prediction,
        "three_month_forecast": round(prediction * 1.03, 2),
        "six_month_forecast": round(prediction * 1.06, 2),
        "risk": "Medium",
        "by_country": per_country,
        "chart": {
            "historical": history.to_dict("records"),
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
