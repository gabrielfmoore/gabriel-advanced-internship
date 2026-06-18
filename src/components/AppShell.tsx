"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import Player from "@/components/Player";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <div
        className={`sidebar__overlay ${sidebarOpen ? "" : "sidebar__overlay--hidden"}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <div className="app-layout__body">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <SearchBar onToggleSidebar={() => setSidebarOpen((open) => !open)} />
        <main>{children}</main>
      </div>
      <Player />
    </div>
  );
}
