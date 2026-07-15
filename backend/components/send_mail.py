from fastapi import FastAPI, BackgroundTasks
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr
import os 
from dotenv import load_dotenv

# Load variables from the .env file
load_dotenv()
app = FastAPI()

# ১. SMTP কনফিগারেশন সেটআপ
conf = ConnectionConfig(
    MAIL_USERNAME="srizonboos@gmail.com",
    MAIL_PASSWORD=os.getenv("GOOGLE_ACCOUNT_APP_PASSWORD"),  # এখানে আপনার জিমেইলের ১৬ অক্ষরের অ্যাপ পাসওয়ার্ডটি দিন
    MAIL_FROM="srizonboos@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_FROM_NAME="LifeOS App",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

# ২. ইমেইল পাঠানোর মূল ফাংশন (যা আপনি যেকোনো জায়গায় ব্যবহার করতে পারবেন)
def send_app_email(subject: str, body: str, background_tasks: BackgroundTasks, recipients: list[str] = ["your_email@gmail.com"]):
    if not os.getenv("GOOGLE_ACCOUNT_APP_PASSWORD"):
        print("[DEV EMAIL] SMTP password not configured. Email content follows:")
        print(f"Subject: {subject}")
        print(f"Recipients: {recipients}")
        print(f"Body:\n{body}")
        return

    message = MessageSchema(
        subject=subject,
        recipients=recipients,  # এখানে আপনি নির্দিষ্ট কোনো ইমেইল লিস্টও দিতে পারেন
        body=body,
        subtype=MessageType.plain
    )
    
    fm = FastMail(conf)
    # ব্যাকগ্রাউন্ডে ইমেইল পাঠানোর জন্য টাস্ক অ্যাড করা হলো
    background_tasks.add_task(fm.send_message, message)


# ৩. রিকোয়েস্ট বডি স্কিমা (এপিআই এর জন্য)
class EmailRequest(BaseModel):
    subject: str
    body: str


# ৪. এপিআই এন্ডপয়েন্ট
@app.post("/send-email")
async def handle_send_email(email_data: EmailRequest, background_tasks: BackgroundTasks):
    
    # তৈরি করা ফাংশনটিকে এখানে কল করা হলো
    send_app_email(
        subject=email_data.subject,
        body=email_data.body,
        background_tasks=background_tasks
    )

    return {"message": "Email has been queued and is sending in the background"}