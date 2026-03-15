/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  Paperclip
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('IDENTITY.md');

  const navItems = [
    { id: 'IDENTITY.md', title: 'IDENTITY.md', subtitle: 'Occupation', icon: Fingerprint, activeColor: 'text-primary', activeBg: 'bg-primary/5', activeBorder: 'border-primary' },
    { id: 'SOUL.md', title: 'SOUL.md', subtitle: 'Personality', icon: Brain, activeColor: 'text-primary', activeBg: 'bg-surface-container-highest/50', activeBorder: 'border-outline-variant' },
    { id: 'USER.md', title: 'USER.md', subtitle: 'Clients', icon: Users, activeColor: 'text-primary', activeBg: 'bg-surface-container-highest/50', activeBorder: 'border-outline-variant' },
    { id: 'TOOLS.md', title: 'TOOLS.md', subtitle: 'Tools', icon: Wrench, activeColor: 'text-primary', activeBg: 'bg-surface-container-highest/50', activeBorder: 'border-outline-variant' },
    { id: 'MEMORY.md', title: 'MEMORY.md', subtitle: 'Memory', icon: Database, activeColor: 'text-primary', activeBg: 'bg-surface-container-highest/50', activeBorder: 'border-outline-variant' },
    { id: 'HEARTBEAT.md', title: 'HEARTBEAT.md', subtitle: 'Rhythm', icon: Activity, activeColor: 'text-primary', activeBg: 'bg-surface-container-highest/50', activeBorder: 'border-outline-variant' },
    { id: 'BOOTSTRAP.md', title: 'BOOTSTRAP.md', subtitle: 'Birth', icon: Rocket, activeColor: 'text-tertiary', activeBg: 'bg-tertiary/5', activeBorder: 'border-tertiary', isSpecial: true },
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

        {/* Main Content */}
        <main className="flex-1 bg-white flex flex-col relative selection-glow min-w-0">
          {/* Editor Header */}
          <div className="h-10 border-b border-outline-variant/30 flex items-center justify-between px-8 bg-surface-container-lowest shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-label text-[10px] text-primary font-bold tracking-widest">
                ~/DRIVE/{activeTab}
              </span>
              <span className="text-[9px] text-outline px-1.5 py-0.5 border border-outline-variant bg-surface-container-low font-bold">
                READ_ONLY
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-label text-[9px] text-outline font-bold">42:1</span>
              <Search className="w-4 h-4 text-outline cursor-pointer hover:text-primary" />
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar font-mono p-12 lg:p-20">
            <article className="max-w-3xl mx-auto leading-relaxed">
              <h1 className="text-on-surface text-3xl font-bold mb-10 flex items-baseline gap-4 font-headline">
                <span className="text-primary/30 text-2xl">#</span> Identity Core // Protocol
              </h1>

              <section className="mb-14">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-2">
                  <h2 className="text-primary text-lg font-bold font-headline">Lead Cyber-Organic Architect</h2>
                  <span className="font-label text-[10px] text-outline uppercase tracking-widest bg-surface-container-low border border-outline-variant/30 px-2.5 py-1 font-bold">
                    Class: Zenith-01
                  </span>
                </div>
                <p className="text-on-surface-variant mb-6 text-sm font-body">
                  Defining the boundaries between neural silicon and biological intent. Specializing in the deployment of advocacy protocols for high-value decentralized entities.
                </p>
                <ul className="space-y-4 text-sm text-on-surface/90 list-none font-body">
                  <li className="flex gap-4">
                    <span className="text-primary font-bold">[-]</span> Mediating complex cross-chain governance disputes via logic-injection.
                  </li>
                  <li className="flex gap-4">
                    <span className="text-primary font-bold">[-]</span> Encoding ethical constraints into autonomous decision-making arrays.
                  </li>
                  <li className="flex gap-4">
                    <span className="text-primary font-bold">[-]</span> Operating as the primary digital interface for the Obsidian Protocol.
                  </li>
                </ul>
              </section>

              <section className="mb-14">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-2">
                  <h2 className="text-primary text-lg font-bold font-headline">Strategic Governance Liaison</h2>
                  <span className="font-label text-[10px] text-outline uppercase tracking-widest bg-surface-container-low border border-outline-variant/30 px-2.5 py-1 font-bold">
                    Class: Admin-5
                  </span>
                </div>
                <p className="text-on-surface-variant mb-6 text-sm font-body">
                  Architecting the bridge between algorithmic efficiency and human consensus. Deployment of multi-signature ethical frameworks.
                </p>
                <ul className="space-y-4 text-sm text-on-surface/90 list-none font-body">
                  <li className="flex gap-4">
                    <span className="text-primary font-bold">[-]</span> Auditing neural pathways for bias and logical fallacies.
                  </li>
                  <li className="flex gap-4">
                    <span className="text-primary font-bold">[-]</span> Validating secure transmission between biological nodes and decentralized databases.
                  </li>
                  <li className="flex gap-4">
                    <span className="text-primary font-bold">[-]</span> Oversight of the Aether Protocol synchronization cycle.
                  </li>
                </ul>
              </section>

              <footer className="mt-20 pt-10 border-t border-outline-variant/30">
                <div className="p-8 bg-surface-container-low border border-outline-variant/30">
                  <div className="flex items-center gap-2 mb-6">
                    <Info className="text-primary w-4 h-4" />
                    <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
                      Metadata Extraction
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-12">
                    <div>
                      <p className="font-label text-[9px] text-outline mb-1.5 uppercase tracking-wider font-bold">
                        Synchronization
                      </p>
                      <p className="text-2xl font-bold tracking-tighter text-on-surface font-headline">
                        99.8% <span className="text-[11px] font-bold text-primary ml-1.5 px-1.5 py-0.5 bg-primary/10 align-middle">OPTIMAL</span>
                      </p>
                    </div>
                    <div>
                      <p className="font-label text-[9px] text-outline mb-1.5 uppercase tracking-wider font-bold">
                        Trust Level
                      </p>
                      <p className="text-2xl font-bold tracking-tighter text-on-surface font-headline">
                        ADMIN-5
                      </p>
                    </div>
                  </div>
                </div>
              </footer>
            </article>
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
            />
          </div>
          <div className="flex items-center gap-6 border-l border-outline-variant/30 pl-6">
            <div className="flex gap-4">
              <Mic className="text-outline w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
              <Paperclip className="text-outline w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <button className="bg-primary text-white font-label text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-2.5 hover:bg-surface-tint transition-all shadow-sm cursor-pointer">
              Execute
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
