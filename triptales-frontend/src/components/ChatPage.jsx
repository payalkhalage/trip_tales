import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ChatBox from "../components/ChatBox";
import { toast } from "react-toastify";
import './ChatPage.css';


function ChatPage() {
  const { postId } = useParams();
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const initializeChat = async () => {
      try {
        const res = await axios.post("/api/chats/init", {
          postId,
          userId: currentUser.id
        });
        setChatId(res.data.chatId);
      } catch (err) {
        console.error("Failed to initialize chat", err);
        setError("Failed to start chat");
        toast.error("Failed to start chat");
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [postId, currentUser, navigate]);

  if (loading) return <div>Loading chat...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="chat-page">
      <h2>Chat</h2>
      {chatId && (
        <ChatBox chatId={chatId} userId={currentUser.id} />
      )}
    </div>
  );
}

export default ChatPage;