import "./Sidebar.css";

export default function Sidebar({
  conversations,
  selectedConversation,
  setSelectedConversation,
  createNewChat,
  logout,
}) {
  return (
    <div className="sidebar">

      <div className="sidebar-top">

        <h2>🏦 BankAssist AI</h2>

        <button
          className="new-chat-btn"
          onClick={createNewChat}
        >
          + New Chat
        </button>

      </div>

      <div className="conversation-list">

        {conversations.map((chat) => (

          <div
            key={chat.id}
            className={
              selectedConversation === chat.id
                ? "conversation active"
                : "conversation"
            }
            onClick={() =>
              setSelectedConversation(chat.id)
            }
          >
            💬 {chat.title}
          </div>

        ))}

      </div>

      <button
        className="logout-btn"
        onClick={logout}
      >
        🚪 Logout
      </button>

    </div>
  );
}