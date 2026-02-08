import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useAddEmployee } from '../../hooks/useQueries';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../ui/sonner';

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddEmployeeDialog({ open, onOpenChange }: AddEmployeeDialogProps) {
  const { mutate: addEmployee, isPending } = useAddEmployee();
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Employee name is required');
      return;
    }

    const employee = {
      id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fullName: fullName.trim(),
      jobTitle: jobTitle.trim(),
    };

    addEmployee(employee, {
      onSuccess: () => {
        toast.success('Employee added successfully');
        setFullName('');
        setJobTitle('');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to add employee');
      },
    });
  };

  return (
    <>
      <Toaster />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Enter the employee details below.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">
                  Employee Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  disabled={isPending}
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="jobTitle">Department/Section</Label>
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Sales, Warehouse (optional)"
                  disabled={isPending}
                />
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
                    Adding...
                  </>
                ) : (
                  'Add Employee'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
