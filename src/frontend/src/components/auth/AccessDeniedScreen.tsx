import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import LoginButton from './LoginButton';

export default function AccessDeniedScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access this application. Only administrators can use this system.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
