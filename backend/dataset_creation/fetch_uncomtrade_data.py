import requests
import pandas as pd
import time
import os
from dotenv import load_dotenv

load_dotenv()

# =========================
# CONFIG
# =========================

YEAR = 2025  # <<< CHANGE THIS EACH RUN

API_KEY = os.getenv("UNCOMTRADE_API_KEY")

COUNTRIES = {
    "Russia": 643,
    "China": 156,
    "USA": 842
}

REPORTER_CODE = 699  # India

BASE_URL = "https://comtradeapi.un.org/data/v1/get/C/M/HS"

HEADERS = {
    "Ocp-Apim-Subscription-Key": API_KEY,
    "Cache-Control": "no-cache"
}


# =========================
# FETCH FUNCTION
# =========================

def fetch_trade_data(partner_code, flow_code):

    rows = []

    for month in range(1, 13):

        period = f"{YEAR}{month:02d}"

        params = {
            "reporterCode": REPORTER_CODE,
            "partnerCode": partner_code,
            "period": period,
            "cmdCode": "TOTAL",
            "flowCode": flow_code,
            "aggregateBy": "period",
            "breakdownMode": "plus",
            "includeDesc": "true"
        }

        while True:

            r = requests.get(
                BASE_URL,
                params=params,
                headers=HEADERS,
                timeout=30
            )

            # ✅ rate limit
            if r.status_code == 429:
                print("Rate limit hit → waiting 25 sec")
                time.sleep(25)
                continue

            # ✅ other error
            if r.status_code != 200:
                print("Failed:", period, r.status_code)
                rows.append({
                    "date": pd.to_datetime(period, format="%Y%m"),
                    "value": 0
                })
                break

            js = r.json()

            if "data" not in js or len(js["data"]) == 0:
                value = 0
            else:
                value = js["data"][0]["primaryValue"]

            rows.append({
                "date": pd.to_datetime(period, format="%Y%m"),
                "value": value
            })

            print("OK", period)

            time.sleep(1)  # prevent limit
            break

    return pd.DataFrame(rows)


# =========================
# BUILD CSV FOR COUNTRY
# =========================

def build_trade_csv(country_name, partner_code):

    print(f"\nFetching {country_name} {YEAR}")

    imports = fetch_trade_data(partner_code, "M")
    exports = fetch_trade_data(partner_code, "X")

    imports.rename(
        columns={"value": f"India_Imports_{country_name}"},
        inplace=True
    )

    exports.rename(
        columns={"value": f"India_Exports_{country_name}"},
        inplace=True
    )

    df = imports.merge(exports, on="date", how="outer")

    df.sort_values("date", inplace=True)

    filename = f"trade_{country_name.lower()}_{YEAR}.csv"

    df.to_csv(filename, index=False)

    print("Saved:", filename)


# =========================
# MAIN LOOP
# =========================

for country, code in COUNTRIES.items():
    build_trade_csv(country, code)


print("\nDONE FOR YEAR", YEAR)