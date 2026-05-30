import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Invoice = {
  id: string;
  invoiceNumber: string;
  total: number;
  paymentStatus: string;
  createdAt: string;
  customerId: string;
};

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  gstNumber?: string;
};

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Customer | null>(null);

  const [loading, setLoading] = useState(true);

  // LOAD
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const res = await fetch(`http://localhost:5000/api/customers/${id}`);
      const data = await res.json();

      const customerData = data.customer || data;
      setCustomer(customerData);
      setForm(customerData);

      const invRes = await fetch("http://localhost:5000/api/invoices");
      const all: Invoice[] = await invRes.json();

      setInvoices(all.filter((i) => i.customerId === id));

      setLoading(false);
    };

    if (id) load();
  }, [id]);

  // ===== METRICS (Stripe style) =====
  const metrics = useMemo(() => {
    const total = invoices.reduce((s, i) => s + i.total, 0);

    const paid = invoices
      .filter((i) => i.paymentStatus === "PAID")
      .reduce((s, i) => s + i.total, 0);

    const pending = total - paid;

    return {
      total,
      paid,
      pending,
      invoiceCount: invoices.length,
      paidCount: invoices.filter((i) => i.paymentStatus === "PAID").length,
      pendingCount: invoices.filter((i) => i.paymentStatus !== "PAID").length,
    };
  }, [invoices]);

  // ===== CHART =====
  const chartData = useMemo(() => {
    const map: Record<string, number> = {};

    invoices.forEach((inv) => {
      const d = new Date(inv.createdAt);
      const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
      map[key] = (map[key] || 0) + inv.total;
    });

    return Object.entries(map).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  }, [invoices]);

  // ===== SAVE (Stripe-safe) =====
  const saveCustomer = async () => {
  if (!form || !id) return;

  try {
    const res = await fetch(`http://localhost:5000/api/customers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("SAVE FAILED:", data);
      return;
    }

    setCustomer(data.customer);
    setEditMode(false);
  } catch (err) {
    console.error("NETWORK ERROR:", err);
  }
};

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="text-zinc-400">Loading customer intelligence...</div>
    );
  }

  if (!customer) {
    return <div className="text-zinc-400">Customer not found</div>;
  }

  return (
    <div className="space-y-8">

      {/* ================= STRIPE HEADER ================= */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-semibold">{customer.name}</h1>

          <div className="flex gap-2 mt-3 text-xs text-zinc-400">
            <span>{customer.email}</span>
            <span>•</span>
            <span>{customer.phone}</span>
            <span>•</span>
            <span>{customer.gstNumber || "No GST"}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-600"
          >
            Edit
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* ================= STRIPE KPI ROW ================= */}
      <div className="grid grid-cols-4 gap-4">

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-xs text-zinc-400">Lifetime Value</p>
          <p className="text-xl font-semibold">
            ₹{metrics.total.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/20">
          <p className="text-xs text-zinc-400">Paid Revenue</p>
          <p className="text-xl font-semibold text-green-400">
            ₹{metrics.paid.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-xs text-zinc-400">Pending Revenue</p>
          <p className="text-xl font-semibold text-yellow-400">
            ₹{metrics.pending.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-xs text-zinc-400">Invoices</p>
          <p className="text-xl font-semibold">
            {metrics.invoiceCount}
          </p>
        </div>

      </div>

      {/* ================= STRIPE CHART ================= */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Revenue Intelligence</h2>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8b5cf6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= STRIPE OBJECT LIST ================= */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="font-semibold mb-4">
          Invoices ({metrics.invoiceCount})
        </h2>

        <div className="space-y-3">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="flex justify-between items-center p-4 rounded-xl bg-black/20 border border-white/10 hover:bg-white/5 transition"
            >
              <div>
                <p className="font-medium">{inv.invoiceNumber}</p>
                <p className="text-xs text-zinc-500">
                  {new Date(inv.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div className="text-right">
                <p>₹{inv.total}</p>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    inv.paymentStatus === "PAID"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {inv.paymentStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= STRIPE EDIT MODAL ================= */}
      {editMode && form && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="w-[420px] bg-zinc-900 border border-white/10 rounded-2xl p-6 space-y-3">

            <h2 className="text-lg font-semibold">
              Edit Customer
            </h2>

            <input
              className="w-full p-2 bg-black/30 rounded"
              value={form.name || ""}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="w-full p-2 bg-black/30 rounded"
              value={form.email || ""}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              className="w-full p-2 bg-black/30 rounded"
              value={form.phone || ""}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 p-2 bg-white/10 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveCustomer}
                className="flex-1 p-2 bg-violet-500 rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerDetail;