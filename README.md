# 🏦 BankAssist AI – Banking Chatbot using RAG and Ollama

## 📌 Project Overview

BankAssist AI is an intelligent banking chatbot that provides instant answers to banking-related queries using Retrieval-Augmented Generation (RAG) and a locally running Large Language Model (LLM) through Ollama.

The chatbot allows users to register, login, ask banking questions, and receive AI-generated responses based on a custom banking knowledge base.

---

# 🚀 Features

### User Authentication
- User Registration
- User Login
- Logout

### AI Chatbot
- Banking question answering
- Local AI using Ollama
- RAG-based document retrieval
- Typing animation
- Copy AI response
- Clear chat

### Banking Dashboard
- KYC Information
- Savings Account Assistance
- Loan Information
- Card Services
- UPI Services

### User Interface
- Modern responsive design
- Dark / Light Mode
- Banking dashboard cards
- Scrollable chat window

---

# 🛠 Technology Stack

## Frontend
- React.js
- Vite
- Axios
- React Router DOM
- CSS3

## Backend
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Uvicorn

## AI Technologies
- Ollama
- Qwen 2.5 (3B)
- LangChain
- FAISS Vector Database
- RAG (Retrieval Augmented Generation)

---

# 📂 Project Structure

```
BankAssist-AI
│
├── backend
│   ├── app.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── rag.py
│   ├── requirements.txt
│   ├── kb/
│   └── vector_db/
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Chat.jsx
│   │   ├── components
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/visalya-hub/chat-bot.git
```

---

## Backend Setup

```bash
cd backend
```

Create Virtual Environment

```bash
python -m venv venv
```

Activate

### Windows

```bash
venv\Scripts\activate
```

Install Dependencies

```bash
pip install -r requirements.txt
```

Run Backend

```bash
uvicorn app:app --reload
```

Backend URL

```
http://127.0.0.1:8000
```

---

## Frontend Setup

```bash
cd frontend
```

Install Packages

```bash
npm install
```

Run

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# 🤖 Ollama Setup

Install Ollama

https://ollama.com

Pull Qwen Model

```bash
ollama pull qwen2.5:3b
```

Run Model

```bash
ollama run qwen2.5:3b
```

---

# 🗄 Database

SQLite Database

Tables

- Users
- Conversations
- Messages

---

# API Endpoints

## Authentication

POST

```
/register
```

POST

```
/login
```

---

## Conversations

POST

```
/conversation
```

GET

```
/conversations/{user_id}
```

---

## Messages

POST

```
/message
```

GET

```
/messages/{conversation_id}
```

---

## Chatbot

POST

```
/chat
```

---

# RAG Workflow

```
User Question
       │
       ▼
Retrieve Relevant Documents
       │
       ▼
FAISS Vector Search
       │
       ▼
Context Retrieval
       │
       ▼
Qwen LLM (Ollama)
       │
       ▼
AI Response
```

---

# Screenshots

- Login Page
- Registration Page
- Dashboard
- Chat Interface
- Dark Mode
- Banking Cards

(Add screenshots here)

---

# Future Enhancements

- Chat History Sidebar
- Voice Input
- Speech Output
- PDF Upload Support
- Multi-language Support
- Admin Dashboard
- User Profile
- Secure Password Hashing
- JWT Authentication
- Cloud Deployment

---

# Learning Outcomes

This project demonstrates:

- React Development
- FastAPI Backend Development
- REST APIs
- Authentication
- SQLAlchemy ORM
- SQLite Database
- Retrieval-Augmented Generation (RAG)
- Vector Databases (FAISS)
- Large Language Models (Ollama)
- Frontend-Backend Integration

---

# Author

**Visalya**

BankAssist AI – Intelligent Banking Chatbot

GitHub:
https://github.com/visalya-hub/chat-bot

---

# License

This project is developed for educational and learning purposes.
