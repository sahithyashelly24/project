from fastapi import FastAPI, UploadFile, File
import os
from processing_audio import processi_the_audio

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

@app.post("/upload_audio")
async def upload_audio(file: UploadFile = File(...)):
    # Sanitize filename
    safe_filename = file.filename.replace(" ", "_")

    # Correct file path format
    file_path_x = os.path.join(UPLOAD_FOLDER, safe_filename).replace("\\", "/")  

    print(f"Saving file to: {file_path_x}")  # Debugging

    with open(file_path_x, "wb") as f:
        f.write(await file.read())

        # Verify file exists
    if not os.path.exists(file_path_x):
        return {"error": "File was not saved correctly!"}

    print(f"File saved successfully at {file_path_x}")

        # Process the saved file
    result = processi_the_audio(file_path_x)
    return {"transcription": result}



