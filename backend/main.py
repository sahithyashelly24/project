from fastapi import FastAPI, UploadFile, File
import os
from processing_audio import processi__the_audio

app = FastAPI()

UPLOAD_FOLDER = os.path.abspath("uploads")  # Use absolute path
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure folder exists

@app.post("/upload_audio")
async def upload_audio(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)  # Full path

    # Debugging: Print where the file is being saved
    print(f"Saving file to: {file_path}")

    try:
        # Save the uploaded file
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Check if the file actually exists
        if not os.path.exists(file_path):
            return {"error": "File was not saved correctly!"}

        # Process the saved file
        result = processi__the_audio(file_path)

        return {"transcription": result}

    except Exception as e:
        return {"error": str(e)}
