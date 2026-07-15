import random
from fastapi import FastAPI
from pydantic import BaseModel
# from fastapi.middlewa
from components.send_mail import send_app_email, EmailRequest
from auth import send_password_forgot_mail
from headers import files
from fastapi.middleware.cors import CORSMiddleware
from auth import login_auth
from auth.forgot_password import router as forgot_password_router
from models.goal import router as goal_router
import schemas.auth as BrowserAuth
app = FastAPI() 

from fastapi import BackgroundTasks
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import EmailStr

chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
def generate_random_string(length):
    return ''.join(random.choice(chars) for _ in range(length))

class BrowserTokenSchema(BaseModel):
    length : int

class BrowserVerifySchema(BaseModel):
    running_status: bool
    token: str | None = None
class DashboardDataAccessVerify(BaseModel):
    user_verify: str



@app.post("/create-token-browser")
def CreateTokenBrowser(data : BrowserTokenSchema):
    token = generate_random_string(data.length)
    return {"token": token}

@app.post("/veryfy-browser")
async def VerifyBrowser(data: BrowserVerifySchema):
    try:
        if data.token:
            return {
                "status": True,
                "sendedSchema": data.running_status,
                "success": True,
                "message": "Successful"
            }

        return {
            "status": False,
            "sendedSchema": data.running_status,
            "success": False,
            "message": "No browser token found"
        }
    except Exception as e:
        return {
            "success": False,
            "message": "Sorry. Request Could not be handeled from server"
        }
# 1. Define the Request Body Schema
# 2. Configure SMTP Connection Settings
# Replace these values with your actual email provider details

# 3. Create the Email Endpoint
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forgot_password_router)
app.include_router(goal_router)

class User(BaseModel):
    email: str
    password : str
class RegUserModel(BaseModel):
    full_name: str
    user_name: str
    email: str
    password: str
@app.get("/",)
def home():
    return {"message": "Hello World"}


@app.post("/login")
async def login(user: User):
    if login_auth.checkUser(user.email, user.password) is True:
        return {
            "status": True,
            "message": "Login successful",
            "data": {
                "email": user.email
            }
        }

    return {
        "status": False,
        "message": "Invalid email or password"
    }
# ১. নিশ্চিত করুন ওপরে BackgroundTasks ইম্পোর্ট করা আছে

# ... আপনার বাকি কোড ...

@app.post("/register")
# ২. এখানে এন্ডপয়েন্টের প্যারামিটারে background_tasks যুক্ত করুন
async def register_user(user: RegUserModel, background_tasks: BackgroundTasks):
    try: 
        result = files.saveRegisterdUsers({
            "email": user.email,
            "password": user.password,
            "fullname": user.full_name,
            "username": user.user_name
        })

        if not result.get("success"):
            return {"status": False, "message": result.get("message")}
        
        # ৩. এখানে সরাসরি 'background_tasks' ভেরিয়েবলটি পাস করুন (BackgroundTasks() এভাবে নয়)
        send_app_email(
            subject='Welcome to LifeOS', 
            body=f'Hello {user.full_name},\n\nThank you for registering with LifeOS! We are excited to have you on board.\n\nBest regards,\nOWNER - Nur Mohammad Srizon', 
            background_tasks=background_tasks,
            recipients=[user.email]
        )
        
        return {
            "status": True,
            "message": f"{user.full_name}'s Signup Successful. Please Login Now ",
            "data": result.get("user")
        }
    except Exception as e:
        # প্রিন্ট করে দেখতে পারেন আসল সমস্যা কী হচ্ছে যদি তাও না কাজ করে
        print(f"Email Error: {e}") 
        return {
            "status": False,
            "message": "An error occured. Please try again to sign up later or contact authorities"
        } 
@app.get("/users")
async def get_users():
    users = [
        {
            "id": 1,
            "name": "Aizen",
            "age": 18
        },
        {
            "id": 2,
            "name": "John",
            "age": 25
        }
    ]

    return users

