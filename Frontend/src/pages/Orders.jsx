import { useEffect, useState } from "react";
import { api, fileUrl } from "../lib/api";
import { assets } from "../assets/greencart/greencart_assets/assets";
import ReviewModal from "../components/ReviewModal";

const steps = ["Processing", "Packed", "Shipped", "OutForDelivery", "Delivered"];

const stepIcons = {
  Processing: "⚙️",
  Packed: "📦",
  Shipped: "🚚",
  OutForDelivery: "🛵",
  Delivered: "✅",
};

function OrderCard({ o, onCancelled, productMap, onReview, reviewedProducts }) {
  const isCancelled = o.orderStatus === "Cancelled";
  const currentIndex = isCancelled
    ? -1
    : Math.max(0, steps.indexOf(o.orderStatus || "Processing"));

  async function cancelOrder() {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api(`/orders/${o.id}/cancel`, { method: "PUT", auth: true });
      alert("Order cancelled successfully.");
      onCancelled && onCancelled();
    } catch (e) {
      alert(e.message || "Cancellation failed");
    }
  }

  return (
    <div
      className={`bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100 space-y-10 animate-fade-in group hover:shadow-2xl transition-all duration-500 border-t-[6px] ${
        o.orderStatus === "Delivered"
          ? "border-t-emerald-500"
          : o.orderStatus === "Cancelled"
          ? "border-t-red-500"
          : "border-t-blue-500"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b-4 border-gray-900 pb-8">
        <div>
          <span className="text-emerald-600 font-black tracking-[0.2em] text-[10px] uppercase bg-emerald-50 px-3 py-1.5 rounded-full italic mb-4 inline-block">
            Order Receipt
          </span>
          <h2
            onClick={() => navigator.clipboard.writeText(String(o.id))}
            className="text-2xl font-black cursor-pointer hover:text-emerald-600 transition"
          >
            #{String(o.id).padStart(8, "0")}
          </h2>
          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">
            {new Date(o.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="text-left md:text-right">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Total Valuation
          </p>
          <p className="text-3xl font-black text-gray-900 tracking-tighter tabular-nums mb-1">
            ₹{o.total}
          </p>
          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic">
            {o.paymentMethod} • {o.paymentStatus}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-10">
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-6">
              Live Momentum
            </p>
            <div className="relative space-y-8 pl-6">
              <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-gray-100 rounded-full"></div>
              <div
                className={`absolute left-[5px] top-2 w-0.5 rounded-full transition-all duration-1000 ease-out z-10 ${
                  isCancelled ? "bg-red-200" : "bg-emerald-500"
                }`}
                style={{
                  height: isCancelled
                    ? "100%"
                    : `${(currentIndex / (steps.length - 1)) * 100}%`,
                }}
              ></div>

              {steps.map((s, i) => {
                const isCompleted = i < currentIndex;
                const isCurrent = i === currentIndex;
                const isFuture = i > currentIndex;

                return (
                  <div key={s} className="relative flex items-center gap-6 group/step">
                    <div
                      className={`absolute -left-[23px] w-3 h-3 rounded-full border-2 transition-all duration-500 z-20 ${
                        isCancelled
                          ? "bg-white border-red-200"
                          : isCurrent
                          ? "bg-white border-emerald-500 ring-4 ring-emerald-50 animate-pulse"
                          : isCompleted
                          ? "bg-emerald-500 border-emerald-500"
                          : "bg-white border-gray-100"
                      }`}
                    >
                      {isCurrent && !isCancelled && (
                        <div className="absolute inset-0 m-auto w-1 h-1 bg-emerald-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
                          isCancelled ? "text-red-300" : isFuture ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        <span>{stepIcons[s]}</span>
                        <span>{s}</span>
                      </span>
                      {isCurrent && !isCancelled && (
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest italic mt-0.5">
                          Current Phase
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {isCancelled && (
                <div className="relative flex items-center gap-6 animate-bounce-in">
                  <div className="absolute -left-[23px] w-3 h-3 rounded-full bg-red-600 ring-4 ring-red-100 z-20"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-600 italic">
                    Terminated
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 italic">
              Endpoint
            </p>
            <p className="text-[11px] font-bold text-gray-600 leading-relaxed italic">
              {o.address}
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-6">
            Acquired Selection ({o.items.length} Items)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {o.items.map((it) => (
              <div
                key={it.id}
                className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-gray-50 border border-gray-50 hover:bg-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-white rounded-xl p-2 flex items-center justify-center shrink-0 shadow-sm border border-gray-50">
                  <img
                    src={fileUrl(productMap[it.productId]?.imageUrl) || assets.product_list_icon}
                    alt={it.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-800 line-clamp-1">{it.name}</p>
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1 italic">
                    {it.qty} × ₹{it.price}
                  </p>
                  {o.orderStatus === "Delivered" &&
                    (reviewedProducts?.[it.product.id] ? (
                      <span className="mt-2 inline-block bg-gray-200 text-gray-600 px-3 py-1 rounded text-xs">
                        Reviewed ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => onReview(it.product.id)}
                        className="mt-2 bg-emerald-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Rate Product
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {o.orderStatus !== "Cancelled" && o.orderStatus !== "Delivered" && (
            <button
              onClick={cancelOrder}
              className="mt-10 bg-red-50 text-red-600 px-5 py-3 rounded-2xl font-black hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              Abort This Order Cycle
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productMap, setProductMap] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [reviewedProducts, setReviewedProducts] = useState({});
  const reviewCount = Object.values(reviewedProducts).filter(Boolean).length;

  const loadData = async () => {
    setLoading(true);
    try {
      const [orderRes, prodRes] = await Promise.all([
        api("/orders/my", { auth: true }),
        api("/products"),
      ]);

      const sortedOrders = Array.isArray(orderRes) ? [...orderRes].sort((a, b) => b.id - a.id) : [];
      setOrders(sortedOrders);

      const map = {};
      (Array.isArray(prodRes) ? prodRes : []).forEach((p) => (map[p.id] = p));
      setProductMap(map);

      const reviewedMap = {};
      for (const order of sortedOrders) {
        for (const item of order.items) {
          try {
            const reviewed = await api(`/reviews/check/${item.product.id}`, { auth: true });
            reviewedMap[item.product.id] = reviewed;
          } catch (e) {}
        }
      }
      setReviewedProducts(reviewedMap);
    } catch (e) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="bg-[#fcfdfd] min-h-screen py-8 md:py-12 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 animate-fade-in">
          <div>
            <span className="text-emerald-600 font-extrabold tracking-[0.2em] text-[10px] uppercase bg-emerald-50 px-3 py-1.5 rounded-full italic">
              Vault Archives
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mt-4 tracking-tighter italic">
              Acquisition History
            </h1>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-[1.5rem] border border-gray-100 shadow-sm">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
              Total Logs
            </span>
            <span className="text-xl font-black text-emerald-600 leading-none">{orders.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <div className="bg-white rounded-3xl p-6 shadow-sm border">
            <p className="text-xs text-gray-500">Total Orders</p>
            <h2 className="text-4xl font-black">{orders.length}</h2>
          </div>
          <div className="bg-emerald-50 rounded-3xl p-6 border">
            <p className="text-xs text-emerald-600">Delivered</p>
            <h2 className="text-4xl font-black text-emerald-600">
              {orders.filter((o) => o.orderStatus === "Delivered").length}
            </h2>
          </div>
          <div className="bg-blue-50 rounded-3xl p-6 border">
            <p className="text-xs text-blue-600">Active</p>
            <h2 className="text-4xl font-black text-blue-600">
              {orders.filter((o) => o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled").length}
            </h2>
          </div>
          <div className="bg-red-50 rounded-3xl p-6 border">
            <p className="text-xs text-red-600">Cancelled</p>
            <h2 className="text-4xl font-black text-red-600">
              {orders.filter((o) => o.orderStatus === "Cancelled").length}
            </h2>
          </div>
          <div className="bg-yellow-50 rounded-3xl p-6 border">
            <p className="text-xs text-yellow-700">Reviews Given</p>
            <h2 className="text-4xl font-black text-yellow-600">{reviewCount}</h2>
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center font-black animate-pulse text-gray-200 uppercase tracking-[0.3em]">
            Querying Order Registry...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <h2 className="text-xl font-black text-gray-300 uppercase tracking-widest italic mb-6">
              Your Archive is Empty
            </h2>
            <a href="/" className="btn-primary italic text-[10px]">
              Start New Cycle
            </a>
          </div>
        ) : (
          <div className="space-y-12">
            {orders.map((o) => (
              <OrderCard
                key={o.id}
                o={o}
                productMap={productMap}
                reviewedProducts={reviewedProducts}
                onCancelled={loadData}
                onReview={(productId) => {
                  setSelectedProductId(productId);
                  setShowReviewModal(true);
                }}
              />
            ))}
          </div>
        )}
        {showReviewModal && (
          <ReviewModal productId={selectedProductId} onClose={() => setShowReviewModal(false)} />
        )}
      </div>
    </div>
  );
}