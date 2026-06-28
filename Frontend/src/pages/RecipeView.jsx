import { useEffect, useState } from "react";
import { api, fileUrl, getToken } from "../lib/api";

export default function RecipeView({ id, onRefreshCart, showToast }) {
  const [r, setR] = useState(null);
  const [serves, setServes] = useState(1);
  const [selected, setSelected] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function normName(x) {
    const s = String(x || "").toLowerCase().trim().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ");
    return s.endsWith("s") && s.length > 3 ? s.slice(0, -1) : s;
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([api(`/recipes/${id}`), api("/products")])
      .then(([res, p]) => {
        setR(res.recipe);
        setProducts(p.products || []);
        
        const map = new Map((p.products || []).map(pr => [normName(pr.name), pr]));
        const sel = {};
        (res.recipe.ingredients || []).forEach(i => {
          const pid = i.productId || map.get(normName(i.name))?.id;
          if (pid) sel[pid] = true;
        });
        setSelected(sel);
        setServes(res.recipe.serves || 1);
      })
      .catch(() => { setR(null); setProducts([]); })
      .finally(() => setLoading(false));
  }, [id]);

  const toggleIngredient = (pid) => setSelected(prev => ({ ...prev, [pid]: !prev[pid] }));

  async function addSelected() {
    if (!getToken()) { window.location.hash = "#/auth"; return; }
    const toAdd = Object.entries(selected).filter(([_, checked]) => checked);
    if (toAdd.length === 0) { showToast("Please select at least one ingredient"); return; }

    try {
      for (const [pid, _] of toAdd) {
        await api("/cart/add", { method: "POST", body: { productId: pid, quantity: 1 }, auth: true });
      }
      onRefreshCart?.();
      showToast("Ingredients added to your cart!");
    } catch (e) { showToast(e.message || "Failed to add products"); }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-pulse space-y-4 w-full max-w-2xl px-4"><div className="h-64 bg-gray-100 rounded-[3rem]"></div></div></div>;
  if (!r) return <div className="p-20 text-center font-bold text-gray-400">Recipe not found</div>;

  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <div className="bg-white min-h-screen">
      <div className="relative h-[60vh] overflow-hidden">
        <img src={fileUrl(r.imageUrl)} alt={r.name} className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-[4000ms]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
        
        {/* Hero Title Section - Blur Removed */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 text-center">
          <div className="flex justify-center gap-4 mb-4">
            <span className="bg-emerald-600 text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-200">Featured Recipe</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter mb-4 drop-shadow-none">
            {r.name}
          </h1>
          <div className="flex justify-center gap-4 mt-6">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl px-6 py-3 shadow-xl">🍽 {serves} Serves</div>
            <div className="bg-white/90 backdrop-blur-md rounded-2xl px-6 py-3 shadow-xl">🥬 {r.ingredients.length} Ingredients</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 py-12">
        <div className="lg:col-span-7 space-y-12">
          <section>
            <div className="flex items-end justify-between mb-8 border-b-4 border-gray-900 pb-4">
              <h2 className="text-4xl font-black text-gray-900 italic flex items-center gap-4">
                The Ingredients 
                <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-black">{selectedCount} Selected</span>
              </h2>
            </div>

            <div className="grid gap-3">
              {r.ingredients.map((ing, idx) => {
                const pid = ing.productId || products.find(pr => normName(pr.name).includes(normName(ing.name)))?.id;
                const prod = products.find(pr => pr.id === pid);
                const available = !!prod && (prod.stock ?? 0) > 0;
                const isSelected = !!selected[pid];

                return (
                  <div key={idx} onClick={() => available && toggleIngredient(pid)} className={`group relative flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${!available ? 'opacity-40 grayscale' : isSelected ? 'border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-100' : 'border-gray-50 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-white border-2 border-gray-100'}`}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </div>
                      <div>
                        <h4 className="font-black text-base text-gray-900">{ing.name}</h4>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="sticky bottom-6 z-50 mt-10">
              <button onClick={addSelected} disabled={selectedCount === 0} className={`w-full py-6 rounded-[2.5rem] font-black text-xl transition-all shadow-2xl ${selectedCount === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:scale-105 hover:shadow-2xl hover:shadow-emerald-200'}`}>
                ADD {selectedCount} GOURMET INGREDIENTS
              </button>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-20 space-y-12">
            <section className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black italic">Chef's Method</h2>
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center font-black text-xl">{r.instructions?.split('\n').length || 0}</div>
              </div>
              <div className="space-y-8">
                {r.instructions?.split('\n').map((step, i) => (
                  <div key={i} className="flex gap-6 group relative pl-2">
                    <div className="absolute left-4 top-12 bottom-0 w-[2px] bg-white/10" />
                    <span className="text-4xl font-black text-emerald-500/30 group-hover:text-emerald-500 transition-colors z-10 bg-gray-900 pr-2">0{i+1}</span>
                    <p className="text-gray-300 font-medium leading-relaxed group-hover:text-white transition-colors">{step}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}