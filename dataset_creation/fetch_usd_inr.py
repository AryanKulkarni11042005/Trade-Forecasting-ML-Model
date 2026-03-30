import yfinance as yf
import pandas as pd

data = yf.download(
    "USDINR=X",
    start="2025-01-01",
    end="2025-12-31",
    interval="1mo"
)

data = data.reset_index()

data["date"] = data["Date"].dt.strftime("%Y-%m")

data = data[["date", "Close"]]

data.rename(
    columns={"Close": "usd_inr"},
    inplace=True
)

data.to_csv("usd_inr_2025.csv", index=False)

print(data)