from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import motor.motor_asyncio
from bson import ObjectId

app = FastAPI()

# CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB client setup
MONGO_DETAILS = "mongodb://localhost:27017"
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.form_data_db
collection = database.get_collection("form_data")

# Pydantic models
class FormDataBase(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    phone_number: Optional[str]
    location: Optional[str]

class FormDataCreate(FormDataBase):
    pass

class FormData(FormDataBase):
    id: Optional[str]

    class Config:
        orm_mode = True

# Helper function to serialize MongoDB document
def form_data_helper(form_data) -> dict:
    return {
        "id": str(form_data["_id"]),
        "first_name": form_data["first_name"],
        "last_name": form_data["last_name"],
        "email": form_data["email"],
        "phone_number": form_data["phone_number"],
        "location": form_data["location"],
    }

@app.post("/submit_form", response_model=FormData)
async def submit_form(data: FormDataCreate):
    form_data = data.dict()
    result = await collection.insert_one(form_data)
    new_form_data = await collection.find_one({"_id": result.inserted_id})
    return form_data_helper(new_form_data)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
