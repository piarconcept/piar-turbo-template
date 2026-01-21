'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export interface LayoutProps {
  children: ReactNode;
  language?: 'es' | 'ca' | 'en';
  className?: string;
}

export function Layout({ children, language = 'ca', className = '' }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header language={language} />
      
      <main className={`flex-1 w-full ${className}`}>
        {children}
      </main>
      
      <Footer language={language} />
    </div>
  );
}
