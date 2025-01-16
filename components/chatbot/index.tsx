import React, { useState, useRef, useEffect } from "react";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false); // Toggle chat window
  const chatRef = useRef<HTMLDivElement | null>(null); // Reference to the chat window

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
          className="absolute bottom-16 right-0 w-80 bg-white border border-gray-300 rounded-lg shadow-lg"
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
          <div className="p-4 h-64 overflow-y-auto">
            <div className="text-gray-500 text-sm text-center">
              Chat with me! Ask anything.
            </div>
            {/* Example messages */}
            <div className="mt-4">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg mb-2">
                Hi! How can I help you today?
              </div>
              <div className="bg-blue-100 text-blue-800 p-3 rounded-lg self-end mb-2">
                What can you do?
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 px-4 py-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;