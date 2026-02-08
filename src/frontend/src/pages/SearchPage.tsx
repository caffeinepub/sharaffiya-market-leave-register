import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { useGetAllEmployees, useGetEmployeeLeaves } from '../hooks/useQueries';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Search, Download, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import LeaveResultsList from '../components/leaves/LeaveResultsList';
import { exportToCSV } from '../lib/export/csv';
import type { LeaveEntry } from '../backend';

export default function SearchPage() {
  const { data: employees = [] } = useGetAllEmployees();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [searchTriggered, setSearchTriggered] = useState(false);

  const { data: leaves = [], isLoading } = useGetEmployeeLeaves(selectedEmployeeId);

  const handleSearch = () => {
    setSearchTriggered(true);
  };

  const filteredLeaves = searchTriggered
    ? leaves.filter((leave) => {
        const leaveDate = new Date(Number(leave.date) / 1_000_000);
        if (fromDate && leaveDate < fromDate) return false;
        if (toDate && leaveDate > toDate) return false;
        return true;
      })
    : [];

  const handleExport = () => {
    if (filteredLeaves.length === 0) return;

    const employee = employees.find((e) => e.id === selectedEmployeeId);
    exportToCSV(filteredLeaves, employees, `leave-records-${employee?.fullName || 'all'}.csv`);
  };

  return (
    <div className="container max-w-2xl space-y-6 px-4 py-6">
      <div>
        <h2 className="text-2xl font-bold">Search Leave Records</h2>
        <p className="text-sm text-muted-foreground">Filter and view leave entries</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Filters</CardTitle>
          <CardDescription>Select criteria to search leave records</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="searchEmployee">Employee</Label>
            <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
              <SelectTrigger id="searchEmployee">
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !fromDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, 'PP') : 'Pick date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !toDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, 'PP') : 'Pick date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button onClick={handleSearch} className="w-full" disabled={!selectedEmployeeId}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </CardContent>
      </Card>

      {searchTriggered && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>{filteredLeaves.length} records found</CardDescription>
              </div>
              {filteredLeaves.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <LeaveResultsList leaves={filteredLeaves} employees={employees} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
