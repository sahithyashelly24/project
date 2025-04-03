from fastapi import FastAPI, UploadFile, File , HTTPException ,Depends
import os
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from processing_audio import processi_the_audio
from timestamps import predict_emotions
from training_model import TherapySessionTrainer
from predictions import TherapySessionPredictor

app = FastAPI()

# Add CORSMiddleware to allow cross-origin requests
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, or specify specific origins like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


UPLOAD_FOLDER = os.path.abspath("uploads")  # Absolute path
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure folder exists


DATA_FOLDER = os.path.abspath("data")  # Absolute path
os.makedirs(DATA_FOLDER, exist_ok=True)


model_path = os.path.join("best_model", "best_model_selected.pkl")
if os.path.exists(model_path):
    predictor = TherapySessionPredictor()
else:
    predictor = None  # Model needs to be trained first


class PredictionRequest(BaseModel):
    emotions: list[str]
    disease: str

@app.post("/upload_audio")
async def upload_audio(file: UploadFile = File(...)):

    safe_filename = file.filename.replace(" ", "_")
    file_path= os.path.join(UPLOAD_FOLDER, safe_filename).replace("\\", "/")  

    with open(file_path, "wb") as f:
        f.write(await file.read())

    if not os.path.exists(file_path):
        return {"error": "File was not saved correctly!"}

    return {"file_path":file_path}

class FilePathRequest(BaseModel):
    file_path: str


@app.post("/transcribe_audio")
async def transcribe_audio(request: FilePathRequest):
    transcription = processi_the_audio(request.file_path)
    return transcription

@app.post("/analyze_emotions")
async def analyse_emotins(request: FilePathRequest):
    emotions = predict_emotions(request.file_path)
    return emotions

@app.post("/train_model")
def train_model(file: UploadFile = File(...)):
    global predictor
    global predictor
    try:
        # Save dataset to data folder
        dataset_path = os.path.join(DATA_FOLDER, file.filename)
        with open(dataset_path, "wb") as buffer:
            buffer.write(file.file.read())

        # Train and save model
        trainer = TherapySessionTrainer()
        trainer.train_and_save_model(dataset_path)
        
        predictor = TherapySessionPredictor()  # Reload trained model
        return {"message": "Model trained and saved successfully!", "dataset_path": dataset_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/predict_emotions")
def predict_sessions(request: PredictionRequest):
    global predictor
    if predictor is None:
        raise HTTPException(status_code=400, detail="Model not trained yet. Train the model first!")
    try:
        prediction = predictor.predict_sessions(request.emotions, request.disease)
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


