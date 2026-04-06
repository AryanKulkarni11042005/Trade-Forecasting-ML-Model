from pydantic import BaseModel

class SimulatorInput(BaseModel):
    oil_change: float
    usd_change: float
    china_change: float
    usa_change: float
    russia_change: float