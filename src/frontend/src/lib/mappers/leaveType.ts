import { LeaveType } from '../../backend';

const leaveTypeMap: Record<string, LeaveType> = {
  'Full Day': LeaveType.vacation,
  'Morning Half': LeaveType.sick,
  'Evening Half': LeaveType.special,
};

const leaveTypeLabelMap: Record<LeaveType, string> = {
  [LeaveType.vacation]: 'Full Day',
  [LeaveType.sick]: 'Morning Half',
  [LeaveType.special]: 'Evening Half',
};

export function getLeaveTypeLabel(leaveType: LeaveType): string {
  return leaveTypeLabelMap[leaveType] || 'Unknown';
}

export function getLeaveTypeFromLabel(label: string): LeaveType {
  return leaveTypeMap[label] || LeaveType.vacation;
}
