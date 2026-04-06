from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.dashboard import router as dashboard_router
from app.routes.forecast import router as forecast_router
from app.routes.simulator import router as simulator_router
from app.routes.explainability import router as explainability_router
from app.routes.data import router as data_router

app = FastAPI(title="Trade Forecasting API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)
app.include_router(forecast_router)
app.include_router(simulator_router)
app.include_router(explainability_router)
app.include_router(data_router)

@app.get("/")
def root():
    return {"message": "Trade Forecasting API Running"}