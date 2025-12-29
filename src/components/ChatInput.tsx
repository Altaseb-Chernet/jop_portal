import React, { useState } from "react";

// 1. Define the props interface
interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [input, setInput] = useState<string>("");

  const handleSend = () => {
    // Prevent sending empty messages or just whitespace
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="p-3 border-t flex gap-2 bg-white rounded-b-xl">
      
      <input
        type="text"
        value={input}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => 
          e.key === "Enter" && handleSend()
        }
        placeholder="Type a message..."
        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <button
        onClick={handleSend}
        disabled={!input.trim()} // Visual feedback: disable if empty
        className="bg-primary-600 text-white px-4 rounded-lg text-sm hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;