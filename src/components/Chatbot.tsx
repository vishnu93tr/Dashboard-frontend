"use client";

import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface ChatMessage {
  type: "user" | "bot";
  text: string;
}

const apiBase = process.env.NEXT_PUBLIC_API_BASE;

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const updateLastBotMessage = (msg: ChatMessage) => {
    setMessages((prev) => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      if (updated[lastIndex]?.text === "🤔 Thinking...") {
        updated[lastIndex] = msg;
      } else {
        updated.push(msg);
      }
      return updated;
    });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { type: "user", text: input };
    const thinkingMessage: ChatMessage = { type: "bot", text: "🤔 Thinking..." };
    setMessages((prev) => [...prev, userMessage, thinkingMessage]);
    setInput("");
    setLoading(true);

    try {
      const askRes = await axios.post(`${apiBase}/api/ask`, {
        question: input,
      });

      const task_id = askRes.data.task_id;

      const poll = async () => {
        try {
          const result = await axios.get(`${apiBase}/api/result/${task_id}`);
          const status = result.data.status;

          if (status === "done") {
            const { task_id, status, ...cleaned } = result.data;
            updateLastBotMessage({
              type: "bot",
              text: JSON.stringify(cleaned, null, 2),
            });
            setLoading(false);
          } else if (status === "error") {
            updateLastBotMessage({
              type: "bot",
              text: `❌ Error: ${JSON.stringify(result.data.error || result.data, null, 2)}`,
            });
            setLoading(false);
          } else {
            setTimeout(poll, 3000);
          }
        } catch (err) {
          updateLastBotMessage({ type: "bot", text: "❌ Failed to fetch result." });
          setLoading(false);
        }
      };

      setTimeout(poll, 1000);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "🚨 Failed to reach backend." },
      ]);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          AI Assistant
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed top-0 right-0 h-screen w-1/2 bg-white shadow-lg z-50 flex flex-col p-4 border-l">
          {/* Header with Clear Chat + Close */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">AI Assistant</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setMessages([])}>
                Clear Chat
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 border p-3 rounded-lg mb-4 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-3 ${msg.type === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.type === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </ScrollArea>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <Button onClick={handleSend} disabled={loading}>
              Send
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
