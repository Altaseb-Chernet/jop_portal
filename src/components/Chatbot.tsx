import { useState } from "react";
import ChatMessages from "./ChatMessages"; 
import ChatInput from "./ChatInput";
import { BotMessageSquare } from "lucide-react";

// ===============================
// 1️⃣ GREETING KEYWORDS
// ===============================
const greetings: string[] = [
  "hi", "hello", "hey", "selam", "selam naw",
  "good morning", "good afternoon", "good evening"
];

// ===============================
// 2️⃣ SYSTEM / PLATFORM RESPONSES
// ===============================
interface ResponseItem {
  keywords: string[];
  reply: string;
}

const systemResponses: ResponseItem[] = [
  {
    keywords: [
      "ethio career",
      "ethiocareer",
      "this website",
      "this platform",
      "what is this",
      "what is ethio career",
      "about ethio career",
      "system",
      "platform",
      "scope",
      "what do you do"
    ],
    reply:
      "EthioCareer is an online job and freelancing platform, similar to Upwork. " +
      "It connects job seekers, freelancers, and employers in one place. " +
      "Employers can post jobs and projects, while job seekers can apply, showcase skills, and get hired."
  }
];

// ===============================
// 3️⃣ FAQ RESPONSES
// ===============================
const faqResponses: ResponseItem[] = [
  {
    keywords: ["register", "signup", "create account"],
    reply:
      "To use EthioCareer, you need to create an account. " +
      "Click the Register button and complete the signup form."
  },
  {
    keywords: ["developed", "created by"],
    reply:
      "Yonas, Altaseb, Yohanis, Muluken are the developers of EthioCareer."
  },
  {
    keywords: ["job", "jobs", "apply"],
    reply:
      "Job seekers can browse available jobs and apply directly through EthioCareer."
  },
  {
    keywords: ["freelancer", "freelancing", "project"],
    reply:
      "Freelancers can find short-term and long-term projects posted by employers."
  },
  {
    keywords: ["employer", "post job"],
    reply:
      "Employers can post jobs or projects and review applications from qualified candidates."
  },
  {
    keywords: ["contact", "support"],
    reply:
      "For help and support, please visit the Contact section of EthioCareer."
  }
];

// ===============================
// 4️⃣ Message Type
// ===============================
interface Message {
  sender: "user" | "bot";
  text: string;
  loading?: boolean; // Added loading flag for AI typing
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [showNotice, setShowNotice] = useState(true); // controls initial notice


  // ===============================
  // 1️⃣ AI API call function
  // ===============================
  const getAIReply = async (text: string): Promise<string> => {
    try {
      const res = await fetch("http://localhost:8000/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data: { reply: string } = await res.json();
      return data.reply;
    } catch (err) {
      console.error(err);
      return "AI service is currently unavailable.";
    }
  };

  // ===============================
  // 2️⃣ Bot response logic
  // ===============================
  const getBotReply = (text: string): string | null => {
    const message = text.toLowerCase();

    // Greeting check
    if (greetings.some(word => message.includes(word))) {
      return "Hello 👋 Welcome to EthioCareer! How can I help you today?";
    }

    // System responses
    for (let item of systemResponses) {
      if (item.keywords.some(word => message.includes(word))) {
        return item.reply;
      }
    }

    // FAQ responses
    for (let item of faqResponses) {
      if (item.keywords.some(word => message.includes(word))) {
        return item.reply;
      }
    }

    // Fallback → call AI
    return null;
  };

  // ===============================
  // 3️⃣ Send message with AI fallback & loading
  // ===============================
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: "user", text }]);

    const localReply = getBotReply(text);

    if (localReply === null) {
      // Add loading animation
      const loadingMsg: Message = { sender: "bot", text: "", loading: true };
      setMessages(prev => [...prev, loadingMsg]);

      const aiReply = await getAIReply(text);

      // Replace loading message with actual AI reply
      setMessages(prev => prev.map(msg =>
        msg.loading ? { sender: "bot", text: aiReply } : msg
      ));
    } else {
      setMessages(prev => [...prev, { sender: "bot", text: localReply }]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="w-80 sm:w-100 h-120 bg-white rounded-xl shadow-lg flex flex-col mb-3">
          <div className="bg-primary-500 text-white p-3 rounded-t-xl flex justify-between items-center">
            <span>EthioCareer Chat</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <ChatMessages messages={messages} />
          <ChatInput onSend={sendMessage} />
        </div>
      )}

 <div className="relative">
      <button
        onClick={() => {setOpen(!open), setShowNotice(false)}}
        className="w-14 h-14 rounded-full bg-primary-600  text-white shadow-lg flex items-center justify-center text-xl"
      >
        
        <BotMessageSquare />
      </button>

      {/* Persistent notice */}
      {showNotice && (
        <div className="absolute -top-20 -left-63 bg-green-600 text-white rounded-xl px-6 py-4 shadow-lg z-50 w-64">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-md">EthioCareer Chat</p>
              <p className="text-xs text-gray-200 mt-1">
                Welcome to EthioCareer Chat Bot <br />👋 Free to ask anything!
              </p>
            </div>
            <button
              onClick={() => setShowNotice(false)}
              className="ml-4 text-white font-bold text-md"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>


    </div>
  );
};

export default Chatbot;
