import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useUpdateLeave } from '../../hooks/useQueries';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import type { LeaveEntry, Employee } from '../../backend';
import { getLeaveTypeLabel, getLeaveTypeFromLabel } from '../../lib/mappers/leaveType';

interface EditLeaveDialogProps {
  leave: LeaveEntry;
  employees: Employee[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditLeaveDialog({ leave, employees, open, onOpenChange }: EditLeaveDialogProps) {
  const { mutate: updateLeave, isPending } = useUpdateLeave();
  const [date, setDate] = useState<Date>();
  const [leaveType, setLeaveType] = useState('');

  useEffect(() => {
    if (leave) {
      setDate(new Date(Number(leave.date) / 1_000_000));
      setLeaveType(getLeaveTypeLabel(leave.leaveType));
    }
  }, [leave]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !leaveType) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newLeave: LeaveEntry = {
      employeeId: leave.employeeId,
      date: BigInt(date.getTime() * 1_000_000),
      leaveType: getLeaveTypeFromLabel(leaveType),
    };

    updateLeave(
      {
        employeeId: leave.employeeId,
        date: leave.date,
        newLeave,
      },
      {
        onSuccess: () => {
          toast.success('Leave entry updated successfully');
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update leave entry');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Leave Entry</DialogTitle>
            <DialogDescription>Update the leave details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
              <Label htmlFor="editLeaveType">Leave Type *</Label>
              <Select value={leaveType} onValueChange={setLeaveType} disabled={isPending}>
                <SelectTrigger id="editLeaveType">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full Day">Full Day</SelectItem>
                  <SelectItem value="Morning Half">Morning Half</SelectItem>
                  <SelectItem value="Evening Half">Evening Half</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
