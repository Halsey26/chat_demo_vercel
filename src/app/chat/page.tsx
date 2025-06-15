'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function ChatPage() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({ api: '/api/chat' });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  return (
    // <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-200 p-4">
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-indigo-200 to-pink-100 p-4">
      {/* <img src="/Warmikuna_f.png" alt="Logo" className="h-10 w-auto" /> */}
      <div className="mx-auto w-[92%] sm:w-[85%] md:w-[700px]  lg:w-[800px] bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl flex flex-col overflow-hidden border border-gray-300 transition-all duration-300">

        <div className="flex items-center justify-center border-b border-gray-300 bg-white/60 py-4 px-6">
          <img src="/Warmikuna_f.png" alt="Logo" className="h-24 w-auto object-contain" />
        </div>

        <div className="h-[400px] overflow-y-auto p-4 space-y-4 scroll-smooth">

          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex max-w-[80%] ${
                m.role === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
              }`}
            >
              {m.role !== 'user' && (
                <div className="flex items-start mr-2">
                  <ChatBubbleLeftIcon className="h-5 w-5 text-blue-500 mt-1" />
                </div>
              )}
              <div
                className={`prose prose-sm max-w-full p-3 rounded-xl text-sm md:text-base ${
                  m.role === 'user'
                    ? 'bg-blue-100 text-gray-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-gray-500 italic px-3 animate-pulse text-center"
            >
              Escribiendo...
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row p-4 border-t gap-2"
        >
          <textarea
            ref={textareaRef}
            className="flex-1 p-2 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            value={input}
            onChange={handleInputChange}
            placeholder="Escribe un mensaje..."
            rows={1}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition-all duration-200 disabled:opacity-50"
          >
          ➤
          </button>
        </form>
      </div>
    </div>
  );
}
