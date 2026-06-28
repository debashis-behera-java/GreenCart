import { assets } from "../assets/greencart/greencart_assets/assets";
import { useEffect, useState, useRef } from "react";
import { api, fileUrl } from "../lib/api";

function RelatedCard({ p, onAdd }) {
  const price = p.offerPrice ?? p.price;
  return (
    <div className="group bg-white rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
      <a
        href={`#/product/${p.id}`}
        className="block aspect-square bg-gray-50 rounded-2xl overflow-hidden p-4 mb-4"
      >
        <img
          src={p.imageUrl ? fileUrl(p.imageUrl) : "/placeholder.png"}
          alt={p.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
        />
      </a>
      <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 italic">
        {p.category}
      </div>
      <a
        href={`#/product/${p.id}`}
        className="font-bold text-gray-900 line-clamp-1 mb-2 hover:text-emerald-600 transition-colors"
      >
        {p.name}
      </a>
      <div className="flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-gray-900">₹{price}</span>
          {p.offerPrice && (
            <span className="text-[10px] font-bold text-gray-300 line-through">
              ₹{p.price}
            </span>
          )}
        </div>
        <button
          onClick={() => onAdd(p, 1, true)}
          className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:bg-emerald-600 transition-all"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Product({ id, onAdd }) {
  const [p, setP] = useState(null);
  const [list, setList] = useState([]);
  const [sel, setSel] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const reviewRef = useRef(null);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, active: true });
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api(`/products/${id}`),
      api("/products"),
      api(`/reviews/product/${id}`),
    ])
      .then(([res, all, reviewData]) => {
        console.log("REVIEWS =", reviewData);

        setP(res || null);
        setReviews(reviewData || []);
        setList(Array.isArray(all) ? all : all.products || []);
      })
      .catch((err) => {
        console.error(err);
        setP(null);
      })
      .finally(() => setLoading(false));

    setSel(0);
    setQty(1);
  }, [id]);

  if (loading)
    return (
      <div className="p-20 text-center font-black animate-pulse text-gray-200 uppercase tracking-[0.3em]">
        Decoding Ingredient Metadata...
      </div>
    );
  if (!p)
    return (
      <div className="p-20 text-center font-bold text-gray-400">
        Essential not found.
      </div>
    );

  const price = p.offerPrice ?? p.price;
  const related = list
    .filter((x) => x.category === p.category && x.id !== p.id)
    .slice(0, 5);
  const available = p.stock ?? 0;
  const productImgs = p.imageUrl ? [p.imageUrl] : [];

  return (
    <div className="bg-white min-h-screen py-6 md:py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-in">
          <a href="#/" className="text-gray-400 hover:text-emerald-600">
            Home
          </a>
          <span className="text-gray-200">/</span>
          <span className="text-gray-400">Vault</span>
          <span className="text-gray-200">/</span>
          <span className="text-emerald-600 italic">Product Identity</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Gallery Section */}
          <div className="lg:col-span-6 flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="flex md:flex-col gap-4 order-2 md:order-1 shrink-0 overflow-auto pb-4 md:pb-0 px-1">
              {productImgs.map((im, i) => (
                <button
                  key={i}
                  className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[1.5rem] border-2 transition-all p-2 flex items-center justify-center bg-gray-50/50 ${sel === i ? "border-emerald-500 shadow-lg shadow-emerald-50" : "border-transparent hover:border-emerald-200"}`}
                  onClick={() => setSel(i)}
                >
                  <img
                    src={im ? fileUrl(im) : "/placeholder.png"}
                    alt=""
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </button>
              ))}
            </div>

            <div className="flex-1 order-1 md:order-2">
              <div
                className="rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 bg-gray-50/50 flex items-center justify-center relative overflow-hidden group cursor-crosshair min-h-[300px] md:min-h-[500px]"
                onMouseMove={handleMouseMove}
                onMouseLeave={() =>
                  setZoomPos((p) => ({ ...p, active: false }))
                }
              >
                <img
                  src={
                    productImgs[sel]
                      ? fileUrl(productImgs[sel])
                      : "/placeholder.png"
                  }
                  alt={p.name}
                  className={`max-h-[20rem] md:max-h-[30rem] w-full object-contain mix-blend-multiply transition-transform duration-200 ease-out ${zoomPos.active ? "scale-[2.5]" : "scale-100"}`}
                  style={{ transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }}
                />
                {!zoomPos.active && (
                  <div className="absolute inset-x-0 bottom-6 md:bottom-8 flex justify-center pointer-events-none animate-bounce">
                    <span className="text-[7px] md:text-[8px] font-black text-emerald-600 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                      Explore Details
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Context Section */}
          <div className="lg:col-span-6 flex flex-col justify-center animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic">
                {p.category}
              </span>
              {available > 0 ? (
                <span className="text-emerald-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Inventory Secured
                </span>
              ) : (
                <span className="text-red-500 text-[9px] font-black uppercase tracking-widest">
                  Depleted Stock
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight mb-4 italic">
              {p.name}
            </h1>

            <div className="flex items-center gap-5 mb-10">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">
                  ₹{price}
                </span>
                {p.offerPrice && (
                  <span className="text-lg font-bold text-gray-300 line-through tracking-tighter">
                    ₹{p.price}
                  </span>
                )}
              </div>
              <div className="h-8 w-px bg-gray-100"></div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <svg
                      key={i}
                      className="w-3 h-3 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <button
                  onClick={() =>
                    reviewRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                  className="text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-emerald-600 cursor-pointer transition-colors"
                >
                  ⭐ {p.averageRating?.toFixed(1) || 0}({p.reviewCount || 0}{" "}
                  Review
                  {p.reviewCount !== 1 ? "s" : ""})
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mb-10">
              <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-xl">
                {p.description ||
                  `This premium ${p.weight || ""} ${p.name} is meticulously sourced to meet the highest standards of freshness and nutritional purity. Perfect for your next culinary masterpiece.`}
              </p>
              <div className="flex items-center gap-2 mt-4">
                <div className="bg-gray-900 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  Stock: {available} Units
                </div>
                <span className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">
                  In Warehouse Reserve
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100 shadow-sm">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center font-black text-gray-800 hover:text-emerald-600 transition-colors"
                    disabled={available <= 0}
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-black text-lg text-gray-900 tabular-nums">
                    {qty}
                  </span>
                  <button
                    onClick={() =>
                      setQty((q) => Math.min(available || Infinity, q + 1))
                    }
                    className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center font-black text-gray-800 hover:text-emerald-600 transition-colors"
                    disabled={available <= 0}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => onAdd(p, qty, false)}
                  disabled={available <= 0}
                  className={`flex-1 min-w-[180px] h-14 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 transition-all ${
                    available <= 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                      : "bg-gray-900 text-white hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 shadow-xl shadow-gray-200"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  ADD TO SELECTION
                </button>
              </div>

              <button
                onClick={() => onAdd(p, qty, true)}
                disabled={available <= 0}
                className={`w-full h-14 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all border-2 ${
                  available <= 0
                    ? "border-gray-100 text-gray-300 pointer-events-none"
                    : "border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                }`}
              >
                IMMEDIATE ACQUISITION
              </button>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-gray-50 pt-12">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Delivery Cycle
                </p>
                <p className="text-gray-900 font-bold text-sm">
                  Express 90-Min Window
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Preservation
                </p>
                <p className="text-gray-900 font-bold text-sm">
                  Vacuum Sealed Freshness
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section ref={reviewRef} className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-black mb-8">Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="bg-white border p-5 rounded-xl mb-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-bold text-gray-900">{r.user?.name}</p>

                  <p className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-yellow-500 font-bold">
                  {"⭐".repeat(r.rating)}
                </div>
              </div>

              <p className="text-gray-700">{r.comment}</p>
            </div>
          ))
        )}
      </section>
      {/* Related Selection */}
      <section className="bg-gray-50 py-24 pb-40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-emerald-600 font-black tracking-[0.2em] text-[10px] uppercase bg-emerald-50 px-3 py-1.5 rounded-full italic">
                Discovery Hub
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 tracking-tighter italic">
                Complementary Goods
              </h2>
            </div>
            <a
              href="/all-products"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-emerald-600 transition-colors"
            >
              View Entire Collection
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8">
            {related.map((rp) => (
              <RelatedCard key={rp.id} p={rp} onAdd={onAdd} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
