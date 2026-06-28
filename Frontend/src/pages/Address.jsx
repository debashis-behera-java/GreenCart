import { useEffect, useState } from "react";
import { navigate } from "../lib/router";
import { assets } from "../assets/greencart/greencart_assets/assets";
import { api, getToken } from "../lib/api";

export default function Address() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  // Load address from backend on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      // Not logged in — try localStorage fallback
      try {
        const saved = JSON.parse(
          localStorage.getItem("shippingAddress") || "null"
        );
        if (saved) setForm((f) => ({ ...f, ...saved }));
      } catch {}
      return;
    }
    // Logged in — load from backend
    api("/auth/address", { auth: true })
      .then((res) => {
        // Also keep in localStorage so Cart.jsx can read it
        localStorage.setItem("shippingAddress", JSON.stringify(res));
        setForm((f) => ({ ...f, ...res }));
      })
      .catch(() => {
        // If backend fails, fallback to localStorage
        try {
          const saved = JSON.parse(
            localStorage.getItem("shippingAddress") || "null"
          );
          if (saved) setForm((f) => ({ ...f, ...saved }));
        } catch {}
      });
  }, []);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    // Always save to localStorage (Cart.jsx reads from here)
    localStorage.setItem("shippingAddress", JSON.stringify(form));

    const token = getToken();
    if (token) {
      // Also save to backend if logged in
      try {
        await api("/auth/address", { method: "PUT", body: form, auth: true });
      } catch {
        // localStorage already saved, so still navigate
      }
    }
    setSaving(false);
    navigate("/cart");
  }

  function upd(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 py-6 md:py-12 px-6">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              ✓
            </div>
            <span className="font-semibold">Cart</span>
          </div>

          <div className="w-16 h-1 bg-emerald-500"></div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              2
            </div>
            <span className="font-semibold">Address</span>
          </div>

          <div className="w-16 h-1 bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              3
            </div>
            <span className="text-gray-400">Payment</span>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white/90 backdrop-blur-md rounded-[2rem] p-6 md:p-10 shadow-2xl border border-gray-100 animate-fade-in">
        <div className="space-y-6">
          <div>
            <span className="text-emerald-600 font-black tracking-[0.2em] text-[8px] uppercase bg-emerald-50 px-2.5 py-1 rounded-full italic">
              Logistics Hub
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-3 tracking-tighter italic leading-tight">
              Delivery <br />
              <span className="text-emerald-500">Address</span>
            </h1>
            <p className="text-gray-400 font-medium text-[10px] mt-1.5">
              Enter your address to receive fresh groceries quickly.
            </p>
          </div>

          <form onSubmit={save} className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                className="input-field py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
                placeholder="👤 First Name"
                value={form.firstName}
                onChange={(e) => upd("firstName", e.target.value)}
                required
              />
              <input
                className="input-field py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
                placeholder="👤 Last Name"
                value={form.lastName}
                onChange={(e) => upd("lastName", e.target.value)}
                required
              />
            </div>
            <input
              className="input-field py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
              placeholder="📧 Email Address"
              type="email"
              value={form.email}
              onChange={(e) => upd("email", e.target.value)}
              required
            />
            <input
              className="input-field py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
              placeholder="🏠 Street Address"
              value={form.street}
              onChange={(e) => upd("street", e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="input-field py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
                placeholder="📍 City"
                value={form.city}
                onChange={(e) => upd("city", e.target.value)}
                required
              />
              <input
                className="input-field py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
                placeholder="🗺️ State"
                value={form.state}
                onChange={(e) => upd("state", e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                className="input-field py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
                placeholder="📮 ZIP Code"
                value={form.zipcode}
                onChange={(e) => upd("zipcode", e.target.value)}
                required
              />
              <input
                className="input-field py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
                placeholder="🌎 Country"
                value={form.country}
                onChange={(e) => upd("country", e.target.value)}
                required
              />
            </div>
            <input
              className="input-field py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
              placeholder="📞 Phone Number"
              value={form.phone}
              onChange={(e) => upd("phone", e.target.value)}
              required
            />

            <button
              disabled={saving}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-4 rounded-xl hover:scale-[1.02] transition-all shadow-lg mt-4 disabled:opacity-60"
            >
              {saving ? "Saving..." : "SAVE ADDRESS & CONTINUE →"}
            </button>
          </form>
        </div>

        <div className="hidden lg:flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-5 shadow-lg border border-emerald-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Delivery Benefits
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">🚚</span>
                <span className="font-medium">Free Delivery Available</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg">⚡</span>
                <span className="font-medium">Fast Delivery</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg">🛡️</span>
                <span className="font-medium">Secure Checkout</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg">🥬</span>
                <span className="font-medium">Fresh Farm Products</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-3 shadow-lg border border-emerald-100">
            <img
              src={assets.add_address_iamge}
              alt=""
              className="w-[60%] mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}