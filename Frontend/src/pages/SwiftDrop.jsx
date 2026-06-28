import { useCallback, useEffect, useMemo, useState } from "react";

const navConfig = [
  { id: "home", icon: "M3 12l9-9 9 9-9 9-9-9", badge: 2, label: "Home" },
  { id: "routes", icon: "M4 6h16M4 12h10M4 18h7", badge: 0, label: "Routes" },
  { id: "wallet", icon: "M3 7h18v10H3z", badge: 1, label: "Wallet" },
  { id: "bell", icon: "M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5L4 18v2h16v-2l-2-2z", badge: 5, label: "Alerts" }
];

const heroStats = [
  { k: "Deliveries", v: 8 },
  { k: "Earnings", v: "₹620" },
  { k: "Distance", v: "14.2 km" }
];

const statCards = [
  { icon: "🚚", value: 12, label: "Active Tasks", change: "+2 today", trend: "up" },
  { icon: "₹", value: "1,540", label: "Weekly Earnings", change: "+8%", trend: "up" },
  { icon: "⏱️", value: "18m", label: "Avg ETA", change: "+2m", trend: "down" },
  { icon: "⭐", value: "4.8", label: "Rating", change: "102 reviews", trend: "up" }
];

const ordersData = [
  { dot: "bg-emerald-500", name: "Order #A102", sub: "Fresh Farm Mart → Sector 21", amt: "₹320", status: "Delivered" },
  { dot: "bg-orange-500", name: "Order #A103", sub: "GreenCart Hub → Sector 14", amt: "₹210", status: "Out for delivery" },
  { dot: "bg-yellow-500", name: "Order #A104", sub: "Spice Villa → Sector 5", amt: "₹480", status: "Picked up" },
  { dot: "bg-gray-400", name: "Order #A105", sub: "Veg Basket → Sector 30", amt: "₹150", status: "Assigned" }
];

const earningsData = [
  { d: "Mon", v: 6 },
  { d: "Tue", v: 9 },
  { d: "Wed", v: 7 },
  { d: "Thu", v: 11 },
  { d: "Fri", v: 4 },
  { d: "Sat", v: 13 },
  { d: "Sun", v: 8 }
];

const actionsConfig = [
  { icon: "📦", title: "Scan Package", sub: "Verify before pickup" },
  { icon: "🧭", title: "Navigate", sub: "Open directions" },
  { icon: "🧾", title: "View Earnings", sub: "Today’s summary" },
  { icon: "💬", title: "Contact Support", sub: "Chat with helpdesk" }
];

const ratingsBreakdown = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 15 },
  { stars: 3, pct: 5 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 }
];

const badgesData = [
  { t: "On-time Streak" },
  { t: "100+ Deliveries" },
  { t: "Top Rated" }
];

