# 🧠 Cognitive Vox

> An intelligent audio analysis system to detect emotions and predict therapy needs — built with deep learning and care.

---

## 📌 About the Project

**Cognitive Vox** is a voice-based emotional analysis and therapy prediction system. Users can upload or record their voice, and the app will:

1. **Transcribe** the audio using Whisper.
2. **Analyze emotions** using a Vision Transformer (ViT) trained on spectrograms.
3. **Predict** the number of therapy sessions required based on the emotions, user’s age, and gender.
4. **Track** emotional changes over time using visualizations.

This project is designed to assist in mental health awareness and provide helpful insights from just a voice sample.

---

## 🧭 Architecture Overview

![System Architecture](./assets/cognitive_vox_architecture.png)

> The above diagram shows the complete pipeline — from audio input to transcription, emotion classification, and therapy prediction — built with FastAPI and machine learning models.

---

## ✨ Features

- 🎤 **Audio Input**: Upload or record voice.
- 🧠 **Emotion Detection**: Classifies emotions like Happy, Sadness, Anger, Anxiety, etc.
- 📃 **Speech Transcription**: Converts speech to text using Whisper.
- 🔮 **Therapy Prediction**: Estimates how many sessions a user may need.
- 📊 **Emotion History Tracking**: Visual display of progress over time.
- 👩‍⚕️ **Personalized Analysis**: Takes user’s gender and age into account for predictions.

---

## 🛠 Tech Stack

| Layer        | Tools/Libraries Used                                     |
|--------------|-----------------------------------------------------------|
| Frontend     | React.js (with charts and user profile UI)               |
| Backend      | FastAPI                                                  |
| ML Models    | ViT (`timm`), Random Forest, XGBoost, Gradient Boost     |
| Audio Tools  | Whisper, Torchaudio, PyDub, librosa                      |
| Dataset      | RAVDESS (processed into spectrograms)                   |

---

## 🧪 Machine Learning Models

### 🎨 Emotion Recognition (ViT)

- **Input**: Audio converted to spectrograms
- **Model**: Vision Transformer (ViT)
- **Trained On**: RAVDESS dataset (10 custom emotions)
- **Emotions Detected**:
  - Happy
  - Sadness
  - Anger
  - Anxiety
  - Calmness
  - Frustration
  - Hope
  - Confusion
  - Comfort
  - Peace

### 🔮 Therapy Session Predictor

- **Model Type**: Ensemble (Random Forest, XGBoost, Gradient Boost)
- **Inputs**: Emotion scores, user’s age, gender
- **Output**: Number of therapy sessions recommended

---
