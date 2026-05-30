import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Invoices from "../pages/Invoices";
import Customers from "../pages/Customers";
import Payments from "../pages/Payments";
import Settings from "../pages/Settings";
import CreateInvoice from "../pages/CreateInvoice";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/invoices"
            element={<Invoices />}
          />

          <Route
            path="/create-invoice"
            element={<CreateInvoice />}
          />

          <Route
            path="/customers"
            element={<Customers />}
          />

          <Route
            path="/payments"
            element={<Payments />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;