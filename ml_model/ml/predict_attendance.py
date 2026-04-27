import argparse
import json
from pathlib import Path
from typing import Any

import joblib
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = PROJECT_ROOT / "models" / "mess_attendance_model.pkl"

FEATURE_ORDER = [
    "meal_type",
    "day_of_week",
    "menu_popularity_score",
    "holiday_flag",
    "exam_period_flag",
    "total_registered_students",
    "current_bookings",
    "last_7_day_avg_attendance",
]


def load_trained_model(model_path: Path = MODEL_PATH) -> Any:
    """Load the trained pipeline from disk."""
    if not model_path.exists():
        raise FileNotFoundError(
            f"Model not found at: {model_path}. Run ml/train_model.py first."
        )
    return joblib.load(model_path)


def predict_attendance(input_data: dict) -> float:
    """Predict meal attendance for a single input record."""
    missing_keys = [key for key in FEATURE_ORDER if key not in input_data]
    if missing_keys:
        raise ValueError(f"Missing required input fields: {missing_keys}")

    model = load_trained_model()
    input_df = pd.DataFrame([input_data], columns=FEATURE_ORDER)

    prediction = model.predict(input_df)[0]
    return float(prediction)


def parse_args() -> argparse.Namespace:
    """Parse CLI arguments for inference."""
    parser = argparse.ArgumentParser(description="Predict mess meal attendance")
    parser.add_argument(
        "--input_json",
        type=str,
        default=None,
        help="JSON string containing all required input fields",
    )
    parser.add_argument(
        "--input_file",
        type=str,
        default=None,
        help="Path to a JSON file containing all required input fields",
    )
    return parser.parse_args()


def main() -> None:
    """Run prediction from CLI JSON input or fallback sample."""
    args = parse_args()

    if args.input_file and args.input_json:
        raise ValueError("Use either --input_file or --input_json, not both.")

    if args.input_file:
        input_path = Path(args.input_file)
        if not input_path.exists():
            raise FileNotFoundError(f"Input file not found: {input_path}")
        with input_path.open("r", encoding="utf-8") as file:
            input_data = json.load(file)
    elif args.input_json:
        try:
            input_data = json.loads(args.input_json)
        except json.JSONDecodeError as exc:
            raise ValueError(f"Invalid JSON passed to --input_json: {exc}") from exc
    else:
        input_data = {
            "meal_type": "dinner",
            "day_of_week": 2,
            "menu_popularity_score": 8,
            "holiday_flag": 0,
            "exam_period_flag": 0,
            "total_registered_students": 500,
            "current_bookings": 320,
            "last_7_day_avg_attendance": 295,
        }

    predicted_attendance = predict_attendance(input_data)
    print(f"Predicted attendance: {predicted_attendance:.2f}")


if __name__ == "__main__":
    main()
