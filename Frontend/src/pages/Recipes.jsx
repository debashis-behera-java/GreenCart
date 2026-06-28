import { useEffect, useState } from "react";
import { api, fileUrl } from "../lib/api";

export default function Recipes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/recipes")
      .then((res) => setItems(res.recipes || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#fcfdfd] py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-600">
              Culinary Collection
            </span>
            <h1 className="mt-4 text-5xl font-black tracking-tight text-gray-900">
              Gourmet Recipes
            </h1>
            <p className="mt-2 text-lg font-medium text-gray-500">
              Chef-curated ingredients delivered to your doorstep
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
            <span className="px-4 text-sm font-bold text-gray-400">
              {items.length} Masterpieces
            </span>
          </div>
        </div>

        {/* Featured Collection Banner */}
        <div className="relative mb-10 overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 p-4 text-white shadow-[0_20px_60px_rgba(16,185,129,0.25)]">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-20 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.3em]">
              Featured Collection
            </p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Farm Fresh Recipes
            </h2>
            <p className="mt-4 max-w-xl text-white/80">
              Discover chef-crafted recipes made with ingredients available
              directly from GreenCart.
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { value: items.length, label: "Recipes" },
            { value: "100%", label: "Organic" },
            { value: "Fresh", label: "Ingredients" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <h2 className="text-3xl font-black">{item.value}</h2>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {items.map((r) => (
            <a
              key={r.id}
              href={`#/recipe/${r.id}`}
              className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-4 hover:scale-[1.02] hover:shadow-[0_35px_80px_rgba(16,185,129,0.25)]"
            >
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-emerald-100 opacity-0 blur-3xl transition-all duration-700 group-hover:opacity-100" />
              
              <div className="relative h-48 overflow-hidden">
                <img
                  src={fileUrl(r.imageUrl)}
                  alt={r.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2"
                />
                <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/20" />
                
                <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[9px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md">
                  Chef Special
                </div>
                <div className="absolute top-4 right-4 rounded-full bg-amber-400 px-3 py-1 text-[9px] font-black text-white">
                  ⭐ 4.9
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-1.5 truncate text-xl font-black uppercase tracking-tight text-gray-900 transition-colors group-hover:text-emerald-600">
                  {r.name}
                </h3>
                <p className="mb-4 line-clamp-2 font-medium italic leading-relaxed text-gray-500 text-[10px]">
                  {r.instructions || "Unlock the potential of these fresh ingredients..."}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">
                      {r.serves} Serves
                    </span>
                    <div className="mt-1 text-[8px] font-black uppercase tracking-widest text-emerald-600">
                      Premium Recipe
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-600">
                    <span>Explore</span>
                    <svg className="h-3 w-3 transition-transform group-hover:translate-x-2 group-hover:scale-125" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="rounded-[3rem] border border-dashed border-gray-200 bg-white py-20 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
              <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-400">Our chef is currently drafting new recipes...</h2>
            <p className="mt-1 font-black uppercase tracking-tighter text-gray-300 text-sm">Coming Soon</p>
          </div>
        )}
      </div>
    </section>
  );
}