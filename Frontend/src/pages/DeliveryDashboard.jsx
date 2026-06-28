import { useEffect, useState } from "react";
import { api, apiForm, fileUrl } from "../lib/api";
import { assets } from "../assets/greencart/greencart_assets/assets";

function StatusBadge({ status }) {
  const styles = {
    Processing: "bg-blue-50 text-blue-600 border-blue-100",
    Packed: "bg-purple-50 text-purple-600 border-purple-100",
    Shipped: "bg-amber-50 text-amber-600 border-amber-100",
    OutForDelivery: "bg-emerald-50 text-emerald-600 border-emerald-100 animate-pulse",
    Delivered: "bg-gray-50 text-gray-500 border-gray-100",
    Cancelled: "bg-red-50 text-red-600 border-red-100"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.Processing}`}>
      {status}
    </span>
  );
}

function ResendOtpBtn({ orderId }) {
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    try {
      await api(`/orders/${orderId}/otp/resend`, { method: "POST", auth: true });
      setCooldown(30);
    } catch (e) {
      alert(e.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleResend}
      disabled={cooldown > 0 || loading}
      className={`text-[9px] font-black uppercase tracking-widest transition-all ${cooldown > 0 || loading ? 'text-gray-300 cursor-not-allowed' : 'text-amber-600 hover:text-amber-700 hover:underline underline-offset-4'}`}
    >
      {loading ? "Transmitting..." : cooldown > 0 ? `Resend Available in ${cooldown}s` : "Resend OTP Code to Customer"}
    </button>
  );
}

function OrderCard({ o, onPick, onDeliver, onNote, onProof }) {
  const [otp, setOtp] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);

  const customer =  o.user || {};
  const isUpi = o.paymentMethod === "UPI";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address)}`;

  return (
    <div className={`group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-emerald-100 transition-all duration-500 overflow-hidden flex flex-col md:flex-row ${o.orderStatus === 'Delivered' ? 'opacity-75 grayscale-[0.5]' : ''}`}>
      {/* Customer & Info Side */}
      <div className="p-8 md:w-1/3 bg-gray-50/50 border-r border-gray-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 p-0.5 overflow-hidden">
              <img 
                src={customer.avatarUrl ? fileUrl(customer.avatarUrl) : assets.profile_icon} 
                className="w-full h-full object-cover rounded-xl"
                alt="" 
                onError={(e) => e.currentTarget.src = assets.profile_icon}
              />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Customer</p>
              <h3 className="text-xl font-black text-gray-900 tracking-tighter leading-tight italic">{customer.name || "-"}</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 bg-white rounded-xl border border-gray-100">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivery Address</p>
                <p className="text-sm font-black text-gray-800 leading-relaxed mb-2">{o.address || "-"}</p>
                <a 
                  href={googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:translate-x-1 transition-transform"
                >
                  Open Maps <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 bg-white rounded-xl border border-gray-100">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact</p>
                  <a href={`tel:${customer.phone}`} className="text-sm font-black text-gray-900 hover:text-emerald-600">{customer.phone || "-"}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
              <p className={`text-[11px] font-black uppercase tracking-widest ${isUpi ? 'text-amber-700' : 'text-emerald-700'}`}>
                {isUpi ? 'UPI (OTP CODE REQUIRED)' : 'COD (DELIVER NORMALLY)'}
              </p>
            </div>
            <StatusBadge status={o.orderStatus} />
          </div>
          <p className="text-xl font-black text-gray-900 tracking-tighter italic">₹{ o.total.toLocaleString()}</p>
        </div>
      </div>

      {/* Operation Side */}
      <div className="p-8 flex-1 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-8">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Order Details</p>
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">#{o.id.slice(-8)}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {o.items.map((it) => (
            <div key={it.productId} className="flex items-center gap-3 p-2 bg-emerald-50/20 rounded-2xl border border-emerald-100 hover:border-emerald-300 hover:bg-white transition-all">
              <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-emerald-100">
                <img src={it.image ? fileUrl(it.image) : assets.logo} className="w-full h-full object-contain" alt="" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-gray-900 tracking-tighter truncate leading-tight italic">{it.name}</p>
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Qty: {it.qty}</p>
              </div>
            </div>
          ))}
        </div>

        {o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="flex gap-2">
                <input 
                  className="flex-1 bg-white border-2 border-emerald-100 rounded-2xl px-4 py-3 text-xs font-black focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-gray-400" 
                  placeholder="Note for seller..." 
                  value={note} 
                  onChange={(e)=>setNote(e.target.value)} 
                />
                <button 
                  onClick={()=> onNote(o, note, ()=> setNote(""))} 
                  className="px-6 rounded-2xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors italic whitespace-nowrap"
                >Log Note</button>
              </div>

              {isUpi && o.orderStatus === "OutForDelivery" && (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input 
                      className="flex-1 bg-white border-2 border-amber-200 rounded-2xl px-4 py-3 text-xs font-black focus:ring-2 focus:ring-amber-500/20 transition-all placeholder-amber-500 text-amber-900" 
                      placeholder="6-Digit Customer OTP" 
                      value={otp} 
                      onChange={(e)=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} 
                    />
                    <button 
                      onClick={()=> onDeliver(o, otp)} 
                      className="px-6 rounded-2xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 italic"
                    >Verify & Deliver</button>
                  </div>
                  <div className="px-2">
                    <ResendOtpBtn orderId={o.id} />
                  </div>
                </div>
              )}
            </div>

            {o.orderStatus === "OutForDelivery" && !isUpi && (
              <button 
                onClick={()=> onDeliver(o)} 
                className="w-full py-5 rounded-[2rem] bg-emerald-600 text-white text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-100 hover:bg-emerald-700 hover:scale-[1.01] active:scale-95 transition-all italic"
              >
                Confirm Normal Delivery (COD)
              </button>
            )}

            {o.orderStatus !== "OutForDelivery" && (
              <button 
                onClick={() => onPick(o)} 
                className="w-full py-5 rounded-[2rem] bg-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.01] active:scale-95 transition-all italic"
              >
                Accept Task & Pickup Items
              </button>
            )}

            <div className="pt-4 flex items-center gap-4">
              <div className="relative flex-1 group/file">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  onChange={(e)=> setFile(e.target.files?.[0] || null)} 
                />
                <div className={`p-3 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-3 ${file ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-gray-50/50 group-hover/file:border-emerald-300 group-hover/file:bg-emerald-50/10'}`}>
                  <svg className={`w-4 h-4 ${file ? 'text-emerald-500' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${file ? 'text-emerald-700' : 'text-gray-400'}`}>
                    {file ? file.name.slice(0, 15) : 'Delivery Document (Proof)'}
                  </span>
                </div>
              </div>
              <button 
                disabled={!file}
                onClick={()=> file && onProof(o, file, ()=> setFile(null))} 
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic ${file ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
              >Upload</button>
            </div>
          </div>
        )}

        {o.orderStatus === "Delivered" && (
          <div className="flex flex-col items-center justify-center py-6 bg-emerald-50/30 rounded-[2rem] border border-emerald-100">
            <svg className="w-12 h-12 text-emerald-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-xs font-black text-emerald-800 uppercase tracking-widest italic">Mission Completed Successfully</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('active'); // 'active' or 'closed'

  useEffect(() => {
    fetchOrders();
    const iv = setInterval(fetchOrders, 30000);
    return () => clearInterval(iv);
  }, []);

  async function fetchOrders() {
    try {
      const res = await api("/orders/assigned", { auth: true });
     setOrders(Array.isArray(res) ? res : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function handlePick(o) {
    try {
      await api(`/orders/${o.id}/ack/pick`, { method: "PUT", auth: true });
      fetchOrders();
    } catch {
      alert("Failed to acknowledge pickup");
    }
  }

  async function handleDeliver(o, otp) {
    try {
      await api(`/orders/${o.id}/ack/deliver`, { method: "PUT", auth: true, body: { otp } });
      alert("Delivery recorded successfully!");
      fetchOrders();
    } catch (e) {
      alert(e.message || "Invalid delivery code. Please verify with customer.");
    }
  }

  async function handleNote(o, message, reset){
    try{
      await api(`/orders/${o.id}/note`, { method:"PUT", auth:true, body:{ message } });
      reset?.();
      fetchOrders();
    } catch(e){
      alert(e.message || "Failed to add note");
    }
  }

  async function handleProof(o, file, reset){
    try{
      const fd = new FormData();
      fd.append("file", image)
      console.log(fd.get("file"));
      await apiForm(`/orders/${o.id}/proof`, fd, { auth: true });
      reset?.();
      fetchOrders();
      alert("Evidence uploaded");
    } catch(e){
      alert(e.message || "Failed to upload proof");
    }
  }

  const assigned = orders.filter(o => o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled");
  const completed = orders.filter(o => o.orderStatus === "Delivered");

  const displayOrders = viewMode === 'active' ? assigned : completed;

  return (
    <section className="min-h-screen bg-[#fafbfc] py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2 block italic">Live Logistics Hub</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic leading-tight">Delivery<br />Dashboard.</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setViewMode('closed')}
              className={`px-8 py-5 rounded-[2rem] border transition-all ${viewMode === 'closed' ? 'bg-gray-900 text-white border-gray-900 shadow-xl' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
            >
              <p className="text-[9px] font-black uppercase tracking-widest mb-1">Closed Tasks</p>
              <p className={`text-2xl font-black tracking-tighter italic ${viewMode === 'closed' ? 'text-white' : 'text-gray-900'}`}>{completed.length || "0"}</p>
            </button>
            <button 
              onClick={() => setViewMode('active')}
              className={`px-8 py-5 rounded-[2rem] transition-all shadow-xl ${viewMode === 'active' ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-white text-gray-400 border border-gray-100 hover:border-emerald-200'}`}
            >
              <p className={`text-[9px] font-black uppercase tracking-widest mb-1 italic ${viewMode === 'active' ? 'text-emerald-200' : 'text-gray-400'}`}>Active Pipeline</p>
              <p className={`text-2xl font-black tracking-tighter italic ${viewMode === 'active' ? 'text-white' : 'text-gray-900'}`}>{assigned.length || "0"}</p>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-40">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : displayOrders.length === 0 ? (
          <div className="py-40 bg-white rounded-[3rem] border border-gray-50 text-center shadow-sm animate-fade-in">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-loose italic">
              {viewMode === 'active' ? "No active assignments found in pipeline." : "No completed missions found in archives."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 animate-fade-in">
            {displayOrders.map((o) => (
              <OrderCard key={o.id} o={o} onPick={handlePick} onDeliver={handleDeliver} onNote={handleNote} onProof={handleProof} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

