import { assets } from "../assets/greencart/greencart_assets/assets";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import ProductCard from "./ProductCard";
import { } from "../assets/greencart/greencart_assets/assets";

export default function ProductGrid({ onAdd, searchQuery = "" }) {
  const [list, setList] = useState([]);

useEffect(() => {
  api("/products")
    .then((res) => {
      const arr = Array.isArray(res)
        ? res
        : (res.products || []);

      console.log("BACKEND PRODUCTS:", arr);

      setList(arr);
    })
    .catch((err) => {
      console.error("PRODUCT API FAILED:", err);
      setList([]);
    });
}, []);

  const q = searchQuery.trim().toLowerCase();
  const products = q
    ? list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    : list.slice(0, 12);

  return (
    <section className="bg-white py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
          <div className="animate-fade-in text-center md:text-left w-full md:w-auto">
            <span className="text-emerald-600 font-extrabold tracking-[0.2em] text-[8px] uppercase bg-emerald-50 px-3 py-1 rounded-full italic">High Frequency Selection</span>
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 mt-3 tracking-tighter italic">Bestselling Curations</h2>
          </div>
          <a href="#/all-products" className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-emerald-600 transition-colors flex items-center justify-center md:justify-start gap-2 pb-1.5 border-b border-transparent hover:border-emerald-600">
            Explore Full Gallery
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </section>
  );
}

