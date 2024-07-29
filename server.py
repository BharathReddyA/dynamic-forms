from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Dict, Any
import motor.motor_asyncio
from bson import ObjectId

app = FastAPI()

# CORS middleware
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
form_collection = database.get_collection("forms")
filled_form_collection = database.get_collection("filled_forms")

# Models
class DynamicFormBase(BaseModel):
    title: str
    description: str
    fields: Dict[str, Any]
    date_range: Dict[str, str]
    company_id: str

class DynamicFormCreate(DynamicFormBase):
    pass

class DynamicForm(DynamicFormBase):
    id: str

    class Config:
        orm_mode = True

class UserFilledFormBase(BaseModel):
    form_id: str
    company_id: str
    user_data: Dict[str, Any]
    location: str

class UserFilledFormCreate(UserFilledFormBase):
    pass

class UserFilledForm(UserFilledFormBase):
    id: str

    class Config:
        orm_mode = True

# Helper functions
def dynamic_form_helper(form) -> dict:
    return {
        "id": str(form["_id"]),
        "title": form["title"],
        "description": form["description"],
        "fields": form["fields"],
        "date_range": form["date_range"],
        "company_id": form["company_id"],
    }

def user_filled_form_helper(filled_form) -> dict:
    return {
        "id": str(filled_form["_id"]),
        "form_id": filled_form["form_id"],
        "company_id": filled_form["company_id"],
        "user_data": filled_form["user_data"],
        "location": filled_form["location"],
    }

# Endpoints
@app.post("/dynamic_form", response_model=DynamicForm)
async def create_dynamic_form(data: DynamicFormCreate):
    form_data = data.dict()
    result = await form_collection.insert_one(form_data)
    new_form = await form_collection.find_one({"_id": result.inserted_id})
    return dynamic_form_helper(new_form)

@app.get("/dynamic_form/{form_id}", response_model=DynamicForm)
async def get_dynamic_form(form_id: str):
    form = await form_collection.find_one({"_id": ObjectId(form_id)})
    if form is None:
        raise HTTPException(status_code=404, detail="Form not found")
    return dynamic_form_helper(form)

@app.post("/submit_filled_form", response_model=UserFilledForm)
async def submit_filled_form(data: UserFilledFormCreate):
    filled_form_data = data.dict()
    result = await filled_form_collection.insert_one(filled_form_data)
    new_filled_form = await filled_form_collection.find_one({"_id": result.inserted_id})
    return user_filled_form_helper(new_filled_form)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
