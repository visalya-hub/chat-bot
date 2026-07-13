import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import "../App.css";

export default function Chat() {

  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [messages, setMessages] = useState([]);

  const [conversations, setConversations] = useState([]);

  const [selectedConversation, setSelectedConversation] = useState(null);

  const bottomRef = useRef();

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Load conversations

  useEffect(() => {

    if (!userId) return;

    loadConversations();

  }, []);

  const loadConversations = async () => {

    try {

      const res = await axios.get(
        `http://127.0.0.1:8000/conversations/${userId}`
      );

      setConversations(res.data);

      if (res.data.length > 0) {

        setSelectedConversation(res.data[0].id);

      }

    } catch (err) {

      console.log(err);

    }

  };

  // Load messages of selected conversation

  useEffect(() => {

    if (!selectedConversation) return;

    loadMessages(selectedConversation);

  }, [selectedConversation]);

  const loadMessages = async (conversationId) => {

    try {

      const res = await axios.get(
        `http://127.0.0.1:8000/messages/${conversationId}`
      );

      const data = res.data.map((m) => ({
        role: m.role,
        text: m.content,
      }));

      setMessages(data);

    } catch (err) {

      console.log(err);

    }

  };

  // Create new conversation

  const createNewChat = async () => {

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/conversation",
        {
          user_id: Number(userId),
          title: "New Chat",
        }
      );

      await loadConversations();

      setSelectedConversation(
        res.data.conversation_id
      );

      setMessages([]);

    } catch (err) {

      console.log(err);

    }

  };

  const handleLogout = () => {

    localStorage.clear();

    navigate("/");

  };
  // Ask AI

const askQuestion = async (question) => {

  if (!question.trim()) return;

  if (!selectedConversation) {
    await createNewChat();
}

  const userMessage = {
    role: "user",
    text: question,
  };

  setMessages((prev) => [
    ...prev,
    userMessage,
  ]);

  setMessage("");

  setLoading(true);

  try {

    // Save User Message

    await axios.post(
      "http://127.0.0.1:8000/message",
      {
        conversation_id: selectedConversation,
        role: "user",
        content: question,
      }
    );

    // Get AI Response

    const ai = await axios.post(
      "http://127.0.0.1:8000/chat",
      {
        message: question,
      }
    );

    const answer = ai.data.answer;

    // Show AI Response

    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text: answer,
      },
    ]);

    // Save AI Message

    await axios.post(
      "http://127.0.0.1:8000/message",
      {
        conversation_id: selectedConversation,
        role: "bot",
        content: answer,
      }
    );

    // Update Sidebar

    loadConversations();

  }

  catch (err) {

    console.log(err);

  }

  setLoading(false);

};

const clearChat = () => {

  setMessages([]);

};
return (
  <div
    style={{
      display: "flex",
      height: "100vh",
      background: darkMode ? "#111827" : "#f5f5f5",
    }}
  >

    <Sidebar
      conversations={conversations}
      selectedConversation={selectedConversation}
      setSelectedConversation={setSelectedConversation}
      createNewChat={createNewChat}
      logout={handleLogout}
    />

    <div
style={{
  flex: 1,
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  overflow: "hidden",
}}
>

      {/* Header */}

      <header className="header">

        <div>
          <h1>🏦 BankAssist AI</h1>
          <p>Your Banking Assistant</p>
        </div>

        <div className="theme-switch">

          <span>
            {darkMode ? "🌙" : "☀️"}
          </span>

          <label className="switch">

            <input
              type="checkbox"
              checked={darkMode}
              onChange={() =>
                setDarkMode(!darkMode)
              }
            />

            <span className="slider"></span>

          </label>

        </div>

      </header>
<div className="content">

  {/* Dashboard Cards */}

<section className="dashboard">

  <div
    className="card kyc-card"
    onClick={() => askQuestion("What documents are required for KYC?")}
  >
    <h3>📄 KYC</h3>
    <p>Complete your KYC verification.</p>
  </div>

  <div
    className="card account-card"
    onClick={() => askQuestion("How do I open a savings account?")}
  >
    <h3>🏦 Accounts</h3>
    <p>Open and manage savings accounts.</p>
  </div>

  <div
    className="card loan-card"
    onClick={() => askQuestion("How do I apply for a personal loan?")}
  >
    <h3>💰 Loans</h3>
    <p>Personal, home and education loans.</p>
  </div>

  <div
    className="card card-card"
    onClick={() => askQuestion("How do I block my debit card?")}
  >
    <h3>💳 Cards</h3>
    <p>Manage debit and credit cards.</p>
  </div>

  <div
    className="card upi-card"
    onClick={() => askQuestion("How do I register for UPI?")}
  >
    <h3>📱 UPI</h3>
    <p>Digital banking and UPI payments.</p>
  </div>

</section>
      {/* Messages */}

  <div className="chat">


        {messages.map((msg, index) => (

          <div
            key={index}
            className={`row ${msg.role}`}
          >

            <div className="bubble">

              <strong>

                {msg.role === "user"
                  ? "👤 You"
                  : "🤖 BankAssist AI"}

              </strong>

              <br />
              <br />

              <div
                style={{
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.text}
              </div>

              {msg.role === "bot" && (

                <button
                  className="copyBtn"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      msg.text
                    )
                  }
                >
                  📋 Copy
                </button>

              )}

            </div>

          </div>

        ))}

        {loading && (

          <div className="row bot">

            <div className="bubble">

              🤖 Thinking...

            </div>

          </div>

        )}

        <div ref={bottomRef}></div>

      </div>
      </div>

      {/* Input */}

      <div className="inputArea">

        <button
          className="clearBtn"
          onClick={clearChat}
        >
          🗑 Clear
        </button>

        <input
          value={message}
          placeholder="Ask anything..."
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {

            if (e.key === "Enter") {

              askQuestion(message);

            }

          }}
        />

        <button
          onClick={() =>
            askQuestion(message)
          }
        >
          Send
        </button>

      </div>

    </div>

  </div>
);
}
