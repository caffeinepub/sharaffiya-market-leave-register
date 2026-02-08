import { Link, useRouterState } from '@tanstack/react-router';
import { Home, Users, PlusCircle, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function BottomNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/employees', label: 'Employees', icon: Users },
    { path: '/add-leave', label: 'Add Leave', icon: PlusCircle },
    { path: '/search', label: 'Search', icon: Search },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'fill-primary/20')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
