from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
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
form_collection = database.get_collection("form_data")
date_range_collection = database.get_collection("date_range")
company_reg_collection = database.get_collection("company_registration_collection")

# Pydantic models
class FormDataBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr  
    phone_number: str = Field(
        pattern=r'^\+?[1-9]\d{9}$'
    )  
    location: str
    role: str

    class Config:
        from_attributes = True

class FormDataCreate(FormDataBase):
    pass

class FormData(FormDataBase):
    id: str

    class Config:
        from_attributes = True
        
# DateRange Model
class DateRangeBase(BaseModel):
    startDate: str
    endDate: str
    
    class Config: 
        from_attributes = True
        
class DateRangeCreate(DateRangeBase):
    pass
        
class DateRange(DateRangeBase):
    id: str
    
    class Config:
        from_attributes = True
        
# Company Registration Model
class CompanyRegistrationBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr  
    phone_number: str = Field(
        pattern=r'^\+?[1-9]\d{9}$'
    )  
    company: str
    class Config:
        from_attributes = True

class CompanyRegistrationCreate(CompanyRegistrationBase):
    pass

class CompanyRegistration(CompanyRegistrationBase):
    id: str

    class Config:
        from_attributes = True

# Helper functions to serialize MongoDB documents
def form_data_helper(form_data) -> dict:
    return {
        "id": str(form_data["_id"]),
        "first_name": form_data["first_name"],
        "last_name": form_data["last_name"],
        "email": form_data["email"],
        "phone_number": form_data["phone_number"],
        "location": form_data["location"],
        "role": form_data["role"],
    }

def date_range_helper(date_range) -> dict:
    return {
        "id": str(date_range["_id"]),
        "startDate": date_range["startDate"],
        "endDate": date_range["endDate"],
    }

def company_registration_helper(company_registration) -> dict:
    return {
        "id": str(company_registration["_id"]),
        "first_name": company_registration["first_name"],
        "last_name": company_registration["last_name"],
        "email": company_registration["email"],
        "phone_number": company_registration["phone_number"],
        "company": company_registration["company"],
    }

@app.post("/submit_form", response_model=FormData)
async def submit_form(data: FormDataCreate):
    form_data = data.dict()
    result = await form_collection.insert_one(form_data)
    new_form_data = await form_collection.find_one({"_id": result.inserted_id})
    return form_data_helper(new_form_data)

@app.post("/company_registration", response_model=CompanyRegistration)
async def company_registration(data: CompanyRegistrationCreate):
    company_registration = data.dict()
    result = await company_reg_collection.insert_one(company_registration)
    new_company_registration = await company_reg_collection.find_one({"_id": result.inserted_id})
    return company_registration_helper(new_company_registration)

@app.post('/date_range', response_model=DateRange)
async def submit_date_range(data: DateRangeCreate):
    date_range = data.dict()
    result = await date_range_collection.insert_one(date_range)
    new_date_range = await date_range_collection.find_one({"_id": result.inserted_id})
    return date_range_helper(new_date_range)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
