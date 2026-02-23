'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface LayoutContextType {
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile overlay
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop collapse

  // Close sidebar on mobile when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const toggleSidebarCollapse = useCallback(() => setIsSidebarCollapsed((prev) => !prev), []);

  return (
    <LayoutContext.Provider
      value={{
        isSidebarOpen,
        isSidebarCollapsed,
        toggleSidebar,
        toggleSidebarCollapse,
        closeSidebar,
        openSidebar,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
