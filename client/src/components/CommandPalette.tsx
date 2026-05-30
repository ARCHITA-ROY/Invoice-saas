import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Result = {
  id: string;
  type: "invoice" | "customer";
  label: string;
};

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [active, setActive] = useState(0);

  const nav = useNavigate();

  // CTRL + K
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(v => !v);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // SEARCH API
  const search = async (value: string) => {
    setQ(value);

    if (!value) {
      setResults([]);
      return;
    }

    const res = await fetch(`http://localhost:5000/api/search?q=${value}`);
    const data = await res.json();

    setResults(data || []);
    setActive(0);
  };

  const go = (item: Result) => {
    setOpen(false);
    setQ("");
    setResults([]);

    if (item.type === "invoice") {
      nav(`/invoice/${item.id}`);
    } else {
      nav(`/customers/${item.id}`);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(i => (i + 1) % results.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(i => (i - 1 + results.length) % results.length);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-start justify-center pt-24 z-50">

      <div className="w-[520px] bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

        {/* INPUT */}
        <input
          autoFocus
          value={q}
          onChange={(e) => search(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Search invoices, customers, invoice #..."
          className="w-full px-4 py-4 bg-black/40 text-white outline-none placeholder:text-zinc-500"
        />

        {/* RESULTS */}
        <div className="max-h-[300px] overflow-y-auto">

          {results.length === 0 && q && (
            <div className="p-4 text-sm text-zinc-500">
              No results found
            </div>
          )}

          {results.map((r, i) => (
            <div
              key={r.id}
              onClick={() => go(r)}
              className={`px-4 py-3 cursor-pointer flex justify-between transition ${
                i === active ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {r.label}
                </p>
                <p className="text-xs text-zinc-500">
                  {r.type}
                </p>
              </div>

              <span className="text-xs text-zinc-500">↵</span>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="px-4 py-2 border-t border-white/10 text-xs text-zinc-500 flex justify-between">
          <span>↑ ↓ navigate</span>
          <span>Enter select</span>
          <span>Esc close</span>
        </div>

      </div>
    </div>
  );
};

export default CommandPalette;