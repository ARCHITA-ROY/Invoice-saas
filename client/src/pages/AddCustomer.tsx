import { useState } from "react";
import { useNavigate } from "react-router-dom";

type CustomerPayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
};

const AddCustomer = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<CustomerPayload>({
    name: "",
    email: "",
    phone: "",
    address: "",
    gstNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await fetch("http://localhost:5000/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    navigate("/customers");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold">Add Customer</h1>
        <p className="text-zinc-400 mt-2">
          Create a new business client
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">

        <input
          name="name"
          placeholder="Customer Name"
          value={form.name}
          onChange={handleChange}
          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3"
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3"
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3"
        />

        <input
          name="gstNumber"
          placeholder="GST Number"
          value={form.gstNumber}
          onChange={handleChange}
          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3"
        />

        <button
          onClick={handleSubmit}
          className="bg-violet-500 hover:bg-violet-600 px-5 py-3 rounded-xl font-medium"
        >
          Save Customer
        </button>

      </div>
    </div>
  );
};

export default AddCustomer;