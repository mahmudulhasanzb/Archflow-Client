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
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        title="AI Support Chat"
        aria-label="AI Support Chat"
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
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
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
            className="fixed bottom-24 right-6 z-50 flex h-[600px] w-[400px] max-w-[calc(100vw-2rem)] flex-col bg-card text-card-foreground rounded-2xl overflow-hidden shadow-2xl border border-border font-sans"
          >
            {/* Header */}
            <div className="bg-muted/70 backdrop-blur-sm p-4 border-b border-border flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sparkles className="text-foreground h-5 w-5 animate-pulse" />
                <h2 className="text-foreground font-medium text-sm">{title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold px-2 py-1 rounded hover:bg-muted"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close support chat"
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages container */}
            <div className="p-4 flex-grow overflow-y-auto bg-background">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-foreground text-base font-semibold mb-2">
                    How can I help you today?
                  </h3>
                  <p className="text-muted-foreground text-xs max-w-xs">{description}</p>
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
                            ? 'bg-primary text-primary-foreground rounded-tr-none shadow-xs'
                            : 'bg-muted text-foreground rounded-tl-none border border-border'
                        } animate-fade-in`}
                      >
                        <p className="text-xs leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-3 rounded-2xl bg-muted text-foreground rounded-tl-none border border-border">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-foreground animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-foreground animate-pulse delay-75"></div>
                          <div className="w-2 h-2 rounded-full bg-foreground animate-pulse delay-150"></div>
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
              className={`p-4 border-t border-border bg-card transition-colors duration-200`}
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Type your message..."
                  className="w-full bg-muted border border-border rounded-full py-2.5 pl-4 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-xs"
                />
                <button
                  type="submit"
                  disabled={input.trim() === ''}
                  aria-label="Send message"
                  className={`absolute right-1 rounded-full p-2 ${
                    input.trim() === ''
                      ? 'text-muted-foreground bg-muted cursor-not-allowed'
                      : 'text-primary-foreground bg-primary hover:opacity-90'
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
