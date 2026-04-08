import requests
import os
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("EIA_API_KEY")

url = "https://api.eia.gov/v2/petroleum/pri/spt/data"

params = {
    "api_key": API_KEY,
    "frequency": "monthly",
    "data[0]": "value",
    "facets[product][]": "EPCBRENT",
    "start": "2026-02",
    "end": "2026-04",
    "sort[0][column]": "period",
    "sort[0][direction]": "asc",
    "offset": 0,
    "length": 5000
}

r = requests.get(url, params=params)

js = r.json()

data = js["response"]["data"]

rows = []

for item in data:
    rows.append({
        "date": item["period"],
        "oil_price": float(item["value"])
    })

df = pd.DataFrame(rows)

df.to_csv("oil_2025.csv", index=False)

print(df)