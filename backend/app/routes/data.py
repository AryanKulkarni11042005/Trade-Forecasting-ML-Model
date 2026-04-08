from fastapi import APIRouter
from app.utils.model_loader import historical_df

router = APIRouter()

import numpy as np

@router.get("/historical-data")
def historical_data():
    return historical_df.replace({np.nan: None}).to_dict("records")