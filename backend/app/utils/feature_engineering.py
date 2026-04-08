import pandas as pd
import numpy as np

def create_features(df_input):
    df = df_input.copy()
    if 'date' in df.columns and not pd.api.types.is_datetime64_any_dtype(df['date']):
        df['date'] = pd.to_datetime(df['date'])

    # Lag features
    lags = [1, 2, 3, 6, 9, 12, 18, 24]
    for lag in lags:
        df[f'td_lag_{lag}']     = df['trade_deficit'].shift(lag)
        df[f'import_lag_{lag}'] = df['imports_russia'].shift(lag)

    # China & USA import lags
    for lag in [1, 2, 3, 6, 12]:
        df[f'imports_china_lag_{lag}'] = df['imports_china'].shift(lag)
        df[f'imports_usa_lag_{lag}']   = df['imports_usa'].shift(lag)

    # Rolling statistics
    df['td_roll_mean_3']  = df['trade_deficit'].shift(1).rolling(3).mean()
    df['td_roll_std_3']   = df['trade_deficit'].shift(1).rolling(3).std()
    df['td_roll_mean_6']  = df['trade_deficit'].shift(1).rolling(6).mean()
    df['td_roll_mean_12'] = df['trade_deficit'].shift(1).rolling(12).mean()

    # Exponentially weighted means
    df['td_ewm_3']  = df['trade_deficit'].shift(1).ewm(span=3).mean()
    df['td_ewm_6']  = df['trade_deficit'].shift(1).ewm(span=6).mean()
    df['td_ewm_12'] = df['trade_deficit'].shift(1).ewm(span=12).mean()

    df['ewm_ratio'] = df['td_ewm_3'] / df['td_ewm_12'].replace(0, np.nan)

    # YoY change
    df['td_yoy_change'] = df['trade_deficit'].shift(1) - df['trade_deficit'].shift(13)

    # Seasonality
    df['month']     = df['date'].dt.month
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)

    # Macro interaction
    df['usd_squared']         = df['usd_inr'] ** 2
    df['oil_squared']         = df['oil_price'] ** 2
    df['usd_oil_interaction'] = df['usd_inr'] * df['oil_price']

    # Differences
    df['td_diff']  = df['trade_deficit'].diff()
    df['usd_diff'] = df['usd_inr'].diff()
    df['oil_diff'] = df['oil_price'].diff()

    # Regime flags
    df['covid_flag'] = (df['date'] >= '2020-03-01').astype(int)
    df['war_flag']   = (df['date'] >= '2022-02-01').astype(int)

    war_start = pd.Timestamp('2022-02-01')
    df['months_since_war'] = ((df['date'] - war_start) / pd.Timedelta('30D')).clip(lower=0)

    return df
