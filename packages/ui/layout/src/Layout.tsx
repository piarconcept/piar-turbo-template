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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Header language={language} />
      
      <main 
        className={className}
        style={{
          flex: 1,
          width: '100%'
        }}
      >
        {children}
      </main>
      
      <Footer language={language} />
    </div>
  );
}
