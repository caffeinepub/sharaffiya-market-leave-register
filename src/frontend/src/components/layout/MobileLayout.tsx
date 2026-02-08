import { ReactNode } from 'react';
import BottomNav from './BottomNav';
import AppHeader from './AppHeader';

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
