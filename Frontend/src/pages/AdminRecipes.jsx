import { useEffect, useState } from "react";
import { api, apiForm, fileUrl } from "../lib/api";

export default function AdminRecipes() {
  const [name, setName] = useState("");
  const [serves, setServes] = useState(1);
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState([
    { qtyPerServe: 100, unit: "g", name: "" },
  ]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState("");
  const [edit, setEdit] = useState(null);

  async function load() {
    try {
      const r = await api("/recipes");
      setList(r.recipes || []);
    } catch {
      setList([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function setIng(i, patch) {
    setIngredients((list) =>
      list.map((x, idx) => (idx === i ? { ...x, ...patch } : x))
    );
  }

  function addIng() {
    setIngredients((list) => [
      ...list,
      { qtyPerServe: 100, unit: "g", name: "" },
    ]);
  }

  function removeIng(i) {
    setIngredients((list) => list.filter((_, idx) => idx !== i));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("serves", String(serves));
      fd.append("prepTime", prepTime);
      fd.append("cookTime", cookTime);
      fd.append("instructions", instructions);
      fd.append(
        "ingredients",
        JSON.stringify(
          ingredients.map((i) => ({
            name: i.name,
            unit: i.unit,
            qtyPerServe: Number(i.qtyPerServe || 0),
          }))
        )
      );
      if (image) fd.append("file", image);
      await apiForm("/recipes", fd, { auth: true });
      setName("");
      setServes(1);
      setPrepTime("");
      setCookTime("");
      setInstructions("");
      setIngredients([{ qtyPerServe: 100, unit: "g", name: "" }]);
      setImage(null);
      setPreview(null);
      await load();
      alert("Recipe created successfully!");
    } catch (e) {
      alert(e.message || "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Floating Action Button */}
        <button
          onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-emerald-600 text-white text-3xl shadow-2xl hover:scale-110 transition-all"
        >
          +
        </button>

        <header className="space-y-6">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative overflow-hidden bg-white rounded-3xl p-4 shadow-sm border">
              <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-100 rounded-full translate-x-8 -translate-y-8" />
              <p className="text-xs text-gray-500">Recipes</p>
              <h2 className="text-3xl font-black">{list.length}</h2>
            </div>
            <div className="relative overflow-hidden bg-emerald-50 rounded-3xl p-4 border">
              <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-200 rounded-full translate-x-8 -translate-y-8" />
              <p className="text-xs text-emerald-600">Published</p>
              <h2 className="text-4xl font-black text-emerald-600">
                {list.length}
              </h2>
            </div>
            <div className="relative overflow-hidden bg-orange-50 rounded-3xl p-4 border">
              <div className="absolute right-0 top-0 w-24 h-24 bg-orange-200 rounded-full translate-x-8 -translate-y-8" />
              <p className="text-xs text-orange-600">Ingredients</p>
              <h2 className="text-4xl font-black text-orange-600">
                {list.reduce((a, b) => a + (b.ingredients?.length || 0), 0)}
              </h2>
            </div>
            <div className="relative overflow-hidden bg-purple-50 rounded-3xl p-4 border">
              <div className="absolute right-0 top-0 w-24 h-24 bg-purple-200 rounded-full translate-x-8 -translate-y-8" />
              <p className="text-xs text-purple-600">Avg Serves</p>
              <h2 className="text-4xl font-black text-purple-600">
                {Math.round(
                  list.reduce((a, b) => a + b.serves, 0) / (list.length || 1)
                )}
              </h2>
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
              Recipe Studio
            </h1>
            <p className="text-gray-500 mt-1">
              Design and manage your culinary masterpieces
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>{" "}
                Create New Recipe
              </h2>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 block mb-2 uppercase tracking-wider">
                      Title
                    </label>
                    <input
                      className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                      placeholder="Dish Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2 uppercase tracking-wider">
                      Serves
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={serves}
                      onChange={(e) => setServes(Number(e.target.value || 1))}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2 uppercase tracking-wider">
                        Prep (min)
                      </label>
                      <input
                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500"
                        value={prepTime}
                        onChange={(e) => setPrepTime(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2 uppercase tracking-wider">
                        Cook (min)
                      </label>
                      <input
                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500"
                        value={cookTime}
                        onChange={(e) => setCookTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Ingredients
                    </label>
                    <button
                      type="button"
                      onClick={addIng}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full transition-colors"
                    >
                      + Add More
                    </button>
                  </div>
                  <div className="space-y-2">
                    {ingredients.map((ing, i) => (
                      <div
                        key={i}
                        className="flex flex-wrap md:flex-nowrap gap-3 items-center bg-white hover:bg-emerald-50 hover:border-emerald-200 hover:shadow-md p-3 rounded-xl border border-gray-100 transition-all duration-300"
                      >
                        <input
                          className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm"
                          placeholder="Ingredient name"
                          value={ing.name}
                          onChange={(e) => setIng(i, { name: e.target.value })}
                          required
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            className="w-24 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm text-center"
                            placeholder="Qty"
                            value={ing.qtyPerServe}
                            onChange={(e) =>
                              setIng(i, {
                                qtyPerServe: Number(e.target.value || 0),
                              })
                            }
                          />
                          <select
                            className="bg-gray-50 border-none rounded-xl px-3 py-2 text-sm font-medium"
                            value={ing.unit}
                            onChange={(e) => setIng(i, { unit: e.target.value })}
                          >
                            {["g", "kg", "ml", "l", "pcs", "tsp", "tbsp"].map(
                              (u) => (
                                <option key={u} value={u}>
                                  {u}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeIng(i)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2 uppercase tracking-wider">
                    Method / Instructions
                  </label>
                  <textarea
                    rows="3"
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 transition-all font-medium leading-relaxed"
                    placeholder="Write the preparation steps here..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2 uppercase tracking-wider">
                    Recipe Cover Image
                  </label>

                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;

                        setImage(f);

                        if (f) {
                          setPreview(URL.createObjectURL(f));
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />

                    <div className="border-2 border-dashed border-emerald-200 rounded-2xl p-4 bg-emerald-50/30 hover:bg-emerald-50 transition">
                      <div className="flex items-center gap-4">
                        {preview ? (
                          <img
                            src={preview}
                            alt=""
                            className="w-24 h-24 rounded-xl object-cover shadow"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center text-3xl">
                            📷
                          </div>
                        )}

                        <div>
                          <p className="font-bold text-gray-700">
                            Upload Recipe Image
                          </p>
                          <p className="text-sm text-gray-500">JPG, PNG, WEBP</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black py-4 rounded-2xl hover:shadow-2xl hover:shadow-emerald-200 hover:-translate-y-1 active:scale-95 transition-all duration-300"
                >
                  {loading ? "PREPARING..." : "PUBLISH RECIPE"}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative mb-4">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                />
              </svg>

              <input
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-500 rounded-full"></span>{" "}
                Recent Gallery
              </h2>
              <div className="grid gap-4">
                {list
                  .filter((r) =>
                    r.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((r) => (
                    <div
                      key={r.id}
                      className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-emerald-300 hover:-translate-y-2 hover:rotate-[1deg] hover:shadow-[0_20px_50px_rgba(16,185,129,0.25)] transition-all duration-500"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black z-20">
                        #{r.id}
                      </div>
                      <div className="flex items-center p-3 gap-4">
                        <img
                          src={fileUrl(r.imageUrl)}
                          alt=""
                          className="w-16 h-16 object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 truncate text-sm">
                            {r.name}
                          </h3>
                          <div className="flex gap-2 mt-2">
                            <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black">
                              {r.serves} Serves
                            </span>
                            <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-600 text-[10px] font-black">
                              {r.ingredients?.length || 0} Items
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400 font-bold mt-1 uppercase">
                            <span>{r.serves} Serves</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          className="bg-white p-2 rounded-xl shadow-lg hover:scale-110 transition-transform"
                          onClick={() => {
                            setEditingId(r.id);
                            setEdit({ ...r, image: null });
                          }}
                        >
                          <svg
                            className="w-4 h-4 text-emerald-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          className="bg-white p-2 rounded-xl shadow-lg hover:scale-110 transition-transform"
                          onClick={async () => {
                            if (!confirm("Are you sure?")) return;
                            try {
                              await api(`/recipes/${r.id}`, {
                                method: "DELETE",
                                auth: true,
                              });
                              await load();
                            } catch (e) {
                              alert(e.message);
                            }
                          }}
                        >
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {editingId && edit && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-gray-900/60 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl max-h-full rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  Modify Masterpiece
                </h2>
                <button
                  onClick={() => setEditingId("")}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <input
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold"
                  value={edit.name}
                  onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                />
                <textarea
                  rows="4"
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-medium"
                  value={edit.instructions}
                  onChange={(e) =>
                    setEdit({ ...edit, instructions: e.target.value })
                  }
                />
              </div>
              <div className="p-8 bg-gray-50 flex justify-end gap-3 rounded-b-[40px]">
                <button
                  onClick={() => setEditingId("")}
                  className="px-6 py-3 font-bold text-gray-500"
                >
                  Discard
                </button>
                <button
                  className="bg-emerald-600 text-white font-black px-10 py-3 rounded-2xl"
                  onClick={async () => {
                    try {
                      const fd = new FormData();
                      fd.append("name", edit.name);
                      fd.append("serves", String(edit.serves));
                      fd.append("instructions", edit.instructions);
                      fd.append(
                        "ingredients",
                        JSON.stringify(edit.ingredients)
                      );
                      await apiForm(`/recipes/${editingId}`, fd, {
                        method: "PUT",
                        auth: true,
                      });
                      setEditingId("");
                      await load();
                      alert("Saved!");
                    } catch (e) {
                      alert(e.message);
                    }
                  }}
                >
                  SAVE MASTERPIECE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}