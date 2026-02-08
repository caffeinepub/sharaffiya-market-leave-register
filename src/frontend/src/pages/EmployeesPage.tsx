import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus, History, Loader2, UserCircle } from 'lucide-react';
import { useGetAllEmployees } from '../hooks/useQueries';
import AddEmployeeDialog from '../components/employees/AddEmployeeDialog';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function EmployeesPage() {
  const navigate = useNavigate();
  const { data: employees = [], isLoading } = useGetAllEmployees();
  const [showAddDialog, setShowAddDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl space-y-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Employees</h2>
          <p className="text-sm text-muted-foreground">{employees.length} total</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {employees.length === 0 ? (
        <Alert>
          <AlertDescription>
            No employees found. Add your first employee to get started.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-3">
          {employees.map((employee) => (
            <Card key={employee.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <UserCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{employee.fullName}</CardTitle>
                      {employee.jobTitle && (
                        <CardDescription className="text-xs">{employee.jobTitle}</CardDescription>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate({ to: '/employees/$employeeId/history', params: { employeeId: employee.id } })}
                  >
                    <History className="mr-1 h-4 w-4" />
                    History
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <AddEmployeeDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
}
