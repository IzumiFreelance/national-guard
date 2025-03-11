import React, { useState } from 'react';
import { Send } from 'lucide-react';
import PaperGen from './PaperGen';

const API_KEY = "AIzaSyACs27id08grEM8zZ3V44vNfIprnoh9nHs";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

function Chat() {
  const [showPaperGen, setShowPaperGen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      const botMessage = { sender: "bot", text: data.choices?.[0]?.text || "No response received." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error fetching response." }]);
    }
  };

  if (showPaperGen) {
    return <PaperGen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="text-center py-4 text-lg font-bold bg-gray-800">Chatbot</header>
      
      <main className="flex-grow p-4 flex flex-col gap-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-2xl px-4 py-2 rounded-lg ${msg.sender === "user" ? "self-end bg-blue-500" : "self-start bg-gray-700"}`}
          >
            {msg.text}
          </div>
        ))}
      </main>
      
      <footer className="p-4 bg-gray-800 flex items-center gap-2">
        <input
          className="flex-grow px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          onClick={handleSendMessage}
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </footer>
    </div>
  );
}

export default Chat;
