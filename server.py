from fastapi import FastAPI, HTTPException, Depends, status, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Dict, Any, List, Optional
import motor.motor_asyncio
from bson import ObjectId
import boto3
from botocore.exceptions import ClientError

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
user_collection = database.get_collection("users")  # New collection for users

# AWS Cognito setup
cognito_client = boto3.client('cognito-idp', region_name='us-west-2')  
USER_POOL_ID = 'us-west-2_pONiEZd7U'
CLIENT_ID = '44raugsnb73eg3houq85lr12ah'

# Models
class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str = Field(
        pattern=r'^\+?[1-9]\d{1,14}$'
    )
    company: str

class UserCreate(UserBase):
    password: str  # Include password in the request model

class User(UserBase):
    id: str

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class CognitoTokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    id_token: str
    
class VerifyUserRequest(BaseModel):
    email: EmailStr
    verification_code: str

class FormField(BaseModel):
    name: str
    type: str

class DynamicForm(BaseModel):
    title: str
    description: str
    fields: Dict[str,  Dict[str, str]]
    date_range: Dict[str, str]
    company_id: str

# Helper functions
def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "email": user["email"],
        "phone_number": user["phone_number"],
        "company": user["company"],
        "company_id": user.get("company_id"),
        "email_verified": user.get("email_verified", False),
    }
    
def form_helper(form) -> dict:
    return {
        "id": str(form["_id"]),
        "title": form["title"],
        "description": form["description"],
        "fields": form["fields"],
        "date_range": form["date_range"],
        "company_id": form["company_id"]
    }

async def update_email_verification_status(email: str):
    try:
        # Fetch user attributes from Cognito
        response = cognito_client.admin_get_user(
            UserPoolId=USER_POOL_ID,
            Username=email
        )

        email_verified = False
        for attr in response['UserAttributes']:
            if attr['Name'] == 'email_verified' and attr['Value'] == 'true':
                email_verified = True
                break

        # Update the MongoDB document with the email_verified status
        result = await user_collection.update_one(
            {"email": email},
            {"$set": {"email_verified": email_verified}}
        )

        return result.modified_count > 0

    except ClientError as e:
        print(f"An error occurred: {e}")
        return False

# API Endpoint for Adding User to MongoDB and AWS Cognito
@app.post("/register_user", response_model=User)
async def register_user(data: UserCreate):
    print("Endpoint hit")
    print("Received data: ", data)
    user_data = data.dict()
    
    # Generate a unique Company ID (for example purposes, you may want to create a more complex generation logic)
    company_id = f"COMP-{ObjectId()}"

    # Add user to AWS Cognito
    try:
        response = cognito_client.sign_up(
            ClientId=CLIENT_ID,
            Username=user_data['email'],
            Password=user_data['password'],  # Use the password provided by the user
            UserAttributes=[
                {
                    'Name': 'email',
                    'Value': user_data['email']
                },
                {
                    'Name': 'phone_number',
                    'Value': user_data['phone_number']
                },
                {
                    'Name': 'custom:CompanyID',
                    'Value': company_id
                }
            ]
        )
    except ClientError as e:
        raise HTTPException(status_code=400, detail=e.response['Error']['Message'])

    # Save user data to MongoDB, including the Company ID
    user_data['company_id'] = company_id
    result = await user_collection.insert_one(user_data)
    new_user = await user_collection.find_one({"_id": result.inserted_id})
    return user_helper(new_user)

@app.post("/verify_user")
async def verify_user(request: VerifyUserRequest):
    try:
        response = cognito_client.confirm_sign_up(
            ClientId=CLIENT_ID,
            Username=request.email,
            ConfirmationCode=request.verification_code,
        )

        # Update email_verified status in MongoDB
        email_verified_updated = await update_email_verification_status(request.email)

        if email_verified_updated:
            return {"status": "Success", "message": "User verified successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to update email verification status")

    except ClientError as e:
        raise HTTPException(status_code=400, detail=e.response['Error']['Message'])

# API Endpoint for User Login using AWS Cognito
@app.post("/login_user", response_model=CognitoTokenResponse)
async def login_user(data: UserLogin, company_id: str):
    try:
        # Retrieve the company ID for the user from MongoDB
        user = await user_collection.find_one({"email": data.email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if user['company_id'] != company_id:
            raise HTTPException(status_code=400, detail="Invalid Company ID")

        # Authenticate user with AWS Cognito (Cognito will handle email verification)
        response = cognito_client.initiate_auth(
            ClientId=CLIENT_ID,
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': data.email,
                'PASSWORD': data.password,
            }
        )
        return CognitoTokenResponse(
            access_token=response['AuthenticationResult']['AccessToken'],
            refresh_token=response['AuthenticationResult']['RefreshToken'],
            id_token=response['AuthenticationResult']['IdToken']
        )
    except ClientError as e:
        raise HTTPException(status_code=400, detail=e.response['Error']['Message'])

# API Endpoint for creating a dynamic form
@app.post("/dynamic_form")
async def create_dynamic_form(form: DynamicForm):
    form_data = form.dict()
    result = await form_collection.insert_one(form_data)
    if result.inserted_id:
        return {"status": "Success", "message": "Form created successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to create form")


@app.get("/dynamic_forms_by_date")
async def get_dynamic_forms_by_date(start_date: str = Query(...), end_date: str = Query(...)):
    forms = []
    start_date_obj = datetime.strptime(start_date, "%Y-%m-%d")
    end_date_obj = datetime.strptime(end_date, "%Y-%m-%d")

    async for form in form_collection.find():
        form_start = datetime.strptime(form["date_range"]["startDate"], "%Y-%m-%d")
        form_end = datetime.strptime(form["date_range"]["endDate"], "%Y-%m-%d")

        if start_date_obj <= form_start <= end_date_obj or start_date_obj <= form_end <= end_date_obj:
            forms.append(form_helper(form))

    if not forms:
        raise HTTPException(status_code=404, detail="No forms found in the specified date range")

    return forms

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
