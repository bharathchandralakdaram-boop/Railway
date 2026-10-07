import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import GlobalSearchModal from '../common/GlobalSearchModal';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Auto-collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#070b14] bg-grid-pattern text-slate-100 flex">
      {/* Left Collapsible Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          collapsed ? 'ml-[70px]' : 'ml-[250px]'
        }`}
      >
        {/* Top Header */}
        <Header onOpenSearch={() => setSearchOpen(true)} />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-7 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 px-6 text-center text-xs font-mono text-slate-500">
          RAILWAY AI INTELLIGENCE CENTER • MISSION-CRITICAL TRACK OPERATIONS & TELEMETRY
        </footer>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
