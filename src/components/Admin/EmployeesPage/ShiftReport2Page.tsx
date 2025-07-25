import "./styles/ShiftReport2.css";
import { Employee } from "../../../models/Employees";
import { useShiftDetailData } from "../../../hooks/useShiftDetaildata";
import ShiftReportBackButton from "./Reportbackbutton";
import ShiftReportEmployeeInfo from "./ReportEmployeeInfo";
import ShiftReportDetailCard from "./Reportdetailcard";

interface ShiftReport2PageProps {
  employee: Employee;
  onBackClick: () => void;
}

export default function ShiftReport2Page({ employee, onBackClick }: ShiftReport2PageProps) {
  const { shifts, loading, error } = useShiftDetailData(employee);

  const employeeShift = shifts.length > 0 ? shifts[0] : null;

  return (
    <div className="shift-report-container">
      <ShiftReportBackButton onBackClick={onBackClick} />

      <div className="report-header">
        <h1>Shift Report</h1>
      </div>

      <div className="container">
        {employeeShift && <ShiftReportEmployeeInfo shift={employeeShift} employee={employee} />}
        {loading && <div className="loading-message">Loading shift data...</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="shifts-container">
          {!loading && !error && shifts.length > 0 ? (
            shifts.map((shift, index) => (
              <ShiftReportDetailCard key={index} shift={shift} />
            ))
          ) : (
            !loading && !error && (
              <div className="no-shifts">
                <div>No shift data available for this employee</div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}