import { useEffect, useMemo, useState } from "react";

type Invoice = {
  id: string;
  invoiceNumber: string;
  total: number;
  paymentStatus: string;
  createdAt: string;
};

const SkeletonCard = () => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
    <div className="h-3 w-24 bg-white/10 rounded mb-4" />
    <div className="h-8 w-32 bg-white/10 rounded" />
  </div>
);

const Dashboard = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/invoices");
        const data = await res.json();
        setInvoices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const metrics = useMemo(() => {
    const revenue = invoices.reduce(
      (a, b) => a + Number(b.total || 0),
      0
    );

    const paid = invoices.filter(
      (i) => i.paymentStatus === "PAID"
    ).length;

    const pending = invoices.length - paid;

    return { revenue, paid, pending };
  }, [invoices]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-1/3 bg-white/10 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">

      <div className="space-y-1">
        <h1 className="text-4xl font-semibold tracking-tight">
          Stripe-style Dashboard
        </h1>
        <p className="text-zinc-400">
          Real-time billing intelligence overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
          <p className="text-zinc-400 text-sm">Revenue</p>
          <p className="text-3xl font-semibold mt-2">
            ₹{metrics.revenue.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
          <p className="text-zinc-400 text-sm">Paid Invoices</p>
          <p className="text-3xl font-semibold mt-2 text-green-400">
            {metrics.paid}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
          <p className="text-zinc-400 text-sm">Pending</p>
          <p className="text-3xl font-semibold mt-2 text-yellow-400">
            {metrics.pending}
          </p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <span className="text-xs text-zinc-500">Live feed</span>
        </div>

        <div className="space-y-2">

          {invoices.length === 0 ? (
            <p className="text-zinc-500 text-sm">No invoices found</p>
          ) : (
            invoices.slice(0, 6).map((inv) => (
              <div
                key={inv.id}
                className="flex justify-between items-center py-3 border-b border-white/10 hover:bg-white/5 px-2 rounded-lg transition"
              >
                <div>
                  <p className="font-medium">
                    {inv.invoiceNumber}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(inv.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium">
                    ₹{Number(inv.total).toLocaleString("en-IN")}
                  </p>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      inv.paymentStatus === "PAID"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {inv.paymentStatus}
                  </span>
                </div>
              </div>
            ))
          )}

        </div>
      </div>

    </div>
  );
};

export default Dashboard;