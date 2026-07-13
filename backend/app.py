from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

from sqlalchemy.orm import Session

from database import engine, get_db

from models import (
    Base,
    User,
    Conversation,
    Message
)

from schemas import (
    UserRegister,
    UserLogin,
    ConversationCreate,
    MessageCreate
)

from passlib.context import CryptContext
from rag import retrieve_context

app = FastAPI()

Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str


# ---------------- REGISTER ----------------

@app.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):

    existing = db.query(User).filter(
        User.username == user.username
    ).first()

    if existing:
        return {
            "message": "Username already exists"
        }

    hashed_password = pwd_context.hash(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        username=user.username,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Registration Successful"
    }


# ---------------- LOGIN ----------------

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    existing = db.query(User).filter(
        User.username == user.username
    ).first()

    if not existing:
        return {
            "message": "Invalid Username"
        }

    if not pwd_context.verify(
        user.password,
        existing.password
    ):
        return {
            "message": "Invalid Password"
        }

    return {
        "message": "Login Successful",
        "user_id": existing.id,
        "username": existing.username
    }


# ---------------- CREATE CONVERSATION ----------------

@app.post("/conversation")
def create_conversation(
    conversation: ConversationCreate,
    db: Session = Depends(get_db)
):

    new_conversation = Conversation(
        user_id=conversation.user_id,
        title=conversation.title
    )

    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)

    return {
        "conversation_id": new_conversation.id,
        "title": new_conversation.title
    }


# ---------------- GET ALL CONVERSATIONS ----------------

@app.get("/conversations/{user_id}")
def get_conversations(
    user_id: int,
    db: Session = Depends(get_db)
):

    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == user_id)
        .order_by(Conversation.created_at.desc())
        .all()
    )

    return conversations
# ---------------- SAVE MESSAGE ----------------

@app.post("/message")
def save_message(
    message: MessageCreate,
    db: Session = Depends(get_db)
):

    new_message = Message(
        conversation_id=message.conversation_id,
        role=message.role,
        content=message.content
    )

    db.add(new_message)

    if message.role == "user":
        conversation = db.query(Conversation).filter(
            Conversation.id == message.conversation_id
        ).first()

        if conversation and conversation.title == "New Chat":
            conversation.title = message.content[:30]

    db.commit()
    db.refresh(new_message)

    return {
        "message": "Saved Successfully"
    }

# ---------------- GET MESSAGES ----------------

@app.get("/messages/{conversation_id}")
def get_messages(
    conversation_id: int,
    db: Session = Depends(get_db)
):

    messages = (
        db.query(Message)
        .filter(
            Message.conversation_id == conversation_id
        )
        .order_by(Message.timestamp.asc())
        .all()
    )

    return messages

# ---------------- CHATBOT ----------------

@app.post("/chat")
def chat(req: ChatRequest):

    context = retrieve_context(req.message)

    prompt = f"""
You are BankAssist AI, a friendly and professional banking customer support assistant.

Instructions:
- Answer politely and professionally.
- Use complete sentences.
- Greet the customer naturally if appropriate.
- Explain the process step by step.
- Include required documents whenever relevant.
- Use only the information provided in the context.
- If the information is not available, say:
"I'm sorry, I couldn't find that information in the banking knowledge base."

Context:
{context}

Customer Question:
{req.message}

Professional Answer:
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "qwen3:1.7b",
            "prompt": prompt,
            "stream": False,
            "think": False
        }
    )

    return {
        "answer": response.json()["response"]
    }