from flask import Flask, request, jsonify, after_this_request
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from imblearn.over_sampling import SMOTE
from collections import Counter
import warnings
import pickle

warnings.filterwarnings("ignore")

# Load and preprocess the data
df = pd.read_csv(r"D:\Final MCA Project\Book1_8df783-synthetic-CSV - Synthetic Data by MOSTLY AI\Book1\Book1.csv")
df = df.drop('Record ID', axis=1)
df = df.replace({'Yes': 1, 'No': 0})

le = LabelEncoder()
df['Disorder'] = le.fit_transform(df['Disorder'])

X = df.drop('Disorder', axis = 1)
y = df['Disorder']

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y , test_size=0.2, random_state=42, shuffle=True, stratify=y)

# Apply SMOTE to oversample the minority classes
smote = SMOTE(sampling_strategy='auto', random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

# Print the class distribution before and after resampling
print("Original Class Distribution:", Counter(y_train))
print("Resampled Class Distribution:", Counter(y_train_resampled))

# Train a RandomForest model
rfc = RandomForestClassifier()
rfc.fit(X_train_resampled, y_train_resampled)

# Save the trained RandomForest model to a file
pickle.dump(rfc, open('rfc_model.pkl', 'wb'))

# Load the trained RandomForest model from the file
rfc_model_loaded = pickle.load(open('rfc_model.pkl', 'rb'))

symptoms = X.columns.values

symptom_index = {}
for index, value in enumerate(symptoms):
    symptom = " ".join([i.capitalize() for i in value.split("_")])
    symptom_index[symptom] = index

data_dict = {
    "symptom_index": symptom_index,
    "predictions_classes": le.classes_
}

def predictDisease(symptoms):
    input_data = [0] * len(data_dict["symptom_index"])
    for symptom in symptoms:
        symptom = symptom.split(",")  # split each symptom string into a list
        for s in symptom:
            index = data_dict["symptom_index"][s]
            input_data[index] = 1

    input_data = np.array(input_data).reshape(1, -1)

    # RandomForest model prediction
    rfc_prediction = data_dict["predictions_classes"][rfc_model_loaded.predict(input_data)[0]]
    rfc_prediction_prob = rfc_model_loaded.predict_proba(input_data)[0]
    return rfc_prediction, rfc_prediction_prob

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    symptoms = data['symptoms']

    # Use the RandomForest model for prediction
    prediction_rfc, prediction_prob_rfc = predictDisease(symptoms)
    return jsonify({'disorder_rfc': prediction_rfc})

if __name__ == '__main__':
    print("Flask is running...")
    app.run(port=3300, debug=True)
