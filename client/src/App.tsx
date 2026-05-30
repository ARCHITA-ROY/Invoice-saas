import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import ViewInvoice from "./pages/ViewInvoice";
import CreateInvoice from "./pages/CreateInvoice";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/:id" element={<ViewInvoice />} />
          <Route path="create-invoice" element={<CreateInvoice />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}