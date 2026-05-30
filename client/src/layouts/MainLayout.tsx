import { Outlet, Link } from "react-router-dom";
import CommandPalette from "../components/CommandPalette";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* SIDEBAR */}
      <div className="w-64 border-r border-white/10 p-4 hidden md:block">
        <h1 className="text-xl font-bold mb-6">Invoice SaaS</h1>

        <nav className="space-y-3 text-sm text-zinc-300">
          <Link className="block hover:text-white" to="/">Dashboard</Link>
          <Link className="block hover:text-white" to="/customers">Customers</Link>
          <Link className="block hover:text-white" to="/invoices">Invoices</Link>
          <Link className="block hover:text-white" to="/create-invoice">Create Invoice</Link>
          <Link className="block hover:text-white" to="/payments">Payments</Link>
          <Link className="block hover:text-white" to="/settings">Settings</Link>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <Outlet />
      </main>

      <CommandPalette />
    </div>
  );
};

export default MainLayout;