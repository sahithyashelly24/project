import torch
import torch.nn as nn
import torchaudio.transforms as transforms
import timm
from torchvision import transforms as T
from PIL import Image
import numpy as np
import librosa
import scipy.ndimage
import json

# Define the ViT-based Emotion Recognition Model
class ViTEmotionModel(nn.Module):
    def __init__(self, num_classes=10):
        super(ViTEmotionModel, self).__init__()
        self.model = timm.create_model("vit_base_patch16_224", pretrained=True, num_classes=num_classes)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        x = self.model(x)
        return self.softmax(x)

# Preprocessing Pipeline for Images
transform = T.Compose([
    T.Resize((224, 224)),
    T.ToTensor(),
    T.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

# Load and preprocess the audio
def process_audio(audio_path):
    y, sr = librosa.load(audio_path, sr=None)
    total_duration = librosa.get_duration(y=y, sr=sr)
    return y, sr, total_duration

# Extract relevant segments from audio
def extract_audio_segments(y, sr, total_duration):
    num_frames = max(3, min(8, int(total_duration // 2)))
    frame_duration = total_duration / num_frames
    segments = []
    for i in range(num_frames):
        start_sample = int(i * frame_duration * sr)
        end_sample = int((i + 1) * frame_duration * sr)
        segments.append(y[start_sample:end_sample])
    return segments

# Convert audio segment to Mel spectrogram image
def audio_to_spectrogram(audio_segment, sr):
    spectrogram = librosa.feature.melspectrogram(y=audio_segment, sr=sr)
    spectrogram = np.log1p(spectrogram)
    spectrogram = (spectrogram - spectrogram.min()) / (spectrogram.max() - spectrogram.min())
    spectrogram = scipy.ndimage.gaussian_filter(spectrogram, sigma=1)
    img = Image.fromarray((spectrogram * 255).astype(np.uint8)).convert('RGB').resize((224, 224))
    return img

# Predict emotions from an image
def predict_emotions_from_image(model, img, classes):
    img = transform(img).unsqueeze(0)
    model.eval()
    with torch.no_grad():
        output = model(img)
    percentages = output.squeeze().tolist()
    return {emotion: percent * 100 for emotion, percent in zip(classes, percentages) if percent * 100 >= 5.0}

# Main function to predict emotions from an audio file

    
    return json.dumps(overall_emotions, indent=4)

def predict_emotions(audio_path):
    model = ViTEmotionModel(num_classes=10)
    classes = [
        "Anger", "Anxiety", "Balance", "Sadness", "Relief", "Calmness", "Assurance", "Worry",
        "Tension", "Mood Swings", "Clarity", "Delusions", "Paranoia", "Stability", "Hope",
        "Hopelessness", "Fatigue", "Confusion", "Resilience", "Peace", "Intrusive Thoughts",
        "Obsession", "Comfort", "Mania", "Irritability", "Frustration", "Focus", "Impulsivity"
    ]

    y, sr, total_duration = process_audio(audio_path)
    segments = extract_audio_segments(y, sr, total_duration)
    overall_emotions = {}

    for segment in segments:
        img = audio_to_spectrogram(segment, sr)
        emotions = predict_emotions_from_image(model, img, classes)
        for emotion, percent in emotions.items():
            overall_emotions[emotion] = overall_emotions.get(emotion, 0) + percent

    # Normalize and ensure numeric output
    total_percent = sum(overall_emotions.values()) or 1  # Prevent division by zero
    formatted_emotions = [
        {"name": emotion, "value": round((overall_emotions[emotion] / total_percent) * 100, 2)}
        for emotion in overall_emotions
    ]

    return formatted_emotions

