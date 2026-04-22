"""
merge_trade_2011.py
--------------------
Merges monthly trade, oil, and FX data with yearly GDP values
to produce a single 12-row dataset for 2011.

Output: final_2011.csv
"""

import pandas as pd


# ─────────────────────────────────────────────
# 1. Load trade files
# ─────────────────────────────────────────────

trade_russia = pd.read_csv("trade_russia_2025.csv", parse_dates=["date"])
trade_china  = pd.read_csv("trade_china_2025.csv",  parse_dates=["date"])
trade_usa    = pd.read_csv("trade_usa_2025.csv",    parse_dates=["date"])

# Rename columns to match expected format
trade_russia = trade_russia.rename(columns={
    "India_Imports_Russia": "imports_russia",
    "India_Exports_Russia": "exports_russia"
})
trade_china = trade_china.rename(columns={
    "India_Imports_China": "imports_china",
    "India_Exports_China": "exports_china"
})
trade_usa = trade_usa.rename(columns={
    "India_Imports_USA": "imports_usa",
    "India_Exports_USA": "exports_usa"
})


# ─────────────────────────────────────────────
# 2. Load oil prices and USD/INR exchange rate
# ─────────────────────────────────────────────

oil    = pd.read_csv("oil_2025.csv",     parse_dates=["date"])
usd_inr = pd.read_csv("usd_inr_2025.csv", parse_dates=["date"])


# ─────────────────────────────────────────────
# 3. Load GDP (yearly) and extract 2011 values
# ─────────────────────────────────────────────

gdp_all = pd.read_csv("gdp.csv")

# Filter for year 2011 and extract scalar GDP values
gdp_2011 = gdp_all[gdp_all["year"] == 2025].iloc[0]

gdp_india  = gdp_2011["gdp_india"]
gdp_russia = gdp_2011["gdp_russia"]
gdp_china  = gdp_2011["gdp_china"]
gdp_usa    = gdp_2011["gdp_usa"]


# ─────────────────────────────────────────────
# 4. Build the base date spine: 2011-01 to 2011-12
# ─────────────────────────────────────────────

date_spine = pd.DataFrame({
    "date": pd.date_range(start="2025-01-01", periods=12, freq="MS")
})


# ─────────────────────────────────────────────
# 5. Merge all monthly files onto the date spine
# ─────────────────────────────────────────────

df = date_spine \
    .merge(trade_russia, on="date", how="left") \
    .merge(trade_china,  on="date", how="left") \
    .merge(trade_usa,    on="date", how="left") \
    .merge(oil,          on="date", how="left") \
    .merge(usd_inr,      on="date", how="left")


# ─────────────────────────────────────────────
# 6. Broadcast yearly GDP across all 12 months
# ─────────────────────────────────────────────

df["gdp_india"]  = gdp_india
df["gdp_russia"] = gdp_russia
df["gdp_china"]  = gdp_china
df["gdp_usa"]    = gdp_usa


# ─────────────────────────────────────────────
# 7. Compute trade deficit
# ─────────────────────────────────────────────

df["total_imports"] = (
    df["imports_russia"] +
    df["imports_china"]  +
    df["imports_usa"]
)

df["total_exports"] = (
    df["exports_russia"] +
    df["exports_china"]  +
    df["exports_usa"]
)

df["trade_deficit"] = df["total_imports"] - df["total_exports"]


# ─────────────────────────────────────────────
# 8. Format date as YYYY-MM and select final columns
# ─────────────────────────────────────────────

df["date"] = df["date"].dt.strftime("%Y-%m")

final_columns = [
    "date",
    "imports_russia", "exports_russia",
    "imports_china",  "exports_china",
    "imports_usa",    "exports_usa",
    "oil_price",
    "usd_inr",
    "gdp_india",  "gdp_russia", "gdp_china", "gdp_usa",
    "trade_deficit",
]

df = df[final_columns]


# ─────────────────────────────────────────────
# 9. Validate: must have exactly 12 rows
# ─────────────────────────────────────────────

assert len(df) == 12, f"Expected 12 rows, got {len(df)}"
print(f"✓ Dataset has {len(df)} rows (2014-01 to 2014-12)")
print(f"✓ Columns: {list(df.columns)}")
print()
print(df.to_string(index=False))


# ─────────────────────────────────────────────
# 10. Save to CSV
# ─────────────────────────────────────────────

df.to_csv("final_2025.csv", index=False)
print("\n✓ Saved to final_202.csv")
