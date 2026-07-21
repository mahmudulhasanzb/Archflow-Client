'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Loader2, MessageSquareCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { askSupportAgent } from '@/lib/api/supportAgent';

interface AiAssistatProps {
  title?: string;
  description?: string;
}

const SupportChat = ({
  title = 'AI Assistant',
  description = "Ask me anything and I'll do my best to assist you!",
}: AiAssistatProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Call real AI response using OpenRouter
  const getAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    try {
      const reply = await askSupportAgent(userMessage);
      setMessages(prev => [...prev, { text: reply, isUser: false }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { text: 'Failed to get response from AI. Please try again.', isUser: false },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (input.trim() === '') return;

    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');

    getAIResponse(userMessage);
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        title="AI Support Chat"
        id="support-chat-toggle"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <MessageSquareCode className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-500"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed bottom-24 right-6 z-50 flex h-[600px] w-[400px] max-w-[calc(100vw-2rem)] flex-col bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl overflow-hidden shadow-2xl border border-indigo-500/20 font-sans"
          >
            {/* Header */}
            <div className="bg-indigo-600/30 backdrop-blur-sm p-4 border-b border-indigo-500/30 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sparkles className="text-indigo-300 h-5 w-5 animate-pulse" />
                <h2 className="text-white font-medium">{title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="text-indigo-200 hover:text-white transition-colors text-xs font-semibold px-2 py-1 rounded hover:bg-white/10"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages container */}
            <div className="p-4 flex-grow overflow-y-auto bg-slate-900/50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="h-12 w-12 text-indigo-400 mb-4" />
                  <h3 className="text-indigo-200 text-lg mb-2">
                    How can I help you today?
                  </h3>
                  <p className="text-slate-400 text-xs max-w-xs">{description}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.isUser
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-slate-700/60 text-slate-100 rounded-tl-none border border-slate-600/50'
                        } animate-fade-in`}
                      >
                        <p className="text-xs">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-3 rounded-2xl bg-slate-700/60 text-slate-100 rounded-tl-none border border-slate-600/50">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-75"></div>
                          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-150"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input form */}
            <form
              onSubmit={handleSubmit}
              className={`p-4 border-t ${isFocused ? 'border-indigo-500/70 bg-slate-800/80' : 'border-slate-700/50 bg-slate-800/30'} transition-colors duration-200`}
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Type your message..."
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-full py-2.5 pl-4 pr-12 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 text-xs"
                />
                <button
                  type="submit"
                  disabled={input.trim() === ''}
                  className={`absolute right-1 rounded-full p-2 ${
                    input.trim() === ''
                      ? 'text-slate-500 bg-slate-700/50 cursor-not-allowed'
                      : 'text-white bg-indigo-600 hover:bg-indigo-500'
                  } transition-colors`}
                >
                  {isTyping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <style>
        {`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .delay-75 {
          animation-delay: 0.2s;
        }
        
        .delay-150 {
          animation-delay: 0.4s;
        }
        `}
      </style>
    </>
  );
};

export default SupportChat;
