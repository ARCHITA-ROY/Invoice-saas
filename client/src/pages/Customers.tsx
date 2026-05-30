import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/UI/EmptyState";

type Customer = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  gstNumber?: string | null;
  createdAt: string;
};

type ApiResponse = {
  success: boolean;
  customers: Customer[];
};

const Customers = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "recent">("all");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/customers");
        const data: ApiResponse = await res.json();

        setCustomers(data.customers || []);
      } catch (err) {
        console.error("Failed to load customers", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredCustomers = useMemo(() => {
    let list = [...customers];

    if (search) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
          (c.phone || "").includes(search)
      );
    }

    if (filter === "recent") {
      list = list
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 5);
    }

    return list;
  }, [customers, search, filter]);

  const totalCustomers = customers.length;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">
            Customers
          </h1>
          <p className="text-zinc-400 mt-2">
            Manage your business clients
          </p>
        </div>

        <button
          onClick={() => navigate("/customers/new")}
          className="bg-violet-500 hover:bg-violet-600 px-5 py-3 rounded-xl font-medium"
        >
          + Add Customer
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-zinc-400 text-sm">Total Customers</p>
          <p className="text-3xl font-semibold mt-2">
            {totalCustomers}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-zinc-400 text-sm">Active</p>
          <p className="text-3xl font-semibold mt-2">
            {totalCustomers}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-zinc-400 text-sm">System</p>
          <p className="text-3xl font-semibold mt-2 text-green-400">
            OK
          </p>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white"
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "all" | "recent")
          }
          className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white"
        >
          <option value="all">All</option>
          <option value="recent">Recently Added</option>
        </select>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-zinc-500">Loading customers...</div>
      ) : filteredCustomers.length === 0 ? (
        <EmptyState
          title="No customers found"
          description="Add your first customer to start invoicing"
        />
      ) : (
        <div className="grid gap-4">
          {filteredCustomers.map((c) => (
            <div
              key={c.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between"
            >
              <div>
                <p className="text-lg font-semibold">{c.name}</p>
                <p className="text-sm text-zinc-400">
                  {c.email || "No email"}
                </p>
                <p className="text-sm text-zinc-500 mt-1">
                  {c.phone || "No phone"}
                </p>
                <p className="text-xs text-zinc-600 mt-2">
                  {c.gstNumber || "No GST"} • {c.address || "No address"}
                </p>
              </div>

              <div className="flex gap-2 items-start">
  
  {/* VIEW */}
  <button
    onClick={() => navigate(`/customers/${c.id}`)}
    className="px-3 py-2 text-xs rounded-lg bg-white/5 hover:bg-white/10"
  >
    View
  </button>

  {/* INVOICE */}
  <button
    onClick={() => navigate(`/invoices/new?customerId=${c.id}`)}
    className="px-3 py-2 text-xs rounded-lg bg-violet-500/20 text-violet-300"
  >
    Invoice
  </button>

  {/* DELETE */}
  <button
    onClick={async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/customers/${c.id}`,
          {
            method: "DELETE",
          }
        );

        if (!res.ok) {
          console.error("Delete failed");
          return;
        }

        setCustomers((prev) =>
          prev.filter((cust) => cust.id !== c.id)
        );
      } catch (err) {
        console.error("Delete error", err);
      }
    }}
    className="px-3 py-2 text-xs rounded-lg bg-red-500/10 text-red-400"
  >
    Delete
  </button>

</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Customers;