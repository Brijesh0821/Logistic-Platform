import { useEffect, useRef, useState } from "react";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";
import axios from "../utils/axiosConfig";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const currentMessage = message;
    setChat((prev) => [...prev, { sender: "user", text: currentMessage }]);
    setTyping(true);
    setMessage("");

    try {
      const res = await axios.post("/chat", { message: currentMessage });
      setChat((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch {
      setChat((prev) => [...prev, { sender: "bot", text: "Server error. Please try again." }]);
    } finally {
      setTyping(false);
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
          Need help?
        </div>
      )}

      {open && (
        <div className="fixed bottom-20 right-5 z-50 flex w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 bg-white p-4">
            <div>
              <p className="font-semibold text-slate-950">SwiftLogix Support</p>
              <p className="text-xs text-emerald-600">Online</p>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
              <FiX />
            </button>
          </div>

          <div className="h-72 space-y-2 overflow-y-auto bg-slate-50 p-3">
            {chat.length === 0 && (
              <div className="rounded-lg bg-white p-3 text-sm text-slate-600 shadow-sm">
                Welcome. Ask anything about booking, tracking, or delivery status.
              </div>
            )}

            {chat.map((item, index) => (
              <div
                key={index}
                className={`max-w-[82%] rounded-lg p-3 text-sm ${
                  item.sender === "user" ? "ml-auto bg-blue-600 text-white" : "bg-white text-slate-700 shadow-sm"
                }`}
              >
                {item.text}
              </div>
            ))}

            {typing && <div className="text-sm text-slate-500">Typing...</div>}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-slate-100 p-3">
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
              <button onClick={sendMessage} className="text-blue-600 hover:text-blue-700">
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
