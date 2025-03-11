import React, { useState } from "react";
import { Plus, Mic, Send } from "lucide-react";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual API key

  const getTextResponse = async (prompt) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "contents": [{ "parts": [{ "text": prompt }] }] })
        }
      );
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't understand that.";
    } catch (error) {
      return "Error: " + error.message;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const botResponse = await getTextResponse(input);
    setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10 px-4">
      <h1 className="text-4xl font-bold mb-6">Chatbot</h1>
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 flex flex-col">
        <div className="flex-grow h-80 overflow-y-auto border-b border-gray-300 pb-4 mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 my-2 rounded-lg max-w-xs ${msg.sender === "user" ? "bg-blue-500 text-white self-end text-right ml-auto" : "bg-gray-200 text-black self-start mr-auto"}`}
            >
              <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-auto">
          <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300">
            <Plus className="w-6 h-6 text-gray-500" />
          </button>
          
          <input
            type="text"
            className="flex-grow bg-gray-100 rounded-full px-4 py-2 border border-gray-300 focus:outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          
          <button
            onClick={sendMessage}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black text-white"
            disabled={loading}
          >
            {loading ? "..." : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
