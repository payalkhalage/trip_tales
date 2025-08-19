import React, { useEffect, useState, useRef } from "react";
import { 
  connectSocket, 
  joinChat, 
  sendMessage, 
  receiveMessage, 
  getChatHistory,
  disconnectSocket 
} from "./chatSocket";

function ChatBox({ chatId, userId }) {
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const messagesEndRef = useRef(null);

 useEffect(() => {
  if (!chatId || !userId) return;

  // Initialize socket connection
  connectSocket(userId);
  
  // Join chat room
  joinChat(chatId, userId);
  
  // Set up message listeners
  const handleHistory = (history) => {
    setMessages(history);
    scrollToBottom();
  };
  
  const handleMessage = (message) => {
    setMessages((prev) => [...prev, message]);
    scrollToBottom();
  };

  getChatHistory(handleHistory);
  receiveMessage(handleMessage);

  return () => {
    // Clean up listeners
    socket.off("chatHistory", handleHistory);
    socket.off("receiveMessage", handleMessage);
    disconnectSocket();
  };
}, [chatId, userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!body.trim()) return;
    sendMessage(chatId, userId, body);
    setBody("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message ${msg.sender_id === userId ? "sent" : "received"}`}
          >
            <div className="message-header">
              <span className="sender">{msg.sender_name}</span>
              <span className="time">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="message-body">{msg.body}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="message-input">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} disabled={!body.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;