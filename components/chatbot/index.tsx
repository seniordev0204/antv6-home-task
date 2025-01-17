import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false); // Toggle chat window
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([
    { text: "Hi! How can I help you today?", sender: "bot" },
  ]); // Store chat messages
  const [input, setInput] = useState<string>(""); // Store current input
  const [loading, setLoading] = useState<boolean>(false); // Loading spinner
  const chatRef = useRef<HTMLDivElement | null>(null); // Reference to the chat window

  const API_URL = "https://chatbot-hometask-fastapi-1.onrender.com/ask";

  // Close the chat window when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target as Node) // Ensure type compatibility
      ) {
        setIsOpen(false); // Close the chat window
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (input.trim()) {
      // Add the user's message to the chat
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput(""); // Clear the input field
      setLoading(true); // Show loading spinner

      try {
        // Send the request to the API
        const response = await axios.post(API_URL, { question: input });
        const answer = response.data.answer;

        // Add the bot's response to the chat
        setMessages((prev) => [...prev, { text: answer, sender: "bot" }]);
      } catch (error) {
        console.error("Error fetching response:", error);
        setMessages((prev) => [
          ...prev,
          { text: "Sorry, something went wrong. Please try again later.", sender: "bot" },
        ]);
      } finally {
        setLoading(false); // Hide loading spinner
      }
    }
  };

  // Handle Enter key press in the input field
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none"
        aria-label="Open chat"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatRef} // Attach the ref to the chat window
          className="absolute bottom-16 right-0 w-96 h-[32rem] bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
            <h3 className="text-lg font-semibold">Chatbot</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300 focus:outline-none"
              aria-label="Close chat"
            >
              ✖
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg mb-2 max-w-[80%] ${
                  message.sender === "user"
                    ? "bg-blue-100 text-blue-800 self-end ml-auto"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.text}
              </div>
            ))}
            {loading && (
              <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
                ⏳ Waiting for response...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 px-4 py-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} // Handle Enter key press
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
