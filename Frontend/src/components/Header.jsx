import { useEffect, useRef, useState } from "react";
import { assets } from "../assets/greencart/greencart_assets/assets";
import { api, fileUrl } from "../lib/api";
import { navigate } from "../lib/router";

export default function Header({ cartCount = 0, searchQuery = "", setSearch, user, onLogout }) {
  const [open, setOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [products, setProducts] = useState([]);
  const wrapRef = useRef(null);

  useEffect(() => {
  const onScroll = () => setIsScrolled(window.scrollY > 20);
  window.addEventListener("scroll", onScroll);

  function onDocClick(e) {
    if (!wrapRef.current) return;

    if (
      !wrapRef.current.contains(e.target) &&
      !e.target.closest('.mobile-drawer') &&
      !e.target.closest('.search-overlay')
    ) {
      setOpen(false);
      setMobileSearch(false);
    }
  }

  document.addEventListener("mousedown", onDocClick);

  // ADD THIS BLOCK
  api("/products")
    .then((res) => {
      const arr = Array.isArray(res)
        ? res
        : (res.products || []);

      setProducts(arr);
    })
    .catch(console.error);

  return () => {
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("mousedown", onDocClick);
  };
}, []);

  const q = searchQuery.trim().toLowerCase();
  const suggestions = q
  ? products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    )
  : [];

  return (
    <header className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
  isScrolled
    ? "bg-white/80 backdrop-blur-xl border-b border-emerald-100 shadow-lg py-2"
    : "bg-white/70 backdrop-blur-xl border-b border-gray-100 py-4"
}`}>
      <div className="mx-auto max-w-7xl w-full px-4 md:px-6 flex items-center justify-between" ref={wrapRef}>
        <div className="flex items-center gap-4 lg:gap-10">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="shrink-0">
            <img src={assets.logo} alt="GreenCart" className="h-8 md:h-10 hover:scale-105 transition-all duration-300 drop-shadow-sm" />
          </a>

          <nav className="hidden lg:flex items-center gap-6">
            {[
              { name: "Home", path: "/" },
              { name: "All Products", path: "/all-products" },
              { name: "Orders", path: "/orders" },
              { name: "Recipes", path: "/recipes" },
              ...(user?.role === "seller" || user?.role === "admin"
                ? [
                  { name: "Seller Hub", path: "/seller" },
                  { name: "Manage Recipes", path: "/recipes-admin" },
                ]
                : []),
              ...(user?.role === "delivery"
                ? [{ name: "Delivery Hub", path: "/delivery" }]
                : []),
            ].map((item) => (
              <a
                key={item.name}
                href={item.path}
                onClick={(e) => { e.preventDefault(); navigate(item.path); }}
                className="relative text-[11px]
font-black
uppercase
tracking-[0.12em]
text-gray-500
hover:text-emerald-600
transition-all
duration-300
after:absolute
after:left-0
after:-bottom-2
after:h-[2px]
after:w-0
after:bg-emerald-500
after:transition-all
hover:after:w-full
"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          {/* Search Bar */}
          <div className="hidden lg:flex items-center gap-2.5 bg-white rounded-full px-5 py-3
shadow-lg shadow-emerald-50
border border-emerald-100
hover:shadow-xl
focus-within:shadow-xl
transition-all w-[320px] relative border border-transparent focus-within:border-emerald-200 focus-within:bg-white transition-all">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              placeholder="Search fruits, vegetables, dairy..."
              className="w-full outline-none bg-transparent text-[11px] font-bold placeholder-gray-300"
              value={searchQuery}
              onChange={(e) => { setSearch?.(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {q && showSuggestions && (
              <div className="absolute left-0 right-0 top-full mt-4 bg-white border border-gray-100 rounded-3xl shadow-2xl z-50 p-4 max-h-80 overflow-auto animate-fade-in">
                {suggestions.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No match found</p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {suggestions.map((p) => (
                      <button
                        key={p.id}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowSuggestions(false);
                          navigate(`/product/${p.id}`);
                        }}
                        className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-emerald-50 transition-colors group text-left"
                      >
                        <div className="w-10 h-10 bg-gray-50 rounded-xl overflow-hidden p-1">
                          <img
  src={p.imageUrl ? fileUrl(p.imageUrl) : assets.logo}
  alt={p.name}
  className="w-full h-full object-contain mix-blend-multiply"
/>
                        </div>
                        <span className="text-sm font-bold text-gray-700 group-hover:text-emerald-700">{p.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 md:gap-5">
            {/* Mobile Search Toggle */}
            <button
              className="lg:hidden p-2 rounded-xl bg-gray-50 text-gray-900 border border-gray-100"
              onClick={() => setMobileSearch(!mobileSearch)}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>

            {user ? <Dropdown user={user} onLogout={onLogout} /> : (
              <a href="/auth" className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-100 italic">
                Get Started
              </a>
            )}

            <a
              href="/cart"
              onClick={(e) => { e.preventDefault(); navigate("/cart"); }}
              className="group relative flex items-center justify-center p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white
hover:scale-110 hover:bg-emerald-600 transition-all shadow-xl shadow-gray-200"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-lg md:rounded-xl bg-emerald-500 text-white text-[10px] font-black border-2 border-white">{cartCount}</span>
              )}
            </a>

            <button
              className="lg:hidden p-2 rounded-xl bg-gray-900 text-white"
              onClick={() => setOpen(!open)}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearch && (
        <div className="search-overlay lg:hidden absolute top-full inset-x-0 bg-white border-t border-gray-100 p-4 shadow-xl animate-fade-in z-[110]">
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 border border-emerald-100 shadow-inner">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              autoFocus
              placeholder="Searching for fresh goods..."
              className="w-full bg-transparent outline-none text-xs font-bold"
              value={searchQuery}
              onChange={(e) => setSearch?.(e.target.value)}
            />
            <button onClick={() => setMobileSearch(false)}>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      <div className={`mobile-drawer fixed inset-y-0 right-0 w-[90%] sm:w-full sm:max-w-sm bg-white shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] z-[200] transform transition-all duration-500 ease-in-out lg:hidden ${open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
        <div className="h-full flex flex-col p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <img src={assets.logo} alt="" className="h-5 sm:h-6" />
            <button onClick={() => setOpen(false)} className="p-2 bg-gray-100 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="space-y-6">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4 opacity-50 italic">Fleet Navigation</div>
            {[
              { name: "Home", path: "/" },
              { name: "All Store Products", path: "/all-products" },
              { name: "Order History", path: "/orders" },
              { name: "Master Recipes", path: "/recipes" },
              ...(user?.role === "seller" || user?.role === "admin"
                ? [
                  { name: "Seller Command", path: "/seller" },
                  { name: "Recipe Admin", path: "/recipes-admin" },
                ]
                : []),
              ...(user?.role === "delivery"
                ? [{ name: "Logistics Hub", path: "/delivery" }]
                : []),
            ].map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="block text-2xl font-black text-gray-900 hover:text-emerald-600 hover:translate-x-2 transition-all"
                onClick={(e) => { e.preventDefault(); navigate(item.path); setOpen(false); }}
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-gray-50">
            {!(user?.role === "seller" || user?.role === "admin" || user?.role === "delivery") ? (
              <a
                href="/auth"
                className="flex items-center gap-3 text-lg font-black text-emerald-600 italic"
                onClick={(e) => { e.preventDefault(); navigate("/auth"); setOpen(false); }}
              >
                Unlock Partner Potential
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </a>
            ) : (
              <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Logged in as {user?.role}</div>
            )}
          </div>
        </div>
      </div>
      {open && <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[190] animate-fade-in lg:hidden" onClick={() => setOpen(false)}></div>}
    </header>
  );
}

function Dropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative isolate" ref={ref}>
      <button
        className="flex items-center gap-3 p-2 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-100 border border-emerald-100 shadow-md hover:shadow-lg transition-all"
        onClick={() => setOpen(!open)}
      >
        <img
          src={user.avatarUrl ? fileUrl(user.avatarUrl) : assets.profile_icon}
          alt=""
          className="w-8 h-8 md:w-10 md:h-10 rounded-xl object-cover bg-white"
          onError={(e) => { e.currentTarget.src = assets.profile_icon; }}
        />
        <div className="hidden sm:block text-left mr-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none">Healthy Chef</p>
          <p className="text-xs font-black text-gray-800 tracking-tight">{user.name || "Explorer"}</p>
        </div>
      </button>
      {open && (
        <div className="absolute right-0 mt-4 w-52 rounded-[2rem] bg-white shadow-2xl border border-gray-100 p-2.5 animate-bounce-in z-[300]">
          <a
            href="/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            onClick={(e) => { e.preventDefault(); navigate("/profile"); setOpen(false); }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Account
          </a>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
