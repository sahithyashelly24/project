import joblib
import json
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from xgboost import XGBRegressor
import os

class TherapySessionTrainer:
    def __init__(self):
        self.models = {
            'RandomForest': RandomForestRegressor(n_estimators=100, random_state=42),
            'GradientBoosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
            'XGBoost': XGBRegressor(n_estimators=100, random_state=42)
        }
        self.best_model = None
        self.model_path = os.path.join("best_model", "best_model_selected.pkl")

    def load_data(self, json_file):
        with open(json_file, 'r') as file:
            return json.load(file)

    def preprocess_data(self, data):
        X, y = [], []
        for entry in data:
            emotions = entry['emotions']
            disease = entry['disease']
            sessions = entry['sessions_required']

            disease_encoding = self.encode_disease(disease)
            emotion_encoding = self.encode_emotions(emotions)

            features = emotion_encoding + disease_encoding
            X.append(features)
            y.append(sessions)

        return np.array(X), np.array(y)

    def encode_disease(self, disease):
        diseases = ['Depression', 'Anxiety Disorder', 'PTSD', 'Bipolar Disorder', 'OCD', 
                    'Schizophrenia', 'Borderline Personality', 'ADHD']
        return [1 if disease == d else 0 for d in diseases]

    def encode_emotions(self, emotions):
        all_emotions = ['sadness', 'hopelessness', 'fatigue', 'fear', 'worry', 'tension', 
                        'restlessness', 'anger', 'intrusive thoughts', 'mania', 'irritability', 
                        'frustration', 'confusion', 'paranoia', 'delusions', 'mood swings', 
                        'impulsivity', 'happiness', 'relief', 'hope', 'calmness', 'relaxation', 
                        'assurance', 'safety', 'resilience', 'peace', 'stability', 'balance', 
                        'acceptance', 'comfort', 'focus', 'patience']
        return [1 if e in emotions else 0 for e in all_emotions]

    def train_and_save_model(self, dataset_path):
        data = self.load_data(dataset_path)
        X, y = self.preprocess_data(data)

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        best_rmse = float('inf')

        for model_name, model in self.models.items():
            model.fit(X_train, y_train)
            predictions = model.predict(X_test)
            rmse = np.sqrt(mean_squared_error(y_test, predictions))
            print(f"{model_name} RMSE: {rmse}")

            if rmse < best_rmse:
                best_rmse = rmse
                self.best_model = model

        # Save the best model
        os.makedirs("best_model", exist_ok=True)
        joblib.dump(self.best_model, self.model_path)


