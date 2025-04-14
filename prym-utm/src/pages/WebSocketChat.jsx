import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

const WebSocketChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(`ws://localhost:3000`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    socketRef.current.onmessage = (event) => {
      const message = event.data;
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log("Received message:", message);
    };

    socketRef.current.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "") {
      socketRef.current.send(input);
      setInput(""); // Clear the input field after sending
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="max-w-md mx-auto mt-10 font-sans text-center">
      <h2 className="text-2xl font-semibold mb-4">💬 Simple Chat App</h2>

      <div className="border border-gray-300 p-4 h-80 overflow-y-auto bg-gray-100 mb-4 rounded">
        {messages.map((msg, index) => (
          <div key={index} className="text-left p-2 my-1 bg-gray-200 rounded">
            {msg}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleEnter}
          className="flex-1 p-2 border border-gray-400 rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default WebSocketChat;
