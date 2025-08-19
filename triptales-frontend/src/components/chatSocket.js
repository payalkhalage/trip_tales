import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  autoConnect: false,
});

export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.auth = { userId };
    socket.connect();
  }
};

export const joinChat = (chatId, userId) => {
  if (!chatId || !userId) {
    console.error("❌ chatId or userId missing in joinChat");
    return;
  }
  console.log(`🟢 User ${userId} joining chat ${chatId}`);
  socket.emit("joinChat", { chatId, userId });
};

export const sendMessage = (chatId, senderId, body) => {
  if (!chatId || !senderId || !body) {
    console.error("❌ Missing chatId, senderId, or body in sendMessage");
    return;
  }
  console.log(`📨 Sending message: ${body} in chat ${chatId}`);
  socket.emit("sendMessage", { chatId, senderId, body });
};

export const receiveMessage = (callback) => {
  socket.on("receiveMessage", (message) => {
    console.log("📩 New message received:", message);
    callback(message);
  });
};

export const getChatHistory = (callback) => {
  socket.on("chatHistory", (messages) => {
    console.log("📜 Chat history received:", messages);
    callback(messages);
  });
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket;