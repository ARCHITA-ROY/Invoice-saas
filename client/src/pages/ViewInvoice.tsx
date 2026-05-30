import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

type Item = {
  id?: string;
  description?: string;
  quantity?: number;
  price?: number;
  total?: number;
};

type Customer = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
};

type Invoice = {
  id: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  paymentStatus?: string;
  subtotal?: number;
  cgst?: number;
  sgst?: number;
  total?: number;
  customer?: Customer;
  items?: Item[];
};

const ViewInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:5000/api/invoices/${id}`
        );

        const data = await res.json();
        setInvoice(data || null);
      } catch (err) {
        console.error(err);
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  const num = (v?: number) => {
    const n = Number(v ?? 0);
    return isNaN(n) ? 0 : n;
  };

  if (loading) {
    return <div className="p-8 text-zinc-400">Loading invoice...</div>;
  }

  if (!invoice) {
    return <div className="p-8 text-red-400">Invoice not found</div>;
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">
            {invoice.invoiceNumber || "N/A"}
          </h1>

          <p className="text-zinc-400 mt-2">
            {invoice.invoiceDate
              ? new Date(invoice.invoiceDate).toLocaleDateString("en-IN")
              : "No date"}
          </p>

          <span
            className={`inline-block mt-3 px-3 py-1 rounded text-xs ${
              invoice.paymentStatus === "PAID"
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {invoice.paymentStatus || "PENDING"}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 px-4 py-2 rounded-xl"
          >
            Back
          </button>

          <button
            onClick={() =>
              window.open(
                `http://localhost:5000/api/pdf/invoice/${invoice.id}`,
                "_blank"
              )
            }
            className="bg-violet-500 px-6 py-2 rounded-xl"
          >
            PDF
          </button>
        </div>
      </div>

      {/* CUSTOMER */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
        <h2 className="font-semibold mb-3">Customer</h2>

        <div className="text-zinc-300 space-y-1">
          <p>{invoice.customer?.name || "Unknown"}</p>
          <p>{invoice.customer?.email || "No email"}</p>
          <p>{invoice.customer?.phone || "No phone"}</p>
          <p>{invoice.customer?.address || "No address"}</p>
        </div>
      </div>

      {/* ITEMS */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
        <h2 className="font-semibold mb-4">Items</h2>

        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-zinc-400">
              <tr>
                <th className="text-left p-3">Description</th>
                <th className="text-left p-3">Qty</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Total</th>
              </tr>
            </thead>

            <tbody>
              {(invoice.items ?? []).map((item: Item, i: number) => (
                <tr key={i} className="border-t border-white/10">
                  <td className="p-3">{item.description || "-"}</td>
                  <td className="p-3">{item.quantity || 0}</td>
                  <td className="p-3">₹{num(item.price)}</td>
                  <td className="p-3">₹{num(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOTALS */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-right space-y-2">
        <p>Subtotal: ₹{num(invoice.subtotal).toFixed(2)}</p>
        <p>CGST: ₹{num(invoice.cgst).toFixed(2)}</p>
        <p>SGST: ₹{num(invoice.sgst).toFixed(2)}</p>

        <p className="text-2xl font-bold text-violet-400">
          Total: ₹{num(invoice.total).toFixed(2)}
        </p>
      </div>

    </div>
  );
};

export default ViewInvoice;