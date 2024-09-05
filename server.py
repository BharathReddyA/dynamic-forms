from fastapi import FastAPI, HTTPException, Depends, status, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Dict, Any, List, Optional
import motor.motor_asyncio
from bson import ObjectId
import boto3
from botocore.exceptions import ClientError
import logging

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
user_collection = database.get_collection("users")
app_collection = database.get_collection("applications")
app_user_collection = database.get_collection("app_users")

# AWS Cognito setup
cognito_client = boto3.client('cognito-idp', region_name='us-west-2')  
USER_POOL_ID = 'us-west-2_pONiEZd7U'
CLIENT_ID = '44raugsnb73eg3houq85lr12ah'

# Models
class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str = Field(pattern=r'^\+?[1-9]\d{1,14}$')
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
    fields: Dict[str, Dict[str, str]]
    date_range: Dict[str, str]
    company_id: str
    app_name: str
    app_id: str    
class Application(BaseModel):
    app_name: str
    app_url: str
    company_id: str
    
class ApplicationUsers(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone_number: str
    location: str
    app_name: str
    app_id: str
    company_id: str

class UpdateAppModel(BaseModel):
    app_name: Optional[str] = None
    app_url: Optional[str] = None

def app_helper(app) -> dict:
    return {
        "id": str(app["_id"]),
        "app_name": app["app_name"],
        "app_url": app["app_url"],
        "company_id": app["company_id"],
    }

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

def app_user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "email": user["email"],
        "phone_number": user["phone_number"],
        "location": user["location"],
        "company_id": user["company_id"],
        "app_name": user["app_name"],
        "app_id": str(user["app_id"]),
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
                {'Name': 'email', 'Value': user_data['email']},
                {'Name': 'phone_number', 'Value': user_data['phone_number']},
                {'Name': 'custom:CompanyID', 'Value': company_id}
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
    form_data["app_id"] = ObjectId(form_data["app_id"])
    result = await form_collection.insert_one(form_data)
    if result.inserted_id:
        return {"status": "Success", "message": "Form created successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to create form")

@app.get("/dynamic_forms_by_app")
async def get_dynamic_forms_by_app(company_id: str, app_id: str):
    try:
        logging.info(f"Fetching forms for Company ID: {company_id}, App ID: {app_id}")

        # Ensure app_id is treated as ObjectId
        query = {
            "company_id": company_id,
            "app_id": ObjectId(app_id)  # Convert app_id to ObjectId
        }

        forms = []
        async for form in form_collection.find(query):
            # Convert ObjectId fields to strings
            form["_id"] = str(form["_id"])
            form["app_id"] = str(form["app_id"])
            forms.append(form)

        logging.info(f"Forms found: {len(forms)}")
        return forms
    except Exception as e:
        logging.error(f"Error retrieving forms: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# API Endpoint to get user profile data
@app.get("/user_profile/{user_id}")
async def get_user_profile(user_id: str):
    # Assuming user_id is the company_id here
    try:
        user = await user_collection.find_one({"company_id": user_id})
        if user:
            return user_helper(user)
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# API Endpoint to update user profile data
@app.put("/user_profile/{company_id}", response_model=User)
async def update_user_profile(company_id: str, data: UserBase):
    # Exclude fields that shouldn't be updated
    update_data = {k: v for k, v in data.dict().items() if k not in ["email", "company_id"]}
    
    # Update the user using company_id
    result = await user_collection.update_one({"company_id": company_id}, {"$set": update_data})
    
    if result.modified_count == 1:
        updated_user = await user_collection.find_one({"company_id": company_id})
        return user_helper(updated_user)
    
    raise HTTPException(status_code=400, detail="Failed to update user profile")

# API Endpoint for adding a new application
@app.post("/add_app")
async def add_app(app: Application):
    app_data = app.dict()

    # Check for uniqueness of application name and URL
    existing_app_name = await app_collection.find_one({"app_name": app_data["app_name"], "company_id": app_data["company_id"]})
    existing_app_url = await app_collection.find_one({"app_url": app_data["app_url"], "company_id": app_data["company_id"]})

    if existing_app_name:
        raise HTTPException(status_code=400, detail="Application name already exists for this company.")
    
    if existing_app_url:
        raise HTTPException(status_code=400, detail="Application URL already exists for this company.")

    # If unique, insert the new application
    result = await app_collection.insert_one(app_data)
    if result.inserted_id:
        return {"status": "Success", "message": "Application added successfully", "app_id": str(result.inserted_id)}
    else:
        raise HTTPException(status_code=500, detail="Failed to add application")
    
@app.get("/view_apps/{company_id}")
async def get_apps_by_company(company_id: str):
    try:
        logging.info(f"Searching for apps with company_id: {company_id}")
        apps = []
        async for app in app_collection.find({"company_id": company_id}):
            logging.info(f"Found app: {app}")
            apps.append(app_helper(app))
        if apps:
            return apps
        else:
            logging.warning(f"No applications found for company_id: {company_id}")
            raise HTTPException(status_code=404, detail="No applications found for this company")
    except Exception as e:
        logging.error(f"Error retrieving applications: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/view_app_details/{app_id}")
async def get_app_details(app_id: str):
    try:
        logging.info(f"Searching for app with app_id: {app_id}")
        app = await app_collection.find_one({"_id": ObjectId(app_id)})
        if app:
            logging.info(f"Found app: {app}")
            return app_helper(app)
        else:
            logging.warning(f"No application found with app_id: {app_id}")
            raise HTTPException(status_code=404, detail="No application found with the provided ID")
    except Exception as e:
        logging.error(f"Error retrieving application: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/update_app/{app_id}")
async def update_app(app_id: str, app_data: UpdateAppModel):
    try:
        # Ensure the app_id is valid
        if not ObjectId.is_valid(app_id):
            raise HTTPException(status_code=400, detail="Invalid app_id format")

        # Fetch the current application details
        existing_app = await app_collection.find_one({"_id": ObjectId(app_id)})

        # if not existing_app:
        #     raise HTTPException(status_code=404, detail="Application not found")

        # Check for uniqueness of application name (excluding the current application)
        if app_data.app_name and app_data.app_name != existing_app.get("app_name"):
            existing_app_name = await app_collection.find_one({
                "app_name": app_data.app_name,
                "company_id": existing_app["company_id"],
                "_id": {"$ne": ObjectId(app_id)}  # Exclude current application
            })
            if existing_app_name:
                raise HTTPException(status_code=400, detail="Application name already exists for this company.")
        
        # Check for uniqueness of application URL (excluding the current application)
        if app_data.app_url and app_data.app_url != existing_app.get("app_url"):
            existing_app_url = await app_collection.find_one({
                "app_url": app_data.app_url,
                "company_id": existing_app["company_id"],
                "_id": {"$ne": ObjectId(app_id)}  # Exclude current application
            })
            if existing_app_url:
                raise HTTPException(status_code=400, detail="Application URL already exists for this company.")

        # Proceed with the update operation
        update_result = await app_collection.update_one(
            {"_id": ObjectId(app_id)},
            {"$set": app_data.dict(exclude_unset=True)}
        )
        
        if update_result.modified_count == 1:
            return {"msg": "Application updated successfully"}
        else:
            raise HTTPException(status_code=404, detail="Application not found")
    
    except HTTPException as http_exc:
        # Reraise HTTP exceptions to be caught by FastAPI
        raise http_exc
    except Exception as e:
        # Log the full error message and raise a detailed HTTP exception
        print(f"Unexpected error during update_app operation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# API Endpoint for creating a user according to the application
@app.post("/submit_user")
async def create_app_user(app: ApplicationUsers):
    user_data = app.dict()
    user_data["app_id"] = ObjectId(user_data["app_id"])  # Convert app_id to ObjectId
    try:
        result = await app_user_collection.insert_one(user_data)  # Insert into app_user_collection
        if result.inserted_id:
            return {"status": "Success", "message": "User created successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to create user")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# API Endpoint to get the application user information
@app.get("/get_app_users")
async def get_app_users(company_id: str, app_id: str):
    try:
        logging.info(f"Fetching users for Company ID: {company_id}, App ID: {app_id}")

        # Convert app_id to ObjectId
        query = {
            "company_id": company_id,
            "app_id": ObjectId(app_id)  # Ensure app_id is treated as ObjectId
        }

        users = []
        async for user in app_user_collection.find(query):
            # Convert ObjectId fields to strings and append to the users list
            users.append(app_user_helper(user))

        logging.info(f"Users found: {len(users)}")
        return users
    except Exception as e:
        logging.error(f"Error retrieving users: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")