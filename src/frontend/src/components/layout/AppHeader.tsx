import LoginButton from '../auth/LoginButton';
import { useGetCallerUserProfile } from '../../hooks/useQueries';

export default function AppHeader() {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src="/assets/generated/sharaffiya-logo.dim_512x512.png" alt="Logo" className="h-8 w-8" />
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold leading-none">Sharaffiya Market</h1>
            <p className="text-xs text-muted-foreground">Leave Register</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {userProfile && <span className="text-sm text-muted-foreground hidden sm:inline">{userProfile.name}</span>}
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
