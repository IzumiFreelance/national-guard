import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Bot, User, Loader } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const API_KEY = ""; // Replace with your actual API key

interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const generateMCQs = (topic: string) => {
  return Array.from({ length: 30 }, (_, i) => {
    const question = `Q${i + 1}: What is an important aspect of ${topic}?`;
    const correctAnswer = `Correct Answer ${i + 1}`;
    const incorrectAnswers = [
      `Incorrect Answer ${i + 1}A`,
      `Incorrect Answer ${i + 1}B`,
      `Incorrect Answer ${i + 1}C`,
    ];
    const allAnswers = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);
    return {
      question,
      answers: allAnswers,
      correctAnswer,
    };
  });
};

const downloadPDF = (topic: string, mcqs: any[]) => {
  const doc = new jsPDF();
  doc.text(`MCQs for Topic: ${topic}`, 10, 10);
  const rows = mcqs.map((mcq, index) => [index + 1, mcq.question, ...mcq.answers]);
  doc.autoTable({
    head: [['#', 'Question', 'A', 'B', 'C', 'D']],
    body: rows,
  });
  doc.save(`${topic.replace(/\s+/g, '_')}_mcqs.pdf`);
};

const PaperGen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mcqs, setMcqs] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { type: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Generate MCQs based on user input (topic)
    const generatedMCQs = generateMCQs(input);
    setMcqs(generatedMCQs);

    const botMessage: Message = {
      type: 'bot',
      content: `Generated 30 MCQs for topic: ${input}. Click below to download.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <FileText className="text-blue-600" size={24} />
          <h1 className="text-xl font-semibold">Paper Generation Assistant</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-3 mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <Bot size={20} />
                </div>
              )}
              <div className={`rounded-lg p-4 max-w-[80%] ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={20} />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Bot size={20} />
              </div>
              <div className="rounded-lg p-4 bg-white border">
                <Loader className="animate-spin" size={20} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="border-t bg-white p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter topic for MCQs..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
      {mcqs.length > 0 && (
        <div className="p-4 text-center">
          <button
            onClick={() => downloadPDF(input, mcqs)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Download MCQs PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default PaperGen;
