from pathlib import Path

import numpy as np

import keras
import json

from flask import Flask
from flask_cors import CORS
from flask import request, jsonify

app = Flask(__name__)
CORS(app)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


# paths
models_path = Path(__file__).parents[0].joinpath("models")

demand_model = None
supply_model = None

supply_scaler = None
demand_scaler = None


def load_demand_model(model_dir=models_path):
    global demand_model
    demand_model = keras.models.load_model(model_dir.joinpath("demand_model.keras"))
    return demand_model


def load_supply_model(model_dir=models_path):
    global supply_model
    supply_model = keras.models.load_model(model_dir.joinpath("supply_model.keras"))
    return supply_model


def load_supply_scaler_params(model_dir=models_path):
    global supply_scaler
    with open(model_dir.joinpath("supply_scaler_params.json"), "r") as f:
        supply_scaler = json.load(f)

    return supply_scaler


def load_demand_scaler_params(model_dir=models_path):
    global demand_scaler
    with open(model_dir.joinpath("demand_scaler_params.json"), "r") as f:
        demand_scaler = json.load(f)

    return demand_scaler


# year values


def transform_demand_year_values(demands):
    index = demand_scaler["year_scaler_feature_names"].index("QTY_DEMANDED")

    min_val = demand_scaler["year_scaler_data_min"][index]
    max_val = demand_scaler["year_scaler_data_max"][index]

    return [(x - min_val) / (max_val - min_val) for x in demands]


def inverse_transform_demand_year_values(demands):

    index = demand_scaler["year_scaler_feature_names"].index("QTY_DEMANDED")

    min_val = demand_scaler["year_scaler_data_min"][index]
    max_val = demand_scaler["year_scaler_data_max"][index]

    return [x * (max_val - min_val) + min_val for x in demands]


def transform_supply_year_values(supplies):

    index = supply_scaler["year_scaler_feature_names"].index("QTY_SUPPLIED")

    min_val = supply_scaler["year_scaler_data_min"][index]
    max_val = supply_scaler["year_scaler_data_max"][index]

    return [(x - min_val) / (max_val - min_val) for x in supplies]


def inverse_transform_supply_year_values(supplies):

    index = supply_scaler["year_scaler_feature_names"].index("QTY_SUPPLIED")

    min_val = supply_scaler["year_scaler_data_min"][index]
    max_val = supply_scaler["year_scaler_data_max"][index]

    return [x * (max_val - min_val) + min_val for x in supplies]


# month values


def transform_demand_month_values(demands):

    index = demand_scaler["month_scaler_feature_names"].index("QTY_DEMANDED")

    min_val = demand_scaler["month_scaler_data_min"][index]
    max_val = demand_scaler["month_scaler_data_max"][index]

    return [(x - min_val) / (max_val - min_val) for x in demands]


def inverse_transform_demand_month_values(demands):

    index = demand_scaler["month_scaler_feature_names"].index("QTY_DEMANDED")

    min_val = demand_scaler["month_scaler_data_min"][index]
    max_val = demand_scaler["month_scaler_data_max"][index]

    return [x * (max_val - min_val) + min_val for x in demands]


def transform_supply_month_values(supplies):

    index = supply_scaler["month_scaler_feature_names"].index("QTY_SUPPLIED")

    min_val = supply_scaler["month_scaler_data_min"][index]
    max_val = supply_scaler["month_scaler_data_max"][index]

    return [(x - min_val) / (max_val - min_val) for x in supplies]


def inverse_transform_supply_month_values(supplies):

    index = supply_scaler["month_scaler_feature_names"].index("QTY_SUPPLIED")

    min_val = supply_scaler["month_scaler_data_min"][index]
    max_val = supply_scaler["month_scaler_data_max"][index]

    return [x * (max_val - min_val) + min_val for x in supplies]


def predict_demand_values(
    yearly_demands,
    monthly_demands,
    n_yearly_demands=4,
    n_monthly_demands=6,
    batched=False,
):
    yearly_demands = np.array(transform_demand_year_values(yearly_demands))
    monthly_demands = np.array(transform_demand_month_values(monthly_demands))
    if not batched:
        yearly_demands = yearly_demands.reshape(1, n_yearly_demands)
        monthly_demands = monthly_demands.reshape(1, n_monthly_demands)
    predictions = demand_model.predict([yearly_demands, monthly_demands])
    return inverse_transform_demand_month_values(predictions)


def predict_supply_values(
    yearly_supplies,
    monthly_supplies,
    n_yearly_supplies=4,
    n_monthly_supplies=6,
    batched=False,
):
    yearly_supplies = np.array(transform_supply_year_values(yearly_supplies))
    monthly_supplies = np.array(transform_supply_month_values(monthly_supplies))
    if not batched:
        yearly_supplies = yearly_supplies.reshape(1, n_yearly_supplies)
        monthly_supplies = monthly_supplies.reshape(1, n_monthly_supplies)
    predictions = demand_model.predict([yearly_supplies, monthly_supplies])
    return inverse_transform_supply_month_values(predictions)


def convert_to_serializable(obj):
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, list):  # Recursively process nested lists
        return [convert_to_serializable(item) for item in obj]
    return obj  # Return as is if it's already serializable


@app.route("/predict_demand_values", methods=["POST"])
def api_predict_demand_values():
    try:
        # Get data from the request body (JSON)
        data = request.get_json()
        print(data)

        yearly_demands = data.get("yearly_demands")
        monthly_demands = data.get("monthly_demands")

        if not yearly_demands or not monthly_demands:
            return (
                jsonify(
                    {
                        "error": "Both 'yearly_demands' and 'monthly_demands' are required."
                    }
                ),
                400,
            )

        # Load models and scalers
        load_demand_model()
        load_supply_model()
        load_demand_scaler_params()
        load_supply_scaler_params()

        # Make prediction
        prediction = predict_demand_values(yearly_demands, monthly_demands)

        print(type(prediction))
        prediction = convert_to_serializable(prediction)
        print(type(prediction))
        # Return prediction as JSON response
        return jsonify({"prediction": prediction}), 200

    except Exception as e:
        print(e)
        # Return error message if an exception occurs
        return jsonify({"error": str(e)}), 500


@app.route("/predict_supply_values", methods=["POST"])
def api_predict_supply_values():
    try:
        # Get data from the request body (JSON)
        data = request.get_json()
        print(data)

        yearly_supplies = data.get("yearly_supplies")
        monthly_supplies = data.get("monthly_supplies")

        print(yearly_supplies, monthly_supplies)

        if not yearly_supplies or not monthly_supplies:
            return (
                jsonify(
                    {
                        "error": "Both 'yearly_supplies' and 'monthly_supplies' are required."
                    }
                ),
                400,
            )

        # Load models and scalers
        load_demand_model()
        load_supply_model()
        load_demand_scaler_params()
        load_supply_scaler_params()

        # Make prediction
        prediction = predict_supply_values(yearly_supplies, monthly_supplies)

        print(type(prediction))
        prediction = convert_to_serializable(prediction)
        print(type(prediction))
        # Return prediction as JSON response
        return jsonify({"prediction": prediction}), 200

    except Exception as e:
        print(e)
        # Return error message if an exception occurs
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    load_demand_model()
    load_supply_model()
    load_demand_scaler_params()
    load_supply_scaler_params()
    app.run(debug=True)

    # # Example
    # print(
    #     predict_demand_values([1000, 2000, 3000, 2000], [100, 200, 150, 250, 188, 120])
    # )
    # print(
    #     predict_supply_values([2000, 1000, 2000, 3000], [150, 120, 130, 150, 188, 120])
    # )
