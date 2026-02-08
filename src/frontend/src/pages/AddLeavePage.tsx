import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { useGetAllEmployees, useAddLeave } from '../hooks/useQueries';
import { LeaveType } from '../backend';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';

const leaveTypeMap = {
  'Full Day': LeaveType.vacation,
  'Morning Half': LeaveType.sick,
  'Evening Half': LeaveType.special,
};

export default function AddLeavePage() {
  const navigate = useNavigate();
  const { data: employees = [] } = useGetAllEmployees();
  const { mutate: addLeave, isPending } = useAddLeave();

  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState<Date>();
  const [leaveType, setLeaveType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeId || !date || !leaveType) {
      toast.error('Please fill in all required fields');
      return;
    }

    const leaveEntry = {
      employeeId,
      date: BigInt(date.getTime() * 1_000_000), // Convert to nanoseconds
      leaveType: leaveTypeMap[leaveType as keyof typeof leaveTypeMap],
    };

    addLeave(leaveEntry, {
      onSuccess: () => {
        toast.success('Leave entry added successfully');
        setEmployeeId('');
        setDate(undefined);
        setLeaveType('');
        setTimeout(() => navigate({ to: '/search' }), 1000);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to add leave entry');
      },
    });
  };

  return (
    <>
      <Toaster />
      <div className="container max-w-2xl space-y-6 px-4 py-6">
        <div>
          <h2 className="text-2xl font-bold">Add Leave Entry</h2>
          <p className="text-sm text-muted-foreground">Record a new leave for an employee</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Leave Details</CardTitle>
            <CardDescription>Fill in the information below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee *</Label>
                <Select value={employeeId} onValueChange={setEmployeeId} disabled={isPending}>
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Leave Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}
                      disabled={isPending}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="leaveType">Leave Type *</Label>
                <Select value={leaveType} onValueChange={setLeaveType} disabled={isPending}>
                  <SelectTrigger id="leaveType">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Day">Full Day</SelectItem>
                    <SelectItem value="Morning Half">Morning Half</SelectItem>
                    <SelectItem value="Evening Half">Evening Half</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Add Leave Entry
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
