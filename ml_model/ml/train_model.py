from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = PROJECT_ROOT / "data" / "data_set.csv"
MODEL_PATH = PROJECT_ROOT / "models" / "mess_attendance_model.pkl"

TARGET_COLUMN = "actual_attendance"
CATEGORICAL_FEATURES = ["meal_type"]
NUMERIC_FEATURES = [
    "day_of_week",
    "menu_popularity_score",
    "holiday_flag",
    "exam_period_flag",
    "total_registered_students",
    "current_bookings",
    "last_7_day_avg_attendance",
]


def load_dataset(file_path: Path) -> pd.DataFrame:
    """Load dataset from CSV file."""
    if not file_path.exists():
        raise FileNotFoundError(f"Dataset not found at: {file_path}")
    return pd.read_csv(file_path)


def handle_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """Fill missing values in-place and return a cleaned DataFrame."""
    missing_counts = df.isnull().sum()
    total_missing = int(missing_counts.sum())

    if total_missing == 0:
        print("No missing values found.")
        return df

    print("Missing values detected. Applying imputation...")
    for column in df.columns:
        if df[column].isnull().any():
            if df[column].dtype == "object":
                mode_value = df[column].mode(dropna=True)
                if not mode_value.empty:
                    df[column] = df[column].fillna(mode_value.iloc[0])
            else:
                median_value = df[column].median()
                df[column] = df[column].fillna(median_value)

    print("Missing values handled successfully.")
    return df


def build_pipeline() -> Pipeline:
    """Create preprocessing + regression pipeline."""
    preprocessor = ColumnTransformer(
        transformers=[
            (
                "meal_type_encoder",
                OneHotEncoder(handle_unknown="ignore"),
                CATEGORICAL_FEATURES,
            ),
            ("numeric_features", "passthrough", NUMERIC_FEATURES),
        ]
    )

    model = RandomForestRegressor(
        n_estimators=300,
        random_state=42,
        n_jobs=-1,
    )

    return Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model),
        ]
    )


def evaluate_model(model: Pipeline, x_test: pd.DataFrame, y_test: pd.Series) -> dict:
    """Compute MAE, RMSE, and R2 metrics."""
    predictions = model.predict(x_test)

    mae = mean_absolute_error(y_test, predictions)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    r2 = r2_score(y_test, predictions)

    return {
        "mae": mae,
        "rmse": rmse,
        "r2": r2,
    }


def train_and_save_model() -> None:
    """Train model, evaluate, and save pipeline artifact."""
    df = load_dataset(DATA_PATH)
    df = handle_missing_values(df)

    x = df[CATEGORICAL_FEATURES + NUMERIC_FEATURES]
    y = df[TARGET_COLUMN]

    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=42,
    )

    pipeline = build_pipeline()
    pipeline.fit(x_train, y_train)

    metrics = evaluate_model(pipeline, x_test, y_test)

    print("Model Performance:")
    print(f"MAE:  {metrics['mae']:.4f}")
    print(f"RMSE: {metrics['rmse']:.4f}")
    print(f"R2:   {metrics['r2']:.4f}")

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Model saved to: {MODEL_PATH}")


if __name__ == "__main__":
    train_and_save_model()
