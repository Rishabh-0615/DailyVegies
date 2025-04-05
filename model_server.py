# from flask import Flask, request, jsonify
# import joblib
# import pandas as pd
# import numpy as np
# from flask_cors import CORS

# model, model_features = joblib.load("./backend/models/vegetable_price_predictor_1.pkl")

# app = Flask(__name__)
# CORS(app)

# @app.route("/predict", methods=["POST"])
# def predict():
#     try:
#         data = request.json
#         print("Received data:", data)
#         input_data = {
#             'temperature': float(data.get('Temperature', data.get('temperature', 0))),
#             'rainfall': float(data.get('Rainfall', data.get('rainfall', 0))),
#             'market demand': float(data.get('Market Demand', data.get('market demand', 0))),
#             'seasonal factor': float(data.get('Seasonal Factor', data.get('seasonal factor', 0))),
#             'fuel price': float(data.get('Fuel Price', data.get('fuel price', 0))),
#             'vegetable': data.get('Vegetable', data.get('vegetable', 'Tomato')).title(),
#             'city': data.get('City', data.get('city', 'Mumbai')).title(),
#             'day of week': data.get('Day of Week', data.get('day of week', 'Monday')).title()
#         }
#         print("Normalized data:", input_data)
#         df = pd.DataFrame([input_data])
#         print("Initial DataFrame columns:", df.columns.tolist())
#         categorical_columns = ["vegetable", "city", "day of week"]
#         df_encoded = pd.get_dummies(df, columns=categorical_columns)
#         print("Encoded DataFrame columns:", df_encoded.columns.tolist())
#         for feature in model_features:
#             if feature not in df_encoded.columns:
#                 df_encoded[feature] = 0
#         final_df = df_encoded[model_features]
#         print("Final DataFrame columns for prediction:", final_df.columns.tolist())
#         mean_prediction = model.predict(final_df)[0]
#         tree_predictions = np.array([estimator.predict(final_df)[0] for estimator in model.estimators_])
#         lower_bound = np.min(tree_predictions)
#         upper_bound = np.max(tree_predictions)
#         return jsonify({
#             "predicted_price": round(mean_prediction, 2),
#             "predicted_range": {
#                 "min": round(lower_bound, 2),
#                 "max": round(upper_bound, 2)
#             },
#             "status": "success",
#             "debug_info": {
#                 "input_data": input_data,
#                 "final_feature_columns": list(final_df.columns),
#                 "numeric_values": {
#                     "temperature": final_df["temperature"].iloc[0],
#                     "rainfall": final_df["rainfall"].iloc[0],
#                     "market demand": final_df["market demand"].iloc[0],
#                     "seasonal factor": final_df["seasonal factor"].iloc[0],
#                     "fuel price": final_df["fuel price"].iloc[0]
#                 }
#             }
#         })
#     except Exception as e:
#         print(f"Error occurred: {str(e)}")
#         return jsonify({
#             "error": f"Prediction error: {str(e)}",
#             "status": "error",
#             "debug_info": {
#                 "error_type": type(e).__name__,
#                 "error_details": str(e),
#                 "input_data": data if 'data' in locals() else None
#             }
#         }), 500

# if __name__ == "__main__":
#     app.run(debug=True, port=5001)



# Mean Squared Error: 2.2334170304099996
# R2 Score: 0.9932725453473716


# import pandas as pd
# import numpy as np
# from sklearn.ensemble import RandomForestRegressor
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import mean_squared_error, r2_score
# import joblib
# from google.colab import files

# uploaded = files.upload()
# df = pd.read_csv(next(iter(uploaded.keys())))
# df.columns = df.columns.str.strip().str.lower()
# df.drop("date", axis=1, inplace=True)
# categorical_columns = ["vegetable", "city", "day of week"]
# df = pd.get_dummies(df, columns=categorical_columns, drop_first=True)
# df.fillna(df.mean(), inplace=True)
# X = df.drop("price", axis=1)
# y = df["price"]
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
# model = RandomForestRegressor(n_estimators=100, random_state=42)
# model.fit(X_train, y_train)
# y_pred = model.predict(X_test)
# print(f"Mean Squared Error: {mean_squared_error(y_test, y_pred)}")
# print(f"R2 Score: {r2_score(y_test, y_pred)}")
# model_filename = "vegetable_price_predictor.pkl"
# joblib.dump((model, X_train.columns.tolist()), model_filename)
# print(f"Model and feature list saved as {model_filename}")
# files.download(model_filename)




