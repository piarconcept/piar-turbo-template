'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Button } from '@piar/ui-components';

/**
 * Logout Button Component
 * Triggers NextAuth signOut and redirects to login page
 */
export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <Button onClick={handleLogout} variant="secondary" className="flex items-center gap-2">
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </Button>
  );
}
