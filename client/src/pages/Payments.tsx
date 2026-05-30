import { useEffect, useState } from "react";

type Invoice = {
  id: string;
  invoiceNumber: string;
  total: number;
  paymentStatus: string;
  customer?: {
    name: string;
  };
};

const Payments = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/invoices"
        );

        const data = await res.json();

        setInvoices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load payments", err);
      }
    };

    loadInvoices();
  }, []);

  const markAsPaid = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/invoices/${id}/pay`,
        {
          method: "PATCH",
        }
      );

      if (!res.ok) return;

      // refresh after update
      const updated = await fetch(
        "http://localhost:5000/api/invoices"
      );
      const data = await updated.json();

      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to mark paid", err);
    }
  };

  const pending = invoices.filter((i) => i.paymentStatus !== "PAID");
  const paid = invoices.filter((i) => i.paymentStatus === "PAID");

  return (
    <div className="space-y-8">
      <h1 className="text-5xl font-bold">Payments</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          Total: {invoices.length}
        </div>

        <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
          Pending: {pending.length}
        </div>

        <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
          Paid: {paid.length}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-white/10">
              <th className="py-4">Invoice</th>
              <th className="py-4">Customer</th>
              <th className="py-4">Amount</th>
              <th className="py-4">Status</th>
              <th className="py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-white/5">
                <td className="py-4">{inv.invoiceNumber}</td>

                <td className="py-4">
                  {inv.customer?.name || "Unknown"}
                </td>

                <td className="py-4">
                  ₹{Number(inv.total || 0).toLocaleString("en-IN")}
                </td>

                <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${
                      inv.paymentStatus === "PAID"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {inv.paymentStatus}
                  </span>
                </td>

                <td className="py-4">
                  {inv.paymentStatus !== "PAID" && (
                    <button
                      onClick={() => markAsPaid(inv.id)}
                      className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400"
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {invoices.length === 0 && (
          <div className="text-center py-10 text-zinc-500">
            No invoices found
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;