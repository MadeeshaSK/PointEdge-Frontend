import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AnalysisPage from "./pages/Admin/AnalysisPage";
import { DiscountsPage } from "./pages/Admin/DiscountsPage";
import EmployeesPage from "./pages/Admin/EmployeesPage";
import InventoryPage from "./pages/Admin/InventoryPage";
import ErrorPage from "./pages/ErrorPage";
import SalesDashboard from "./pages/SalesDashboard";

const router = createBrowserRouter([
  {
    index: true,
    element: <SalesDashboard />,
    errorElement: <ErrorPage />,
  },
  {
    path: "admin",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "analysis", element: <AnalysisPage /> },
      { path: "inventory", element: <InventoryPage /> },
      {
        path: "discounts",
        children: [
          { index: true, element: <DiscountsPage /> },
          {
            path: "customers",
            element: <DiscountsPage />,
            handle: {
              showCustomerModal: true 
            }
          }
        ],
      },
      { path: "employees", element: <EmployeesPage /> },
    ],
  },
]);

export default router;