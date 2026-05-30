import { useState } from "react";

const Settings = () => {
  const [companyName, setCompanyName] =
    useState(
      localStorage.getItem("companyName") ||
        "My Business"
    );

  const [email, setEmail] = useState(
    localStorage.getItem("companyEmail") ||
      ""
  );

  const [phone, setPhone] = useState(
    localStorage.getItem("companyPhone") ||
      ""
  );

  const [gst, setGst] = useState(
    localStorage.getItem("companyGST") || ""
  );

  const saveSettings = () => {
    localStorage.setItem(
      "companyName",
      companyName
    );

    localStorage.setItem(
      "companyEmail",
      email
    );

    localStorage.setItem(
      "companyPhone",
      phone
    );

    localStorage.setItem(
      "companyGST",
      gst
    );

    alert("Settings Saved");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold">
          Settings
        </h1>

        <p className="text-zinc-400 mt-2">
          Business configuration
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
        <div>
          <label className="text-sm text-zinc-400">
            Company Name
          </label>

          <input
            value={companyName}
            onChange={(e) =>
              setCompanyName(e.target.value)
            }
            className="w-full mt-2 p-3 rounded-xl bg-black/20 border border-white/10"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400">
            Business Email
          </label>

          <input
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full mt-2 p-3 rounded-xl bg-black/20 border border-white/10"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400">
            Phone Number
          </label>

          <input
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            className="w-full mt-2 p-3 rounded-xl bg-black/20 border border-white/10"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400">
            GST Number
          </label>

          <input
            value={gst}
            onChange={(e) =>
              setGst(e.target.value)
            }
            className="w-full mt-2 p-3 rounded-xl bg-black/20 border border-white/10"
          />
        </div>

        <button
          onClick={saveSettings}
          className="bg-violet-500 hover:bg-violet-600 px-6 py-3 rounded-xl"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;