export default function App() {
  const [active, setActive] = useState("home");
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(40);
  const [barsReady, setBarsReady] = useState(false);
  const [toast, setToast] = useState({ visible: false, icon: "✅", msg: "" });
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700&display=swap";
    document.head.appendChild(l);
  }, []);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    const e = setInterval(() => setProgress((p) => (p >= 95 ? 30 : p + 5)), 2500);
    const b = setTimeout(() => setBarsReady(true), 200);
    return () => {
      clearTimeout(t);
      clearInterval(e);
      clearTimeout(b);
    };
  }, []);
  useEffect(() => {
    if (!toast.visible) return;
    const t = setTimeout(() => setToast((s) => ({ ...s, visible: false })), 3000);
    return () => clearTimeout(t);
  }, [toast.visible]);
  const showToast = useCallback((icon, msg) => {
    setToast({ visible: true, icon, msg });
  }, []);
  const today = useMemo(() => new Date().toLocaleDateString(), []);
  const accent = "#f97316";
  const bg = "#0a0c10";
  return (
    <>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes bouncey { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes fadeUp { 0%{opacity:0; transform:translateY(8px)} 100%{opacity:1; transform:translateY(0)} }
        .blink { animation: blink 1.2s infinite; }
        .bouncey { animation: bouncey 1.6s infinite; }
        .fadeUp { animation: fadeUp .5s ease-out both; }
      `}</style>
      <div className="min-h-screen text-gray-100" style={{ backgroundColor: bg }}>
        <aside className="fixed left-0 top-0 bottom-0 w-16 border-r border-white/10 flex flex-col items-center justify-between py-4" style={{ backgroundColor: "#0b0e13" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: accent }}>
            <span className="text-xs font-bold">SD</span>
          </div>
          <div className="space-y-3">
            {navConfig.map((n) => {
              const isActive = active === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    setActive(n.id);
                    showToast("🔔", n.label);
                  }}
                  className={`relative w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? "ring-2 ring-offset-2 ring-offset-transparent" : ""}`}
                  style={{ backgroundColor: isActive ? accent : "#12151b" }}
                  aria-label={n.label}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={n.icon} />
                  </svg>
                  {n.badge ? (
                    <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: accent }}>
                      {n.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
          <button onClick={() => showToast("👤", "Profile")} className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">🧑‍✈️</div>
          </button>
        </aside>
        <div className="ml-16">
          <div className="sticky top-0 z-10 border-b border-white/10 px-4 py-3" style={{ backgroundColor: "#0b0e13" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl" style={{ fontFamily: "Syne, sans-serif" }}>SwiftDrop</div>
                <span className="text-xs px-2 py-0.5 rounded-full blink bg-emerald-600/20 text-emerald-400 border border-emerald-700/40">Online</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => showToast("🔔", "Alerts")} className="px-3 py-1.5 rounded-lg border border-white/20 text-gray-100">Alerts</button>
                <button onClick={() => showToast("✅", "Order accepted")} className="px-3 py-1.5 rounded-lg text-black" style={{ backgroundColor: accent }}>
                  Accept Order
                </button>
              </div>
            </div>
          </div>
          <div className="px-4 py-4">
            <div className="relative rounded-xl border border-white/10 p-4 overflow-hidden" style={{ background: "linear-gradient(180deg,#111418,#0a0c10)" }}>
              <div className="flex items-center gap-3">
                <div className="text-lg font-semibold">Hi, Aarav</div>
                <div className="text-xs text-gray-400">Today {today}</div>
                <div className="text-xs text-gray-300 px-2 py-0.5 rounded-lg" style={{ backgroundColor: "#141922" }}>Zone 3 • Central</div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                {heroStats.map((s, i) => (
                  <div key={i} className="text-xs px-3 py-1.5 rounded-lg border border-white/10" style={{ backgroundColor: "#12151b" }}>
                    <span className="text-gray-400">{s.k}</span> <span className="ml-1 font-semibold">{s.v}</span>
                  </div>
                ))}
              </div>
              <div className="absolute right-4 top-4 text-4xl bouncey">⚡</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
              {statCards.map((c, i) => {
                const up = c.trend === "up";
                return (
                  <div key={i} className={`rounded-xl p-4 border border-white/10 ${mounted ? "fadeUp" : ""}`} style={{ backgroundColor: "#0e1116", animationDelay: `${i * 60}ms` }}>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl">{c.icon}</div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${up ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}>{up ? "▲" : "▼"} {c.change}</div>
                    </div>
                    <div className="mt-2 text-2xl font-bold">{c.value}</div>
                    <div className="text-xs text-gray-400">{c.label}</div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <div className="relative rounded-xl p-4 border border-white/10" style={{ backgroundColor: "#0e1116" }}>
                <div className="text-sm font-semibold mb-2">Live Map</div>
                <div className="relative">
                  <svg viewBox="0 0 600 260" className="w-full h-[260px] rounded-lg border border-white/10" style={{ backgroundColor: "#0b0e13" }}>
                    <path d="M20 30 L580 30" stroke="#1f2937" strokeWidth="8" />
                    <path d="M20 130 L580 130" stroke="#1f2937" strokeWidth="8" />
                    <path d="M20 230 L580 230" stroke="#1f2937" strokeWidth="8" />
                    <path d="M60 210 C120 100, 240 60, 420 120 S560 200, 540 220" stroke={accent} strokeWidth="3" strokeDasharray="6 6" fill="none" />
                    <circle cx="60" cy="210" r="8" fill="#22c55e" />
                    <circle cx="300" cy="120" r="8" fill="#60a5fa" className="bouncey" />
                    <circle cx="540" cy="220" r="8" fill="#ef4444" />
                  </svg>
                  <div className="absolute left-3 top-3 text-xs px-2 py-1 rounded-lg border border-white/10" style={{ backgroundColor: "#12151b" }}>ETA 18m</div>
                </div>
              </div>
              <div className="rounded-xl p-4 border border-white/10" style={{ backgroundColor: "#0e1116" }}>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Active Order</div>
                  <div className="text-xs text-gray-400">#A103</div>
                </div>
                <div className="mt-2 text-xs text-gray-300">Pickup: GreenCart Hub, Sector 14</div>
                <div className="text-xs text-gray-300">Drop: 12B, Park View, Sector 10</div>
                <div className="text-xs text-gray-300 mt-1">Payment: UPI • ₹210</div>
                <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-2" style={{ width: `${progress}%`, backgroundColor: accent }}></div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <a href="tel:+919999999999" className="px-3 py-1.5 rounded-lg bg-white/10 text-sm">Call</a>
                  <button onClick={() => showToast("💬", "Chat")} className="px-3 py-1.5 rounded-lg bg-white/10 text-sm">Chat</button>
                  <button onClick={() => showToast("✅", "Delivered")} className="px-3 py-1.5 rounded-lg text-black text-sm" style={{ backgroundColor: accent }}>Deliver</button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
              <div className="rounded-xl p-4 border border-white/10" style={{ backgroundColor: "#0e1116" }}>
                <div className="text-sm font-semibold mb-2">Recent Orders</div>
                <div className="space-y-2">
                  {ordersData.map((o, i) => (
                    <div key={i} className="flex items-center justify-between text-xs rounded-lg px-2 py-2 bg-white/5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${o.dot}`}></span>
                        <div>
                          <div className="text-gray-200">{o.name}</div>
                          <div className="text-[11px] text-gray-400">{o.sub}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-200">{o.amt}</div>
                        <div className="text-[11px] text-emerald-400">{o.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl p-4 border border-white/10" style={{ backgroundColor: "#0e1116" }}>
                <div className="text-sm font-semibold mb-2">Weekly Earnings</div>
                <div className="flex items-end gap-3 h-40">
                  {earningsData.map((e, i) => {
                    const h = Math.max(4, e.v * 8);
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-8 rounded-t-lg" style={{ height: 0, transformOrigin: "bottom", transform: `scaleY(${barsReady ? h / 8 : 0})`, backgroundColor: accent, transition: "transform .6s ease" }}></div>
                        <div className="text-[11px] text-gray-400">{e.d}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-xl p-4 border border-white/10" style={{ backgroundColor: "#0e1116" }}>
                <div className="text-sm font-semibold mb-2">Quick Actions</div>
                <div className="space-y-2">
                  {actionsConfig.map((a, i) => (
                    <button key={i} onClick={() => showToast(a.icon, a.title)} className="w-full flex items-center justify-between text-left rounded-lg px-3 py-2 bg-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#12151b" }}>{a.icon}</div>
                        <div className="text-xs">
                          <div className="text-gray-200">{a.title}</div>
                          <div className="text-[11px] text-gray-400">{a.sub}</div>
                        </div>
                      </div>
                      <span className="text-gray-400">›</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-xl p-4 border border-white/10" style={{ backgroundColor: "#0e1116" }}>
              <div className="flex items-center justify-between">
                <div className="text-4xl font-extrabold">4.8</div>
                <div className="flex items-center gap-2">
                  {badgesData.map((b, i) => (
                    <div key={i} className="text-xs px-2 py-1 rounded-full border border-white/10" style={{ backgroundColor: "#12151b" }}>{b.t}</div>
                  ))}
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {ratingsBreakdown.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-8">{r.stars}★</span>
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-2 bg-emerald-500" style={{ width: `${r.pct}%` }}></div>
                    </div>
                    <span className="w-10 text-right">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {toast.visible ? (
          <div className="fixed bottom-4 right-4 rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 text-sm" style={{ backgroundColor: "#151922", border: "1px solid rgba(255,255,255,.08)" }}>
            <span className="text-lg">{toast.icon}</span>
            <span>{toast.msg}</span>
            <button className="ml-2 text-gray-400" onClick={() => setToast((s) => ({ ...s, visible: false }))}>✕</button>
          </div>
        ) : null}
      </div>
    </>
  );
}

