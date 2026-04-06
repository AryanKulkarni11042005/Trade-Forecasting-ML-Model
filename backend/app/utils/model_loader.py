from catboost import CatBoostRegressor
import joblib
import pandas as pd

model = CatBoostRegressor()
model.load_model("app/model/trade_model.cbm")

features = joblib.load("app/model/features.pkl")

# Use your original dataset directly
historical_df = pd.read_csv("app/model/final_dataset_2011_2025.csv")

# Build feature importance dynamically from the CatBoost model
importance_values = model.get_feature_importance()

feature_importance = [
    {
        "feature": feature,
        "importance": float(importance)
    }
    for feature, importance in sorted(
        zip(features, importance_values),
        key=lambda x: x[1],
        reverse=True
    )[:10]
]