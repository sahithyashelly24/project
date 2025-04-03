import joblib
import numpy as np
import os

class TherapySessionPredictor:
    def __init__(self):
        self.model_path = os.path.join("best_model", "best_model_selected.pkl")
        self.model = self.load_model()

    def load_model(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError("No trained model found! Please run training_model.py first.")
        return joblib.load(self.model_path)

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

    def predict_sessions(self, emotions, disease):
        disease_encoding = self.encode_disease(disease)
        emotion_encoding = self.encode_emotions(emotions)

        features = np.array([emotion_encoding + disease_encoding])
        prediction = self.model.predict(features)[0]  # Get single prediction

        return round(prediction)  # Return only the number


