import { useState } from 'react';
import { format } from 'date-fns';
import type { LeaveEntry, Employee } from '../../backend';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import EditLeaveDialog from './EditLeaveDialog';
import ConfirmDialog from '../common/ConfirmDialog';
import { useDeleteLeave } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { Toaster } from '../ui/sonner';
import { getLeaveTypeLabel } from '../../lib/mappers/leaveType';

interface LeaveResultsListProps {
  leaves: LeaveEntry[];
  employees: Employee[];
}

export default function LeaveResultsList({ leaves, employees }: LeaveResultsListProps) {
  const [editingLeave, setEditingLeave] = useState<LeaveEntry | null>(null);
  const [deletingLeave, setDeletingLeave] = useState<LeaveEntry | null>(null);
  const { mutate: deleteLeave, isPending: isDeleting } = useDeleteLeave();

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    return employee?.fullName || 'Unknown';
  };

  const handleDelete = () => {
    if (!deletingLeave) return;

    deleteLeave(
      { employeeId: deletingLeave.employeeId, date: deletingLeave.date },
      {
        onSuccess: () => {
          toast.success('Leave entry deleted successfully');
          setDeletingLeave(null);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to delete leave entry');
        },
      }
    );
  };

  if (leaves.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No leave records found
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="space-y-2">
        {leaves.map((leave, index) => {
          const leaveDate = new Date(Number(leave.date) / 1_000_000);
          return (
            <div key={index} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex-1 space-y-1">
                <p className="font-medium">{getEmployeeName(leave.employeeId)}</p>
                <p className="text-sm text-muted-foreground">{format(leaveDate, 'PPP')}</p>
                <Badge variant="outline" className="text-xs">
                  {getLeaveTypeLabel(leave.leaveType)}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditingLeave(leave)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeletingLeave(leave)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>

      {editingLeave && (
        <EditLeaveDialog
          leave={editingLeave}
          employees={employees}
          open={!!editingLeave}
          onOpenChange={(open) => !open && setEditingLeave(null)}
        />
      )}

      <ConfirmDialog
        open={!!deletingLeave}
        onOpenChange={(open) => !open && setDeletingLeave(null)}
        onConfirm={handleDelete}
        title="Delete Leave Entry"
        description="Are you sure you want to delete this leave entry? This action cannot be undone."
        isLoading={isDeleting}
      />
    </>
  );
}
