import pandas as pd
import glob

files = glob.glob("../csv/final_*.csv")

dfs = []

for f in files:
    df = pd.read_csv(f)
    dfs.append(df)

df_all = pd.concat(dfs, ignore_index=True)

df_all = df_all.sort_values("date")

df_all = df_all.reset_index(drop=True)

# forecasting target
df_all["trade_deficit_next"] = df_all["trade_deficit"].shift(-1)

df_all = df_all.dropna()

df_all.to_csv("final_dataset_2011_2025.csv", index=False)

print("Done")