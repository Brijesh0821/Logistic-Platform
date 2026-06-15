import { useEffect, useMemo, useRef, useState } from "react";
import { FiMessageCircle, FiSend, FiTruck, FiX } from "react-icons/fi";
import axios from "../utils/axiosConfig";

const now = () =>
  new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

const welcomeMessage = {
  sender: "bot",
  text: "Welcome to SwiftLogix AI Logistics Assistant. I can recommend couriers, explain volumetric weight, suggest packaging, compare COD vs prepaid, and help with tracking or delivery delays.",
  time: now(),
  suggestions: ["Recommend courier", "Volumetric weight", "Packaging advice"],
};

const localFallback = (input) => {
  const text = input.toLowerCase();
  if (/^(hi|hello|hey|good morning|good evening)\b/.test(text)) {
    return {
      reply: "Hello! I am SwiftLogix support. How can I help with your shipment today?",
      suggestions: ["Track order", "Get price", "Pickup request"],
    };
  }
  if (text.includes("price") || text.includes("cost") || text.includes("rate")) {
    return {
      reply: "Pricing depends on distance, weight, vehicle, delivery speed, fuel surcharge, GST, insurance, fragile handling, and COD. The Smart Price Calculator can show a live estimate.",
      suggestions: ["Weight limit", "Insurance", "COD support"],
    };
  }
  if (text.includes("track")) {
    return {
      reply: "Open the Tracking page and enter your shipment ID or AWB number. If scans are delayed, contact support with the ID.",
      suggestions: ["Delivery ETA", "Delivery delay"],
    };
  }
  return {
    reply: "I can help with courier recommendations, volumetric weight, packaging, COD vs prepaid, tracking, pricing, delivery delays, insurance, and serviceability.",
    suggestions: ["Recommend courier", "Volumetric weight", "COD vs Prepaid"],
  };
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([welcomeMessage]);
  const [typing, setTyping] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const chatEndRef = useRef(null);

  const suggestions = useMemo(() => {
    const lastBot = [...chat].reverse().find((item) => item.sender === "bot" && item.suggestions?.length);
    return lastBot?.suggestions || ["Track order", "Shipment pricing", "Support contact"];
  }, [chat]);

  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, typing]);

  const appendBot = (payload) => {
    setChat((prev) => [
      ...prev,
      {
        sender: "bot",
        text: payload.reply || payload.text || localFallback("").reply,
        time: now(),
        suggestions: payload.suggestions,
      },
    ]);
  };

  const sendMessage = async (quickReply) => {
    const currentMessage = String(quickReply || message).trim();
    if (!currentMessage || typing) return;

    setChat((prev) => [...prev, { sender: "user", text: currentMessage, time: now() }]);
    setTyping(true);
    setMessage("");

    try {
      const res = await axios.post("/chat", { message: currentMessage });
      setTimeout(() => appendBot(res.data), 350);
    } catch {
      setTimeout(() => appendBot(localFallback(currentMessage)), 350);
    } finally {
      setTimeout(() => setTyping(false), 350);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setOpen(!open);
          setShowBubble(false);
        }}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition hover:bg-blue-700"
        aria-label="Open support chat"
      >
        <FiMessageCircle className="h-6 w-6" />
        <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
      </button>

      {showBubble && !open && (
        <div className="fixed bottom-20 right-5 z-40 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-md">
          Need shipment help?
        </div>
      )}

      {open && (
        <div className="fixed bottom-20 right-5 z-50 flex w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-950 p-4 text-white">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-blue-500/20 p-2 text-blue-200">
                <FiTruck />
              </span>
              <div>
                <p className="font-semibold">AI Logistics Assistant</p>
                <p className="text-xs text-emerald-300">Online now</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-300 hover:bg-white/10" aria-label="Close support chat">
              <FiX />
            </button>
          </div>

          <div className="h-80 space-y-3 overflow-y-auto bg-slate-50 p-3">
            {chat.map((item, index) => (
              <div key={`${item.time}-${index}`} className={`flex ${item.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[84%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    item.sender === "user"
                      ? "rounded-br-sm bg-blue-600 text-white"
                      : "rounded-bl-sm border border-slate-100 bg-white text-slate-700"
                  }`}
                >
                  <p>{item.text}</p>
                  <p className={`mt-1 text-[10px] ${item.sender === "user" ? "text-blue-100" : "text-slate-400"}`}>{item.time}</p>
                </div>
              </div>
            ))}

            {typing && (
              <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-sm border border-slate-100 bg-white px-3 py-2 shadow-sm">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-slate-100 bg-white p-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {suggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => sendMessage(item)}
                  className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
              <input
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <button onClick={() => sendMessage()} disabled={typing || !message.trim()} className="text-blue-600 transition hover:text-blue-700 disabled:text-slate-300" aria-label="Send message">
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
