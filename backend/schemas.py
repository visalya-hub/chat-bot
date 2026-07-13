from pydantic import BaseModel


# ---------------- AUTH ----------------

class UserRegister(BaseModel):
    name: str
    email: str
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


# ---------------- CONVERSATION ----------------

class ConversationCreate(BaseModel):
    user_id: int
    title: str = "New Chat"


# ---------------- MESSAGE ----------------

class MessageCreate(BaseModel):
    conversation_id: int
    role: str
    content: str