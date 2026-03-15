/**
 * Hook for chat functionality
 */
import { useState, useCallback, useEffect } from 'react';
import { Message, sendChat } from '../lib/api';

const STORAGE_KEY = 'chat_history';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore storage errors
    }
  }, [messages]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: content.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChat(newMessages);
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
  };
}
