import requests
import pandas as pd
from datetime import datetime

# =========================
# CONFIG
# =========================
START_YEAR = 2016
END_YEAR = 2024

COUNTRIES = {
    "Russia": 643,
    "China": 156,
    "USA": 840
}

REPORTER_CODE = 699  # India
BASE_URL = "https://comtradeapi.un.org/data/v1/get/C/M/HS"

# =========================
# HELPER FUNCTIONS
# =========================
def fetch_trade_data(partner_code, flow_code):
    rows = []

    for year in range(START_YEAR, END_YEAR + 1):
        for month in range(1, 13):
            period = f"{year}{month:02d}"

            params = {
                "reporterCode": REPORTER_CODE,
                "partnerCode": partner_code,
                "period": period,
                "cmdCode": "TOTAL",
                "flowCode": flow_code,
                "aggregateBy": "period",
                "breakdownMode": "plus"
            }

            r = requests.get(BASE_URL, params=params, timeout=30)

            if r.status_code != 200:
                print(f"Failed: {period}")
                continue

            data = r.json().get("data", [])

            if len(data) == 0:
                rows.append({"date": pd.to_datetime(period, format="%Y%m"), "value": 0})
            else:
                rows.append({
                    "date": pd.to_datetime(period, format="%Y%m"),
                    "value": data[0]["primaryValue"]
                })

    return pd.DataFrame(rows)


def build_trade_csv(country_name, partner_code):
    print(f"Fetching {country_name} trade data...")

    imports = fetch_trade_data(partner_code, "M")
    exports = fetch_trade_data(partner_code, "X")

    imports.rename(columns={"value": f"India_Imports_{country_name}"}, inplace=True)
    exports.rename(columns={"value": f"India_Exports_{country_name}"}, inplace=True)

    df = imports.merge(exports, on="date", how="outer")
    df.sort_values("date", inplace=True)

    df.to_csv(f"trade_india_{country_name.lower()}.csv", index=False)
    return df


# =========================
# TRADE DATA
# =========================
trade_dfs = []

for country, code in COUNTRIES.items():
    df = build_trade_csv(country, code)
    trade_dfs.append(df)

# =========================
# MASTER DATE INDEX
# =========================
dates = pd.date_range(start="2016-01-01", end="2024-12-01", freq="MS")
master = pd.DataFrame({"date": dates})

for df in trade_dfs:
    master = master.merge(df, on="date", how="left")

# =========================
# MACRO DATA (PLACEHOLDERS)
# Replace later with real APIs
# =========================
master["Oil_Price"] = 60 + (master.index % 20)
master["USD_INR"] = 65 + (master.index % 10)

master["GDP_India"] = 2.3e12
master["GDP_Russia"] = 1.6e12
master["GDP_China"] = 14e12
master["GDP_USA"] = 21e12

# =========================
# TRADE BALANCE
# =========================
import_cols = [c for c in master.columns if "Imports" in c]
export_cols = [c for c in master.columns if "Exports" in c]

master["Total_Imports"] = master[import_cols].sum(axis=1)
master["Total_Exports"] = master[export_cols].sum(axis=1)

master["Trade_Balance"] = master["Total_Exports"] - master["Total_Imports"]

master.drop(columns=["Total_Imports", "Total_Exports"], inplace=True)

# =========================
# FINAL OUTPUT
# =========================
master.to_csv("final_trade_dataset.csv", index=False)

print("✅ Final dataset created: final_trade_dataset.csv")