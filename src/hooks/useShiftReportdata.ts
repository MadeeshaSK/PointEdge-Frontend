import { useState, useEffect, useCallback } from "react";
import { Employee } from "../models/Employees";
import { 
  getEmployees, 
  searchEmployees, 
  getAllEmployeesShiftReport,
  getAllEmployeesShiftReportByDateRange 
} from "../services/employeeService";

export const useShiftReportData = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetailedReport, setShowDetailedReport] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalShifts, setTotalShifts] = useState<number>(0);
  const [totalHours, setTotalHours] = useState<string>("0h");
  const [workingDays, setWorkingDays] = useState<number>(0);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);


  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getEmployees();
      
      const transformedEmployees = response.map((emp: any, index: number) => ({
        id: emp.id,
        name: emp.name,
        role: emp.role || "Unknown",
        avatar: emp.avatar || "",
        status: emp.status || "Active",
        isFirstRow: index === 0
      }));
      
      setEmployees(transformedEmployees);
      setError(null);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employee data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchShiftStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const startDate = firstDay.toISOString().split('T')[0];
      const endDate = now.toISOString().split('T')[0];
      
      const shiftReports = await getAllEmployeesShiftReportByDateRange(startDate, endDate);
      
      setTotalShifts(shiftReports.length);
      
      let totalMinutes = 0;
      shiftReports.forEach((shift: any) => {
        if (shift.workingHours) {
          const timeParts = shift.workingHours.split(':');
          if (timeParts.length >= 2) {
            totalMinutes += parseInt(timeParts[0]) * 60;
            totalMinutes += parseInt(timeParts[1]);
          }
        }
      });
      
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      setTotalHours(minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`);
      
      const uniqueDates = new Set(
        shiftReports.map((shift: any) => shift.shiftDate?.split('T')[0])
          .filter((date: string | undefined) => date)
      );
      setWorkingDays(uniqueDates.size);
    } catch (err) {
      console.error("Error fetching shift stats:", err);
      setTotalShifts(0);
      setTotalHours("0h");
      setWorkingDays(0);
    } finally {
      setStatsLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchEmployees();
    fetchShiftStats();
  }, [fetchEmployees, fetchShiftStats]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      fetchEmployees();
      return;
    }

    try {
      setLoading(true);
      const response = await searchEmployees(searchQuery);
      
      const transformedEmployees = response.map((emp: any, index: number) => ({
        id: emp.id,
        name: emp.name,
        role: emp.role || "Unknown",
        avatar: emp.avatar || "",
        status: emp.status || "Active",
        isFirstRow: index === 0
      }));
      
      setEmployees(transformedEmployees);
      setError(null);
    } catch (err) {
      console.error("Error searching employees:", err);
      setError("Failed to search employees. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, fetchEmployees]);

  const handleViewClick = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDetailedReport(true);
  }, []);

  const handleBackClick = useCallback(() => {
    setShowDetailedReport(false);
    setSelectedEmployee(null);
  }, []);

  return {
    employees,
    loading,
    error,
    selectedEmployee,
    showDetailedReport,
    searchQuery,
    setSearchQuery,
    totalShifts,
    totalHours,
    workingDays,
    statsLoading,
    handleSearch,
    handleViewClick,
    handleBackClick
  };
};