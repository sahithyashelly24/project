import torch
import torchaudio
import torchaudio.transforms as transforms
import librosa.display
import matplotlib.pyplot as plt
import whisper
import io
import base64

def audio_to_spectrogram(audio_path):
    waveform, sample_rate = torchaudio.load(audio_path)
    mel_spectrogram = transforms.MelSpectrogram(sample_rate=sample_rate, n_mels=128)(waveform)
    mel_spectrogram = torch.log(mel_spectrogram + 1e-9)
    return mel_spectrogram, sample_rate

def display_spectrogram(spectrogram, sample_rate):
    fig, ax = plt.subplots(figsize=(10, 4))
    librosa.display.specshow(spectrogram.squeeze().numpy(), sr=sample_rate, x_axis="time", y_axis="mel", cmap="magma")
    plt.colorbar(format="%+2.0f dB")
    plt.title("Mel Spectrogram")
    plt.xlabel("Time")
    plt.ylabel("Frequency")

    # Convert plot to Base64
    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight")
    buf.seek(0)
    img_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    plt.close(fig)

    return img_base64  # Return the image as a Base64 string

def transcribe_audio(audio_path):
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)
    return result["text"]

def processi__the_audio(audio_path):
    spectrogram, sr = audio_to_spectrogram(audio_path)
    img_base64 = display_spectrogram(spectrogram, sr)  # Get Base64 image
    transcript = transcribe_audio(audio_path)
    
    return {"spectrogram": img_base64, "transcript": transcript}
