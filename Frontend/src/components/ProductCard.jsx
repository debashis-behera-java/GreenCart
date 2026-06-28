import { useState } from "react";
import { fileUrl } from "../lib/api";
import { navigate } from "../lib/router";

export default function ProductCard({ p, onAdd }) {
  const price = p.offerPrice ?? p.price;

  const [idx, setIdx] = useState(0);
  const [qty, setQty] = useState(1);

  // FIXED IMAGE LOGIC
  let src = "";

  if (p.imageUrl) {
    src = fileUrl(p.imageUrl);
  } else if (p.images?.length) {
    src = fileUrl(p.images[idx]);
  } else if (Array.isArray(p.image) && p.image.length) {
    src = fileUrl(p.image[idx]);
  }

  console.log("PRODUCT:", p);
  console.log("IMAGE URL:", p.imageUrl);
  console.log("FINAL SRC:", src);

  const available = typeof p.stock === "number" ? p.stock : p.inStock ? 999 : 0;

  return (
    <div
      onClick={(e) => {
        if (e.target.closest("button")) return;
        navigate(`/product/${p.id}`);
      }}
      className="group bg-white rounded-[1.2rem] border border-gray-100 p-2.5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col gap-2.5 animate-fade-in relative overflow-hidden active:scale-[0.98] cursor-pointer"
    >
      {p.offerPrice && (
        <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-100">
          -{Math.max(0, Math.round(100 - (price / p.price) * 100))}%
        </div>
      )}

      <a
        href={`#/product/${p.id}`}
        className="relative block aspect-[4/3] rounded-[1rem] bg-gray-50 overflow-hidden group-hover:bg-emerald-50 transition-colors duration-500"
      >
        <div className="relative w-full h-full">
          {src ? (
            <img
              src={src}
              alt={p.name}
              onError={(e) => {
                console.error("IMAGE LOAD FAILED:", src);
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-gray-300 uppercase tracking-widest italic">
              No Visual
            </div>
          )}
        </div>

        {available <= 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
              Out of Stock
            </span>
          </div>
        )}
      </a>

      <div className="flex-1 flex flex-col px-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic">
            Premium Tier
          </span>

          <div className="flex items-center gap-1">
  <svg
    className="w-2.5 h-2.5 text-amber-400"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>

  <span className="text-[9px] font-black text-gray-400">
    {p.averageRating?.toFixed(1) || "0.0"}
  </span>

  <span className="text-[8px] text-gray-300">
    ({p.reviewCount || 0})
  </span>
</div>
        </div>

        <a
          href={`#/product/${p.id}`}
          className="text-xs font-black text-gray-900 leading-tight mb-1.5 group-hover:text-emerald-600 transition-colors line-clamp-1"
        >
          {p.name}
        </a>

        <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none mb-0.5">
              Price
            </span>

            <div className="flex items-baseline gap-1">
              <span className="text-base font-black text-gray-900 tracking-tighter tabular-nums">
                ₹{price}
              </span>

              {p.offerPrice && (
                <span className="text-[10px] font-bold text-gray-300 line-through">
                  ₹{p.price}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center bg-gray-50 rounded-md p-0.5 border border-gray-100">
            <button
              disabled={available <= 0}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-5 h-5 rounded bg-white shadow-sm flex items-center justify-center font-black text-gray-800"
            >
              -
            </button>

            <span className="w-5 text-center font-black text-[9px] text-gray-900">
              {qty}
            </span>

            <button
              disabled={available <= 0}
              onClick={() =>
                setQty((q) => Math.min(available || Infinity, q + 1))
              }
              className="w-5 h-5 rounded bg-white shadow-sm flex items-center justify-center font-black text-gray-800"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            console.log("ADDING PRODUCT:", p);
            onAdd(p, qty, false);
          }}
          disabled={available <= 0}
          className={`w-full mt-3 py-2.5 rounded-md font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all ${
            available <= 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-emerald-600 text-white hover:bg-gray-900"
          }`}
        >
          QUICK ADD
        </button>
      </div>
    </div>
  );
}
