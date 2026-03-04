import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 I'm your AI-powered Pet Care Assistant for Paws City, powered by Cohere AI! I can help you with:\n\n🐕 Dog care and training\n🐱 Cat health and behavior\n🐦 Bird care basics\n🐰 Small animal care\n🏥 General pet health advice\n🍽️ Nutrition guidance\n🎓 Training tips\n\nAsk me anything about pet care, and I'll provide helpful, personalized advice!",
      sender: "bot",
      timestamp: new Date(),
      isAI: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getDemoResponse = (message) => {
    const lower = message.toLowerCase();
    if (lower.includes("dog") || lower.includes("puppy")) {
      return "🐶 Dogs need quality food, daily walks, and regular vet checkups. Always ensure plenty of fresh water and social interaction!";
    }
    if (lower.includes("cat") || lower.includes("kitten")) {
      return "🐱 Cats enjoy a mix of wet and dry food, clean litter, and interactive toys. Schedule annual vet visits for vaccinations.";
    }
    if (lower.includes("bird")) {
      return "🐦 Birds need species-appropriate food, fresh water, a clean cage, and social stimulation. Consult an avian vet for specifics.";
    }
    return "💡 You can ask me about pet care topics like dog training, cat health, or bird care. I’m here to help!";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await res.json();

      const botText = data.success !== false
        ? data.response
        : getDemoResponse(inputMessage);

      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now() + 1, 
          text: botText, 
          sender: "bot", 
          timestamp: new Date(),
          isAI: data.success !== false 
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      const botText = getDemoResponse(inputMessage);
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now() + 1, 
          text: botText, 
          sender: "bot", 
          timestamp: new Date(),
          isAI: false 
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Floating Chat Icon */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-96 flex flex-col bg-white rounded-lg shadow-2xl border overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <h3 className="font-semibold">Pet Care Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : msg.isAI === false
                      ? "bg-yellow-50 border border-yellow-200 text-gray-800"
                      : "bg-white border text-gray-800"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {msg.sender === "bot" && (
                      <Bot 
                        size={16} 
                        className={`mt-1 ${
                          msg.isAI === false ? "text-yellow-600" : "text-blue-600"
                        }`} 
                      />
                    )}
                    {msg.sender === "user" && <User size={16} className="text-white mt-1" />}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{msg.text}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span
                          className={`text-xs opacity-70 ${
                            msg.sender === "user" ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </span>
                        {msg.sender === "bot" && (
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            msg.isAI === false 
                              ? "bg-yellow-100 text-yellow-700" 
                              : "bg-green-100 text-green-700"
                          }`}>
                            {msg.isAI === false ? "Offline" : "AI"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border p-3 rounded-lg max-w-[80%] flex items-center space-x-2">
                  <Bot size={16} className="text-blue-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3 bg-white flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about pet care..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
