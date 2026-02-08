import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Employee {
    id: string;
    fullName: string;
    jobTitle: string;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export interface LeaveEntry {
    date: Time;
    employeeId: string;
    leaveType: LeaveType;
}
export enum LeaveType {
    sick = "sick",
    vacation = "vacation",
    special = "special"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEmployee(employee: Employee): Promise<void>;
    addLeave(leave: LeaveEntry): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteEmployee(employeeId: string): Promise<void>;
    deleteLeave(employeeId: string, date: Time): Promise<void>;
    getAllEmployees(): Promise<Array<Employee>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEmployee(employeeId: string): Promise<Employee | null>;
    getEmployeeLeaves(employeeId: string): Promise<Array<LeaveEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchLeavesByRange(employeeId: string, from: Time, to: Time): Promise<Array<LeaveEntry>>;
    updateEmployee(employee: Employee): Promise<void>;
    updateLeave(employeeId: string, date: Time, newLeave: LeaveEntry): Promise<void>;
}
