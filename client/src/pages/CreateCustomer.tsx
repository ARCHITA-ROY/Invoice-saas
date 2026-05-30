import { useState } from "react";
import { useNavigate } from "react-router-dom";

type CustomerPayload = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  gstNumber?: string;
};

const CreateCustomer = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<CustomerPayload>({
    name: "",
    email: "",
    phone: "",
    address: "",
    gstNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to create customer");
      }

      navigate("/customers");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-semibold">Create Customer</h1>
        <p className="text-zinc-400 mt-2">Add a new business client</p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white/5 border border-white/10 p-6 rounded-2xl"
      >
        <input
          name="name"
          placeholder="Customer Name *"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white"
          required
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white"
        />

        <input
          name="gstNumber"
          placeholder="GST Number"
          value={form.gstNumber}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white"
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white"
        />

        {/* ERROR */}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* ACTIONS */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="flex-1 p-3 rounded-xl bg-white/10 hover:bg-white/15"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 p-3 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Customer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomer;