import { useEffect, useState } from "react";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";

export default function Category({ name = "Vegetables", onAdd, searchQuery = "" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api("/products")
      .then((res) => {
        const arr = Array.isArray(res) ? res : (res.products || []);
        setItems(arr);
        console.log("Products:", arr);
console.log("Category Name:", name); // Only use real products from DB
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [name]);

  const q = searchQuery.trim().toLowerCase();

  const list = items
  .filter(
    (p) =>
      p.category?.toLowerCase() ===
      name?.toLowerCase()
  )
    .filter((p) =>
      q
        ? (p.name || "").toLowerCase().includes(q)
        : true
    );

  const prettyName =
    name === "Vegetables"
      ? "Organic Harvest"
      : name === "Fruits"
      ? "Seasonal Fruits"
      : name === "Drinks"
      ? "Artisan Beverages"
      : name === "Bakery"
      ? "Fresh From Oven"
      : name === "Grains"
      ? "Cereals & Pulses"
      : name;

  if (loading) {
    return (
      <div className="p-20 text-center font-black animate-pulse text-gray-200 uppercase tracking-[0.3em]">
        Filtering Selection...
      </div>
    );
  }

  return (
    <section className="bg-white py-6 md:py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b-2 border-emerald-600 pb-4 animate-fade-in">
          <div>
            <span className="text-emerald-600 font-extrabold tracking-[0.2em] text-[10px] uppercase bg-emerald-50 px-3 py-1.5 rounded-full italic">
              Niche Archive
            </span>

            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mt-4 tracking-tighter italic">
              {prettyName}
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-full border border-gray-100">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {list.length} Curated Items
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {list.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              onAdd={onAdd}
            />
          ))}
        </div>

        {list.length === 0 && (
          <div className="text-center py-40 animate-fade-in">
            <div className="text-gray-100 text-9xl font-black tracking-tighter italic mb-4">
              Void.
            </div>

            <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">
              No entries found in this sector.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}