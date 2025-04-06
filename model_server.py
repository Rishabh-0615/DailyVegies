from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os
import numpy as np
import pandas as pd
import joblib
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = 'static/uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Load models
model = load_model('crop_disease_model.h5')
price_model, price_model_features = joblib.load("./backend/models/vegetable_price_predictor_1.pkl")
demand_model, demand_model_features = joblib.load("./backend/models/vegetable_demand_predictor.pkl")
class_names = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust',
    'Apple___Healthy', 'Corn___Cercospora_leaf_spot', 'Corn___Common_rust',
    'Corn___Healthy', 'Corn___Northern_Leaf_Blight',
    'Potato___Early_blight', 'Potato___Healthy', 'Potato___Late_blight',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
    'Tomato___Healthy'
]


def prepare_input(data, model_features):
    input_data = {
        'temperature': float(data.get('Temperature', data.get('temperature', 0))),
        'rainfall': float(data.get('Rainfall', data.get('rainfall', 0))),
        'seasonal factor': float(data.get('Seasonal Factor', data.get('seasonal factor', 0))),
        'fuel price': float(data.get('Fuel Price', data.get('fuel price', 0))),
        'vegetable': data.get('Vegetable', data.get('vegetable', 'Tomato')).title(),
        'city': data.get('City', data.get('city', 'Mumbai')).title(),
        'day of week': data.get('Day of Week', data.get('day of week', 'Monday')).title()
    }

    if 'market demand' in model_features:
        input_data['market demand'] = float(data.get('Market Demand', data.get('market demand', 0)))

    df = pd.DataFrame([input_data])
    categorical_columns = ["vegetable", "city", "day of week"]
    df_encoded = pd.get_dummies(df, columns=categorical_columns)

    for feature in model_features:
        if feature not in df_encoded.columns:
            df_encoded[feature] = 0

    return df_encoded[model_features]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict-disease', methods=['POST'])
def predict_disease():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    try:
        img = image.load_img(filepath, target_size=(128, 128))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        predictions = model.predict(img_array)


        # Debug print
        print("Predictions:", predictions)
        print("Prediction shape:", predictions.shape)
        if predictions.shape[1] != len(class_names):
             raise ValueError(f"Model output shape mismatch. Expected {len(class_names)} classes, got {predictions.shape[1]}")


        predicted_class = class_names[np.argmax(predictions)]

        os.remove(filepath)

        return jsonify({'prediction': predicted_class, 'status': 'success'})

    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 500

@app.route("/predict-price", methods=["POST"])
def predict_price():
    try:
        data = request.json
        final_df = prepare_input(data, price_model_features)

        mean_prediction = price_model.predict(final_df)[0]
        tree_predictions = np.array([estimator.predict(final_df)[0] for estimator in price_model.estimators_])
        lower_bound = np.min(tree_predictions)
        upper_bound = np.max(tree_predictions)

        return jsonify({
            "predicted_price": round(mean_prediction, 2),
            "predicted_range": {
                "min": round(lower_bound, 2),
                "max": round(upper_bound, 2)
            },
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route("/predict-demand", methods=["POST"])
def predict_demand():
    try:
        data = request.json
        final_df = prepare_input(data, demand_model_features)
        prediction = demand_model.predict(final_df)[0]
        return jsonify({"predicted_demand": round(prediction, 2), "status": "success"})
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
