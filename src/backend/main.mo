import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type LeaveType = { #vacation; #sick; #special };

  type Employee = {
    id : Text;
    fullName : Text;
    jobTitle : Text;
  };

  type LeaveEntry = {
    employeeId : Text;
    date : Time.Time;
    leaveType : LeaveType;
  };

  public type UserProfile = {
    name : Text;
  };

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let employees = Map.empty<Text, Employee>();
  let leaveEntries = Map.empty<Text, List.List<LeaveEntry>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Employee Management (Admin-only)
  public shared ({ caller }) func addEmployee(employee : Employee) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    employees.add(employee.id, employee);
  };

  public shared ({ caller }) func updateEmployee(employee : Employee) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not employees.containsKey(employee.id)) {
      Runtime.trap("Employee does not exist");
    };
    employees.add(employee.id, employee);
  };

  public shared ({ caller }) func deleteEmployee(employeeId : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not employees.containsKey(employeeId)) {
      Runtime.trap("Employee does not exist");
    };
    employees.remove(employeeId);
    leaveEntries.remove(employeeId);
  };

  public query ({ caller }) func getEmployee(employeeId : Text) : async ?Employee {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    employees.get(employeeId);
  };

  public query ({ caller }) func getAllEmployees() : async [Employee] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    employees.values().toArray();
  };

  // Leave Management (Admin-only)
  public shared ({ caller }) func addLeave(leave : LeaveEntry) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (null == employees.get(leave.employeeId)) {
      Runtime.trap("Employee does not exist");
    };

    var leaves = switch (leaveEntries.get(leave.employeeId)) {
      case (?existing) { existing };
      case (null) { List.empty<LeaveEntry>() };
    };

    leaves.add(leave);
    leaveEntries.add(leave.employeeId, leaves);
  };

  public shared ({ caller }) func updateLeave(employeeId : Text, date : Time.Time, newLeave : LeaveEntry) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (leaveEntries.get(employeeId)) {
      case (?leaves) {
        let leavesArray = leaves.toArray();
        let index = leavesArray.findIndex(func(l) { l.date == date });

        switch (index) {
          case (?i) {
            let updatedLeaves = leavesArray.map(func(leave) { 
              if (leave.date == date) { newLeave } else { leave } 
            });
            leaveEntries.add(employeeId, List.fromArray<LeaveEntry>(updatedLeaves));
          };
          case (null) { Runtime.trap("Leave entry does not exist") };
        };
      };
      case (null) { Runtime.trap("No leave records found for this employee") };
    };
  };

  public shared ({ caller }) func deleteLeave(employeeId : Text, date : Time.Time) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (leaveEntries.get(employeeId)) {
      case (?leaves) {
        let filteredLeaves = leaves.toArray().filter(func(leave) { leave.date != date });
        leaveEntries.add(employeeId, List.fromArray<LeaveEntry>(filteredLeaves));
      };
      case (null) { Runtime.trap("No leave records found for this employee") };
    };
  };

  public query ({ caller }) func searchLeavesByRange(employeeId : Text, from : Time.Time, to : Time.Time) : async [LeaveEntry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (leaveEntries.get(employeeId)) {
      case (?leaves) {
        leaves.toArray().filter<LeaveEntry>(func(leave) { leave.date >= from and leave.date <= to });
      };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getEmployeeLeaves(employeeId : Text) : async [LeaveEntry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (leaveEntries.get(employeeId)) {
      case (?leaves) { leaves.toArray() };
      case (null) { [] };
    };
  };
};
