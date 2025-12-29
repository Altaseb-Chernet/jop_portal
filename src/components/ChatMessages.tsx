import React from 'react';

// 1️⃣ Define the shape of a single message
export interface Message {
  text: string;
  sender: 'user' | 'bot';
  loading?: boolean; // Optional flag for showing typing animation
}

// 2️⃣ Define the props for the component
interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      <div className='max-w-[80%] bg-gray-200 px-3 py-2 rounded-lg text-sm'> Hello 👋 Welcome to EthioCareer! How can I help you today? </div>
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`max-w-[80%] px-3 py-2 rounded-lg text-sm
            ${msg.sender === "user"
              ? "ml-auto bg-primary-500 text-white"
              : "mr-auto bg-gray-200 text-gray-800"
            }`}
        >
          {msg.loading ? (
            // Typing dots animation
            <div className="flex space-x-1">
              <span className="animate-bounce text-2xl">.</span>
              <span className="animate-bounce text-2xl" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-bounce text-2xl" style={{ animationDelay: '0.4s' }}>.</span>
            </div>
          ) : (
            msg.text
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
