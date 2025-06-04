'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import Image from 'next/image';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedSessionId = sessionStorage.getItem('chatbotSessionId');
    if (savedSessionId) setSessionId(savedSessionId);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const res = await fetch('https://khelverse-khelbot-para-athlete.hf.space/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          sessionId
            ? { session_id: sessionId, message: input }
            : { message: input }
        ),
      });

      const data = await res.json();
      const botMsg = { text: data.reply || 'No response.', sender: 'bot' };
      const newSessionId = data.session_id;

      if (!sessionId && newSessionId) {
        setSessionId(newSessionId);
        sessionStorage.setItem('chatbotSessionId', newSessionId);
      }

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages((prev) => [
        ...prev,
        { text: 'Something went wrong. Please try again.', sender: 'bot' },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* Floating Icon Button */}
      <div
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-black rounded-full p-1 shadow-lg border-2 border-purple-500 animate-pulse hover:scale-105 transition-transform cursor-pointer"
        style={{ boxShadow: '0 0 12px rgba(168, 85, 247, 0.6)' }}
      >
        <Image
          src="https://res.cloudinary.com/dgj1gzq0l/image/upload/v1743663818/Group_2280_1_tyylqw.svg"
          alt="Chatbot"
          width={60}
          height={60}
          className="rounded-full"
        />
      </div>

      {/* Modal Chatbot UI */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px] w-[90%] h-[500px] bg-black border border-purple-700/40 flex flex-col justify-between p-4 rounded-xl">
          {/* Message Display Area */}
          <div className="overflow-y-auto space-y-3 flex-1">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm p-3 rounded-xl max-w-[80%] ${
                  msg.sender === 'user'
                    ? 'bg-purple-700 text-white ml-auto'
                    : 'bg-[#222] text-purple-300'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2 mt-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="bg-[#1a1a1a] text-white border-purple-700"
            />
            <Button
              onClick={handleSend}
              className="bg-purple-700 hover:bg-purple-800 text-white"
              disabled={!input.trim()}
            >
              <Send size={18} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chatbot;
