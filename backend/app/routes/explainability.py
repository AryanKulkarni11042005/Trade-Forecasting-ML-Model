from fastapi import APIRouter
from app.utils.model_loader import feature_importance

router = APIRouter()

@router.get("/feature-importance")
def explainability():
    return {
        "title": "Why did the model predict this?",
        "feature_importance": feature_importance,
        "insights": [
            {
                "feature": "Oil Price",
                "impact": "+8%",
                "type": "positive"
            },
            {
                "feature": "USD/INR",
                "impact": "+5%",
                "type": "positive"
            },
            {
                "feature": "Imports from China",
                "impact": "+4%",
                "type": "positive"
            }
        ]
    }