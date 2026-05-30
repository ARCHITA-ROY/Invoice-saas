import { useEffect, useState } from "react";

type Customer = {
  id: string;
  name: string;
  email?: string;
};

type Item = {
  description: string;
  quantity: number;
  price: number;
  gst: number;
};

const CreateInvoice = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");

  const [items, setItems] = useState<Item[]>([
    { description: "", quantity: 1, price: 0, gst: 18 },
  ]);

  const [loading, setLoading] = useState(false);

  // LOAD CUSTOMERS
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/customers");
        const data = await res.json();
        setCustomers(data.customers || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadCustomers();
  }, []);

  const updateItem = (
    index: number,
    key: keyof Item,
    value: string | number
  ) => {
    const updated = [...items];

    updated[index] = {
      ...updated[index],
      [key]:
        key === "description" ? value : Number(value),
    };

    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { description: "", quantity: 1, price: 0, gst: 18 },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0
  );

  const cgst = (subtotal * 9) / 100;
  const sgst = (subtotal * 9) / 100;
  const total = subtotal + cgst + sgst;

  const saveInvoice = async () => {
    if (!customerId) {
      alert("Select a customer first");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          items,
          cgst: 9,
          sgst: 9,
          paymentStatus: "PENDING",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        return;
      }

      alert("Invoice Created Successfully");
      setItems([{ description: "", quantity: 1, price: 0, gst: 18 }]);
      setCustomerId("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      <h1 className="text-4xl font-semibold">
        Create Invoice
      </h1>

      {/* CUSTOMER SELECT (PREMIUM DROPDOWN) */}
      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
        <label className="text-sm text-zinc-400">
          Select Customer
        </label>

        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full mt-2 bg-black/40 text-white border border-white/10 rounded-xl p-3 outline-none focus:border-violet-500 transition"
        >
          <option value="" className="text-zinc-500">
            -- Choose Customer --
          </option>

          {customers.map((c) => (
            <option
              key={c.id}
              value={c.id}
              className="bg-black text-white"
            >
              {c.name} {c.email ? `(${c.email})` : ""}
            </option>
          ))}
        </select>

        {customerId && (
          <p className="text-xs text-green-400 mt-2">
            ✓ Customer selected
          </p>
        )}
      </div>

      {/* ITEMS */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-3">

            <input
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                updateItem(index, "description", e.target.value)
              }
              className="bg-black/20 p-2 rounded"
            />

            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                updateItem(index, "quantity", e.target.value)
              }
              className="bg-black/20 p-2 rounded"
            />

            <input
              type="number"
              value={item.price}
              onChange={(e) =>
                updateItem(index, "price", e.target.value)
              }
              className="bg-black/20 p-2 rounded"
            />

            <button
              onClick={() => removeItem(index)}
              className="text-red-400"
            >
              Remove
            </button>

          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="text-violet-400"
      >
        + Add Item
      </button>

      {/* SUMMARY */}
      <div className="bg-white/5 p-4 rounded-xl space-y-2">
        <p>Subtotal: ₹{subtotal}</p>
        <p>CGST: ₹{cgst}</p>
        <p>SGST: ₹{sgst}</p>
        <p className="font-bold">Total: ₹{total}</p>
      </div>

      {/* SAVE */}
      <button
        onClick={saveInvoice}
        disabled={loading}
        className={`px-6 py-3 rounded-xl font-medium transition ${
          customerId
            ? "bg-violet-500 hover:bg-violet-600"
            : "bg-white/10 cursor-not-allowed"
        }`}
      >
        {loading ? "Saving..." : "Save Invoice"}
      </button>

    </div>
  );
};

export default CreateInvoice;