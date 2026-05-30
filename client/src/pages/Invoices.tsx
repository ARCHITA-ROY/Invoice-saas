import { useEffect, useState } from "react";
import { Search, Plus, Eye, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getInvoices } from "../api/invoice.api";

type Invoice = {
  id: string;
  invoiceNumber: string;
  total: number;
  createdAt: string;
  paymentStatus: string;
  customer?: {
    name: string;
  };
};

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getInvoices();
        setInvoices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load invoices", err);
      }
    };

    load();
  }, []);

  const viewInvoice = (id: string) => {
    navigate(`/invoice/${id}`);
  };

  const downloadPDF = (id: string) => {
    window.open(
      `http://localhost:5000/api/pdf/invoice/${id}`,
      "_blank"
    );
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const q = search.toLowerCase();

    return (
      invoice.invoiceNumber?.toLowerCase().includes(q) ||
      invoice.customer?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold tracking-tight">
            Invoices
          </h1>
          <p className="text-zinc-400 mt-3 text-lg">
            Manage and track all billing invoices
          </p>
        </div>

        <button
          onClick={() => navigate("/create-invoice")}
          className="bg-violet-500 hover:bg-violet-600 px-6 py-3 rounded-2xl font-semibold flex items-center gap-2"
        >
          <Plus size={20} />
          Create Invoice
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] p-6">
        <div className="relative">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500"
            size={20}
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice..."
            className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white outline-none"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-white/10">
              <th className="pb-5">Invoice No</th>
              <th className="pb-5">Customer</th>
              <th className="pb-5">Amount</th>
              <th className="pb-5">Date</th>
              <th className="pb-5">Status</th>
              <th className="pb-5">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-white/5">
                <td className="py-6">{invoice.invoiceNumber}</td>

                <td className="py-6">
                  {invoice.customer?.name || "Unknown Customer"}
                </td>

                <td className="py-6">
                  ₹{Number(invoice.total || 0).toFixed(2)}
                </td>

                <td className="py-6">
                  {new Date(invoice.createdAt).toLocaleDateString("en-IN")}
                </td>

                <td className="py-6">
                  <span
                    className={`px-4 py-2 rounded-xl text-sm ${
                      invoice.paymentStatus === "PAID"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {invoice.paymentStatus}
                  </span>
                </td>

                <td className="py-6">
                  <div className="flex gap-3">
                    <button
                      onClick={() => viewInvoice(invoice.id)}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => downloadPDF(invoice.id)}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-10 text-zinc-500">
            No invoices found
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;