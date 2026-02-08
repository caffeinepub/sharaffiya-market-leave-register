import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useActor } from './hooks/useActor';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from './hooks/useQueries';
import LoginButton from './components/auth/LoginButton';
import AccessDeniedScreen from './components/auth/AccessDeniedScreen';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import MobileLayout from './components/layout/MobileLayout';
import HomePage from './pages/HomePage';
import EmployeesPage from './pages/EmployeesPage';
import AddLeavePage from './pages/AddLeavePage';
import SearchPage from './pages/SearchPage';
import EmployeeLeaveHistoryPage from './pages/EmployeeLeaveHistoryPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Loader2 } from 'lucide-react';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { identity, loginStatus } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { mutate: saveProfile, isPending: savingProfile } = useSaveCallerUserProfile();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const isInitializing = loginStatus === 'initializing' || actorFetching;

  // Show loading during initialization
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Sharaffiya Market Leave Register</h1>
            <p className="text-muted-foreground">Please sign in to continue</p>
          </div>
          <LoginButton />
        </div>
      </div>
    );
  }

  // Check admin access
  if (actor) {
    // Show profile setup if needed
    const showProfileSetup = !profileLoading && isFetched && userProfile === null && !savingProfile;
    if (showProfileSetup) {
      return (
        <ProfileSetupModal
          onSave={(name) => {
            saveProfile({ name });
          }}
          isSaving={savingProfile}
        />
      );
    }

    // Check if user is admin (will be handled by backend calls)
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function AppContent() {
  return (
    <ErrorBoundary>
      <AuthGate>
        <MobileLayout>
          <RouterProvider router={router} />
        </MobileLayout>
      </AuthGate>
    </ErrorBoundary>
  );
}

// Define routes
const rootRoute = createRootRoute({
  component: () => (
    <div className="flex-1">
      <Outlet />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const employeesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employees',
  component: EmployeesPage,
});

const addLeaveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/add-leave',
  component: AddLeavePage,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: SearchPage,
});

const employeeHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employees/$employeeId/history',
  component: EmployeeLeaveHistoryPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  employeesRoute,
  addLeaveRoute,
  searchRoute,
  employeeHistoryRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <AppContent />;
}
