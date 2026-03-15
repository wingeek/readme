/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Settings,
  Fingerprint,
  Brain,
  Users,
  Wrench,
  Database,
  Activity,
  Rocket,
  Search,
  Info,
  Mic,
  Paperclip,
  Send,
  Loader2,
  User,
  Bot
} from 'lucide-react';
import { useFiles } from './hooks/useFiles';
import { useChat } from './hooks/useChat';
import { MarkdownRenderer } from './components/MarkdownRenderer';

export default function App() {
  const [activeTab, setActiveTab] = useState('IDENTITY');
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { files, fileContent, loading: filesLoading, loadFile } = useFiles();
  const { messages, isLoading, sendMessage } = useChat();

  // Load file content when tab changes
  useEffect(() => {
    loadFile(activeTab);
  }, [activeTab, loadFile]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const navItems = [
    { id: 'IDENTITY', title: 'IDENTITY.md', subtitle: 'Occupation', icon: Fingerprint, activeColor: 'text-primary', activeBg: 'bg-primary/5', activeBorder: 'border-primary' },
    { id: 'SOUL', title: 'SOUL.md', subtitle: 'Personality', icon: Brain, activeColor: 'text-primary', activeBg: 'bg-surface-container-highest/50', activeBorder: 'border-outline-variant' },
    { id: 'USER', title: 'USER.md', subtitle: 'Clients', icon: Users, activeColor: 'text-primary', activeBg: 'bg-surface-container-highest/50', activeBorder: 'border-outline-variant' },
    { id: 'TOOLS', title: 'TOOLS.md', subtitle: 'Tools', icon: Wrench, activeColor: 'text-primary', activeBg: 'bg-surface-container-highest/50', activeBorder: 'border-outline-variant' },
    { id: 'MEMORY', title: 'MEMORY.md', subtitle: 'Memory', icon: Database, activeColor: 'text-primary', activeBg: 'bg-surface-container-highest/50', activeBorder: 'border-outline-variant' },
    { id: 'HEARTBEAT', title: 'HEARTBEAT.md', subtitle: 'Rhythm', icon: Activity, activeColor: 'text-primary', activeBg: 'bg-surface-container-highest/50', activeBorder: 'border-outline-variant' },
    { id: 'BOOTSTRAP', title: 'BOOTSTRAP.md', subtitle: 'Birth', icon: Rocket, activeColor: 'text-tertiary', activeBg: 'bg-tertiary/5', activeBorder: 'border-tertiary', isSpecial: true },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-3 bg-surface border-b border-outline-variant/30 h-12 shrink-0">
        <div className="flex items-center gap-4">
          <Terminal className="text-primary w-5 h-5" />
          <span className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase font-medium">
            Aether Protocol // Node: Alpha
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-label text-[10px] text-primary font-bold">NODE: SYNCHRONIZED</span>
          <Settings className="text-on-surface-variant w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-72 bg-surface-container-low border-r border-outline-variant/30 flex flex-col shrink-0">
          <div className="p-6">
            <h2 className="font-headline text-xs font-bold tracking-widest text-outline uppercase mb-6">
              Archive Explorer
            </h2>
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`group px-3 py-2.5 flex items-center gap-3 cursor-pointer transition-all border-l-2 ${
                      isActive
                        ? `${item.activeColor} ${item.activeBg} ${item.activeBorder}`
                        : `text-on-surface-variant hover:bg-surface-container-highest/50 border-transparent hover:border-outline-variant ${item.isSpecial ? 'text-tertiary/70 hover:border-tertiary hover:bg-tertiary/5' : ''}`
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? '' : 'group-hover:text-primary'} ${item.isSpecial && !isActive ? '' : ''}`} />
                    <div className="flex-1">
                      <p className="font-label text-xs font-semibold">{item.title}</p>
                      <p className={`font-label text-[9px] uppercase tracking-wider ${isActive ? (item.isSpecial ? 'text-tertiary/60' : 'text-primary/70') : (item.isSpecial ? 'text-tertiary/60' : 'text-outline')}`}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Stats Footer */}
          <div className="mt-auto p-6 bg-surface-container-low border-t border-outline-variant/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label text-[9px] text-outline font-bold">UPTIME_99.98%</span>
              <span className="font-label text-[9px] text-primary font-bold">INTEGRITY_0.999</span>
            </div>
            <div className="w-full h-1 bg-surface-container-highest">
              <div className="w-[99%] h-full bg-primary"></div>
            </div>
          </div>
        </nav>

        {/* Main Content - Split View */}
        <main className="flex-1 flex flex-col relative selection-glow min-w-0">
          {/* Editor Header */}
          <div className="h-10 border-b border-outline-variant/30 flex items-center justify-between px-8 bg-surface-container-lowest shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-label text-[10px] text-primary font-bold tracking-widest">
                ~/DRIVE/{activeTab}.md
              </span>
              <span className="text-[9px] text-outline px-1.5 py-0.5 border border-outline-variant bg-surface-container-low font-bold">
                READ_ONLY
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-label text-[9px] text-outline font-bold">{filesLoading ? '...' : `${fileContent.split('\n').length}:1`}</span>
              <Search className="w-4 h-4 text-outline cursor-pointer hover:text-primary" />
            </div>
          </div>

          {/* Split Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* File Preview (left side) */}
            <div className="w-1/2 border-r border-outline-variant/30 overflow-y-auto p-8 bg-white">
              {filesLoading ? (
                <div className="text-sm text-on-surface-variant">Loading...</div>
              ) : (
                <MarkdownRenderer content={fileContent || 'No content'} className="text-sm" />
              )}
            </div>

            {/* Chat Area (right side) */}
            <div className="w-1/2 flex flex-col bg-surface-container-lowest">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-on-surface-variant/50">
                    <div className="text-center">
                      <Bot className="w-12 h-12 mx-auto mb-4 text-primary/30" />
                      <p className="text-sm">开始对话...</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                          msg.role === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-surface-container-low text-on-surface'
                        }`}
                      >
                        {msg.content ? (
                          <MarkdownRenderer content={msg.content} />
                        ) : (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Aether Scrollbar Indicator */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-48 bg-surface-container-highest">
            <div className="w-full h-16 bg-primary"></div>
          </div>
        </main>
      </div>

      {/* Bottom Command Bar */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/40 px-6 py-5 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div className="flex-1 flex items-center gap-4 bg-surface-container-low border border-outline-variant/20 px-4 py-2">
            <span className="font-label text-[10px] text-primary font-bold tracking-widest">QUERY:</span>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-xs font-body text-on-surface placeholder:text-outline/40 px-0"
              placeholder="Awaiting instruction..."
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center gap-6 border-l border-outline-variant/30 pl-6">
            <div className="flex gap-4">
              <Mic className="text-outline w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
              <Paperclip className="text-outline w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="bg-primary text-white font-label text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-2.5 hover:bg-surface-tint transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Execute
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
