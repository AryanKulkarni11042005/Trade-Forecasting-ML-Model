import pandas as pd
import numpy as np

def create_features(df_input):
    df = df_input.copy()
    if 'date' in df.columns and not pd.api.types.is_datetime64_any_dtype(df['date']):
        df['date'] = pd.to_datetime(df['date'])

    df = df.sort_values(['country', 'date']).reset_index(drop=True)
    g = df.groupby('country')

    # Lag features
    lags = [1, 2, 3, 6, 9, 12, 18, 24]
    for lag in lags:
        df[f'td_lag_{lag}']     = g['trade_deficit'].shift(lag)
        df[f'import_lag_{lag}'] = g['imports'].shift(lag)

    # Rolling statistics (shift(1) to avoid leakage)
    shifted_td = g['trade_deficit'].shift(1)
    df['td_roll_mean_3']  = shifted_td.groupby(df['country']).rolling(3).mean().reset_index(level=0, drop=True)
    df['td_roll_std_3']   = shifted_td.groupby(df['country']).rolling(3).std().reset_index(level=0, drop=True)
    df['td_roll_mean_6']  = shifted_td.groupby(df['country']).rolling(6).mean().reset_index(level=0, drop=True)
    df['td_roll_mean_12'] = shifted_td.groupby(df['country']).rolling(12).mean().reset_index(level=0, drop=True)

    # Exponentially weighted means
    df['td_ewm_3']  = shifted_td.groupby(df['country']).transform(lambda s: s.ewm(span=3).mean())
    df['td_ewm_6']  = shifted_td.groupby(df['country']).transform(lambda s: s.ewm(span=6).mean())
    df['td_ewm_12'] = shifted_td.groupby(df['country']).transform(lambda s: s.ewm(span=12).mean())

    df['ewm_ratio'] = df['td_ewm_3'] / df['td_ewm_12'].replace(0, np.nan)

    # YoY change
    df['td_yoy_change'] = g['trade_deficit'].shift(1) - g['trade_deficit'].shift(13)

    # Seasonality
    df['month']     = df['date'].dt.month
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)

    # Macro interaction
    df['usd_squared']         = df['usd_inr'] ** 2
    df['oil_squared']         = df['oil_price'] ** 2
    df['usd_oil_interaction'] = df['usd_inr'] * df['oil_price']

    # Differences (per-country)
    df['td_diff']  = g['trade_deficit'].diff()
    df['usd_diff'] = df['usd_inr'].diff()
    df['oil_diff'] = df['oil_price'].diff()

    # Regime flags
    df['covid_flag'] = (df['date'] >= '2020-03-01').astype(int)
    df['war_flag']   = (df['date'] >= '2022-02-01').astype(int)

    war_start = pd.Timestamp('2022-02-01')
    df['months_since_war'] = ((df['date'] - war_start) / pd.Timedelta('30D')).clip(lower=0)

    # Country as categorical feature
    df['country'] = df['country'].astype('category')

    return df
