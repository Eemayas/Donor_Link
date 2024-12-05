from pathlib import Path

import numpy as np

import keras
import json

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
    with open(model_dir.joinpath("supply_scaler_params.json"), 'r') as f:
        supply_scaler = json.load(f)
    
    return supply_scaler

def load_demand_scaler_params(model_dir=models_path):
    global demand_scaler
    with open(model_dir.joinpath("demand_scaler_params.json"), 'r') as f:
        demand_scaler = json.load(f)
    
    return demand_scaler

# year values

def transform_demand_year_values(demands):
    index = demand_scaler["year_scaler_feature_names"].index("QTY_DEMANDED")

    min_val = demand_scaler["year_scaler_data_min"][index]
    max_val = demand_scaler["year_scaler_data_max"][index]

    return [(x - min_val)/ (max_val - min_val) for x in demands]

def inverse_transform_demand_year_values(demands):

    index = demand_scaler["year_scaler_feature_names"].index("QTY_DEMANDED")

    min_val = demand_scaler["year_scaler_data_min"][index]
    max_val = demand_scaler["year_scaler_data_max"][index]

    return [x * (max_val - min_val) + min_val for x in demands]

def transform_supply_year_values(supplies):

    index = supply_scaler["year_scaler_feature_names"].index("QTY_SUPPLIED")

    min_val = supply_scaler["year_scaler_data_min"][index]
    max_val = supply_scaler["year_scaler_data_max"][index]

    return [(x - min_val)/ (max_val - min_val) for x in supplies]

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

    return [(x - min_val)/ (max_val - min_val) for x in demands]

def inverse_transform_demand_month_values(demands):

    index = demand_scaler["month_scaler_feature_names"].index("QTY_DEMANDED")

    min_val = demand_scaler["month_scaler_data_min"][index]
    max_val = demand_scaler["month_scaler_data_max"][index]

    return [x * (max_val - min_val) + min_val for x in demands]

def transform_supply_month_values(supplies):

    index = supply_scaler["month_scaler_feature_names"].index("QTY_SUPPLIED")

    min_val = supply_scaler["month_scaler_data_min"][index]
    max_val = supply_scaler["month_scaler_data_max"][index]

    return [(x - min_val)/ (max_val - min_val) for x in supplies]

def inverse_transform_supply_month_values(supplies):

    index = supply_scaler["month_scaler_feature_names"].index("QTY_SUPPLIED")

    min_val = supply_scaler["month_scaler_data_min"][index]
    max_val = supply_scaler["month_scaler_data_max"][index]

    return [x * (max_val - min_val) + min_val for x in supplies]


def predict_demand_values(yearly_demands, monthly_demands, n_yearly_demands=4, n_monthly_demands=6, batched=False):
    yearly_demands = np.array(transform_demand_year_values(yearly_demands))
    monthly_demands = np.array(transform_demand_month_values(monthly_demands))
    if not batched:
        yearly_demands = yearly_demands.reshape(1, n_yearly_demands)
        monthly_demands = monthly_demands.reshape(1, n_monthly_demands)
    predictions =  demand_model.predict([yearly_demands, monthly_demands])
    return inverse_transform_demand_month_values(predictions)

def predict_supply_values(yearly_supplies, monthly_supplies, n_yearly_supplies=4, n_monthly_supplies=6, batched=False):
    yearly_supplies = np.array(transform_supply_year_values(yearly_supplies))
    monthly_supplies = np.array(transform_supply_month_values(monthly_supplies))
    if not batched:
        yearly_supplies = yearly_supplies.reshape(1, n_yearly_supplies)
        monthly_supplies = monthly_supplies.reshape(1, n_monthly_supplies)
    predictions =  demand_model.predict([yearly_supplies, monthly_supplies])
    return inverse_transform_supply_month_values(predictions)

if __name__=="__main__":
    load_demand_model()
    load_supply_model()
    load_demand_scaler_params()
    load_supply_scaler_params()

    print(predict_demand_values([1000, 2000, 3000, 2000], [100, 200, 150, 250, 188, 120]))
    print(predict_supply_values([2000, 1000, 2000, 3000], [150, 120, 130, 150, 188, 120]))
