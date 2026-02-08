import { format } from 'date-fns';
import type { LeaveEntry, Employee } from '../../backend';
import { getLeaveTypeLabel } from '../mappers/leaveType';

export function exportToCSV(leaves: LeaveEntry[], employees: Employee[], filename: string) {
  const headers = ['Employee Name', 'Date', 'Leave Type'];
  
  const rows = leaves.map((leave) => {
    const employee = employees.find((e) => e.id === leave.employeeId);
    const date = new Date(Number(leave.date) / 1_000_000);
    
    return [
      employee?.fullName || 'Unknown',
      format(date, 'yyyy-MM-dd'),
      getLeaveTypeLabel(leave.leaveType),
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
