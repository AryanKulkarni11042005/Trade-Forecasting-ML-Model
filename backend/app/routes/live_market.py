import os
import time
import requests
import yfinance as yf
from fastapi import APIRouter
from datetime import datetime
from dotenv import load_dotenv
from app.utils.model_loader import historical_df

load_dotenv(os.path.join(os.path.dirname(__file__), "../../../.env"))
load_dotenv() # Fallback to local .env if any

router = APIRouter()

CACHE = {}
CACHE_TTL = 300  # 5 minutes

def fetch_live_data():
    now = time.time()
    if "data" in CACHE and (now - CACHE["timestamp"]) < CACHE_TTL:
        return CACHE["data"]

    # Fallback values from historical_df
    fallback_latest = historical_df.iloc[-1]
    usd_inr = float(fallback_latest["usd_inr"])
    oil_price = float(fallback_latest["oil_price"])

    # 1. Fetch USD/INR
    try:
        data = yf.download("USDINR=X", period="5d", interval="1d", progress=False)
        if not data.empty:
            # yfinance returns a DataFrame where Close might be a Series
            val = data["Close"].iloc[-1]
            if hasattr(val, "item"):
                usd_inr = float(val.item())
            else:
                usd_inr = float(val)
    except Exception as e:
        print(f"yfinance fetch error: {e}")

    # 2. Fetch Brent Oil Price
    try:
        api_key = os.getenv("EIA_API_KEY")
        if api_key:
            url = "https://api.eia.gov/v2/petroleum/pri/spt/data"
            params = {
                "api_key": api_key,
                "frequency": "monthly",
                "data[0]": "value",
                "facets[product][]": "EPCBRENT",
                "sort[0][column]": "period",
                "sort[0][direction]": "desc",
                "offset": 0,
                "length": 1
            }
            r = requests.get(url, params=params, timeout=10)
            if r.status_code == 200:
                js = r.json()
                data_list = js.get("response", {}).get("data", [])
                if data_list:
                    oil_price = float(data_list[0]["value"])
    except Exception as e:
        print(f"EIA API fetch error: {e}")

    result = {
        "usd_inr": round(usd_inr, 2),
        "oil_price": round(oil_price, 2),
        "updated_at": datetime.now().isoformat()
    }

    CACHE["data"] = result
    CACHE["timestamp"] = now
    return result

@router.get("/live-market")
def get_live_market():
    return fetch_live_data()
