import { format } from 'date-fns';
import type { LeaveEntry } from '../../backend';

export interface MonthlySummary {
  month: string;
  count: number;
}

export function groupLeavesByMonth(leaves: LeaveEntry[]): MonthlySummary[] {
  const monthMap = new Map<string, number>();

  leaves.forEach((leave) => {
    const date = new Date(Number(leave.date) / 1_000_000);
    const monthKey = format(date, 'MMMM yyyy');
    monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
  });

  return Array.from(monthMap.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateB.getTime() - dateA.getTime();
    });
}