# import pandas as pd
# import numpy as np
# from sklearn.ensemble import RandomForestRegressor
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import mean_squared_error, r2_score
# import joblib
# from google.colab import files


# uploaded = files.upload()
# df = pd.read_csv(next(iter(uploaded.keys())))

# df.columns = df.columns.str.strip().str.lower()
# df.drop("date", axis=1, inplace=True)
# df.drop("price", axis=1, inplace=True)  


# categorical_columns = ["vegetable", "city", "day of week"]
# df = pd.get_dummies(df, columns=categorical_columns, drop_first=True)


# df.fillna(df.mean(), inplace=True)


# X = df.drop("market demand", axis=1) 
# y = df["market demand"]  

# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# model = RandomForestRegressor(
#     n_estimators=200,         
#     max_depth=None,            
#     min_samples_split=5,      
#     min_samples_leaf=2,        
#     random_state=42
# )
# model.fit(X_train, y_train)


# y_pred = model.predict(X_test)
# mse = mean_squared_error(y_test, y_pred)
# r2 = r2_score(y_test, y_pred)

# print(f"Mean Squared Error: {mse}")
# print(f"R2 Score: {r2}")


# feature_importance = pd.DataFrame({
#     'feature': X_train.columns,
#     'importance': model.feature_importances_
# }).sort_values('importance', ascending=False)

# print("\nTop 10 Most Important Features:")
# print(feature_importance.head(10))

# model_filename = "vegetable_demand_predictor.pkl"
# joblib.dump((model, X_train.columns.tolist()), model_filename)
# print(f"\nModel and feature list saved as {model_filename}")
# files.download(model_filename)


# print("\nSample Predictions vs Actual Values:")
# sample_indices = np.random.choice(len(X_test), 5)
# sample_predictions = model.predict(X_test.iloc[sample_indices])
# sample_actuals = y_test.iloc[sample_indices]

# for i, (pred, actual) in enumerate(zip(sample_predictions, sample_actuals)):
#     print(f"Sample {i+1}:")
#     print(f"Predicted Demand: {pred:.2f}")
#     print(f"Actual Demand: {actual:.2f}")
#     print(f"Difference: {abs(pred - actual):.2f}")
#     print("---")


from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from flask_cors import CORS


price_model, price_model_features = joblib.load("./backend/models/vegetable_price_predictor_1.pkl")
demand_model, demand_model_features = joblib.load("./backend/models/vegetable_demand_predictor.pkl")

app = Flask(__name__)
CORS(app)

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

if __name__ == "__main__":
    app.run(debug=True, port=5001)

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import joblib
# import re
# import nltk
# from nltk.corpus import stopwords
# from nltk.stem.porter import PorterStemmer

# # Download stopwords
# nltk.download('stopwords')

# # Load model and vectorizer
# model = joblib.load('./backend/models/model.pkl')
# vectorizer = joblib.load('./backend/models/vectorizer.pkl')

# app = Flask(__name__)
# CORS(app)  # Enable CORS for frontend requests

# # Text preprocessing function
# port_stem = PorterStemmer()
# def preprocess_text(text):
#     text = re.sub('[^a-zA-Z]', ' ', text).lower().split()
#     text = [port_stem.stem(word) for word in text if word not in stopwords.words('english')]
#     return ' '.join(text)

# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.json['text']
#     processed_text = preprocess_text(data)
#     vectorized_text = vectorizer.transform([processed_text])
#     prediction = model.predict(vectorized_text)[0]
#     return jsonify({'prediction': int(prediction)})

# if __name__ == '__main__':
#     app.run(debug=True, port=5001)
