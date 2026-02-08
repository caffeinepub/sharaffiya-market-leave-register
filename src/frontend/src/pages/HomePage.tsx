import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, PlusCircle, Search, Calendar } from 'lucide-react';
import { useGetAllEmployees } from '../hooks/useQueries';

export default function HomePage() {
  const { data: employees = [] } = useGetAllEmployees();

  const quickActions = [
    {
      title: 'Add Leave',
      description: 'Record a new leave entry',
      icon: PlusCircle,
      path: '/add-leave',
      variant: 'default' as const,
    },
    {
      title: 'Search Leaves',
      description: 'Find leave records',
      icon: Search,
      path: '/search',
      variant: 'outline' as const,
    },
    {
      title: 'Manage Employees',
      description: 'View and add employees',
      icon: Users,
      path: '/employees',
      variant: 'outline' as const,
    },
  ];

  return (
    <div className="container max-w-2xl space-y-6 px-4 py-6">
      <div className="space-y-2">
        <img
          src="/assets/generated/leave-header-illustration.dim_1600x600.png"
          alt="Leave Register"
          className="w-full rounded-lg"
        />
        <h2 className="text-2xl font-bold">Welcome Back</h2>
        <p className="text-muted-foreground">Manage employee leave records efficiently</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-2xl font-bold">{employees.length}</p>
              <p className="text-xs text-muted-foreground">Total Employees</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">-</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <div className="grid gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.path} to={action.path}>
                <Card className="transition-colors hover:bg-accent">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{action.title}</CardTitle>
                      <CardDescription className="text-xs">{action.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <footer className="pt-8 text-center text-xs text-muted-foreground">
        © 2026. Built with ❤️ using{' '}
        <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline">
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
