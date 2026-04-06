from fastapi import APIRouter
from app.utils.model_loader import historical_df

router = APIRouter()

@router.get("/historical-data")
def historical_data():
    return historical_df.to_dict("records")