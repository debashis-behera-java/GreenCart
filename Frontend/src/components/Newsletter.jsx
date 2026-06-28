import { useState } from "react";
import { api } from "../lib/api";

export default function Newsletter({ showToast }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function subscribe() {
    if (!email) return;
    setLoading(true);
    try {
      await api("/newsletter/subscribe", { method: "POST", body: { email } });
      if (showToast) showToast("Subscribed successfully!");
      setEmail("");
    } catch (e) {
      if (showToast) showToast(e.message || "Subscription failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 text-center">
        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800">Never Miss a Deal!</h3>
        <p className="text-gray-500 mt-1">Subscribe to get the latest offers, new arrivals, and exclusive discounts</p>
        <div className="mt-5 mx-auto max-w-3xl flex rounded-xl overflow-hidden border border-gray-200">
          <input 
            placeholder="Enter your email id" 
            className="flex-1 px-4 py-3 outline-none" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button 
            onClick={subscribe}
            disabled={loading}
            className="px-6 bg-[#2FA25B] text-white font-semibold disabled:opacity-50"
          >
            {loading ? "..." : "Subscribe"}
          </button>
        </div>
      </div>
    </section>
  );
}

