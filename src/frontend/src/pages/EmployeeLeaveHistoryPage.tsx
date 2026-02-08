import { useParams } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useGetAllEmployees, useGetEmployeeLeaves } from '../hooks/useQueries';
import { Loader2, Download, ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import LeaveResultsList from '../components/leaves/LeaveResultsList';
import { groupLeavesByMonth } from '../lib/leaves/monthlySummary';
import { exportToCSV } from '../lib/export/csv';

export default function EmployeeLeaveHistoryPage() {
  const { employeeId } = useParams({ from: '/employees/$employeeId/history' });
  const { data: employees = [] } = useGetAllEmployees();
  const { data: leaves = [], isLoading } = useGetEmployeeLeaves(employeeId);

  const employee = employees.find((e) => e.id === employeeId);
  const monthlySummary = groupLeavesByMonth(leaves);

  const handleExport = () => {
    if (leaves.length === 0) return;
    exportToCSV(leaves, employees, `leave-history-${employee?.fullName || employeeId}.csv`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl space-y-6 px-4 py-6">
      <div className="flex items-center gap-3">
        <Link to="/employees">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{employee?.fullName || 'Employee'}</h2>
          <p className="text-sm text-muted-foreground">Leave History</p>
        </div>
        {leaves.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
          <CardDescription>Leave count by month</CardDescription>
        </CardHeader>
        <CardContent>
          {monthlySummary.length === 0 ? (
            <p className="text-sm text-muted-foreground">No leave records found</p>
          ) : (
            <div className="space-y-2">
              {monthlySummary.map((month) => (
                <div key={month.month} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="font-medium">{month.month}</span>
                  <span className="text-sm text-muted-foreground">{month.count} leaves</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Leave Entries</CardTitle>
          <CardDescription>{leaves.length} total records</CardDescription>
        </CardHeader>
        <CardContent>
          <LeaveResultsList leaves={leaves} employees={employees} />
        </CardContent>
      </Card>
    </div>
  );
}
