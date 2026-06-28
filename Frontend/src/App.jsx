import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import ProductGrid from "./components/ProductGrid";
import FeatureBanner from "./components/FeatureBanner";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import Category from "./pages/Category";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import AllProducts from "./pages/AllProducts";
import Product from "./pages/Product";
import Address from "./pages/Address";
import SellerDashboard from "./pages/SellerDashboard";
import { api, getToken } from "./lib/api";
import { navigate, currentPath } from "./lib/router";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import UserDashboard from "./pages/UserDashboard";
import Recipes from "./pages/Recipes";
import AdminRecipes from "./pages/AdminRecipes";
import RecipeView from "./pages/RecipeView";
import VerifyOtp from "./pages/VerifyOtp";

export default function App() {
  const [cart, setCart] = useState({});
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState(() => currentPath());
  const [search, setSearch] = useState("");
  const [validIds, setValidIds] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, [route]);
  useEffect(() => {
    const onPop = () => setRoute(currentPath());
    window.addEventListener("popstate", onPop);
    // Global link interceptor for SPA navigation
    function onDocClick(e) {
      const a = e.target.closest && e.target.closest("a[href]");
      if (a && !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        const href = a.getAttribute("href") || "";
        const target = a.getAttribute("target");
        
        // Handle both legacy hash links and new absolute paths
        if (href.startsWith("#/") || (href.startsWith("/") && (!target || target === "_self"))) {
          e.preventDefault();
          const path = href.startsWith("#/") ? href.slice(1) : href;
          navigate(path);
        }
      }
    }
    document.addEventListener("click", onDocClick);
    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onDocClick);
    };
  }, []);
  useEffect(() => {
    if (search.trim()) {
      navigate("/all-products");
    }
  }, [search]);
  useEffect(() => {
    api("/products").then((res) => {
  const arr = Array.isArray(res) ? res : (res.products || []);
  const set = new Set(arr.map((p) => p.id));
  setValidIds(set);
    }).catch(() => setValidIds(new Set()));
  }, []);
  const count = Object.entries(cart).reduce((sum, [id, qty]) => {
    if (validIds && !validIds.has(id)) return sum;
    return sum + qty;
  }, 0);
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    setCart({});
    navigate("/auth");
  }
  const [toast, setToast] = useState({ show: false, msg: "" });
  function showToast(msg) {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  }
  function handleAdd(p, qty = 1, goToCart = false) {
    if (!getToken()) { navigate("/auth"); return; }
    const requested = Math.max(1, Math.floor(Number(qty) || 1));
    const inCart = cart[p?.id] || 0;
    const available = p?.stock ?? 999;
    
    // Check how many more we can add without exceeding stock
    const canAdd = Math.max(0, available - inCart);
    const finalQty = Math.min(requested, canAdd);

    if (finalQty <= 0) {
      if (available <= 0) {
        showToast("Sorry, this item is out of stock.");
      } else {
        showToast(`Full stock (${available}) already in cart.`);
      }
      return;
    }

    if (finalQty < requested) {
      showToast(`Stock limit: adding ${finalQty} more unit(s).`);
    }

    setCart((c) => ({ ...c, [p.id]: (c[p.id] || 0) + finalQty }));
    api("/cart/add", { method: "POST", body: { productId: p.id, quantity: finalQty }, auth: true })
      .then(() => {
        if (goToCart) navigate("/cart");
        else showToast("Item added successfully");
      })
      .catch((e) => {
          // If server fails, revert local state
          setCart(c => {
              const n = { ...c };
              n[p.id] = (n[p.id] || 0) - finalQty;
              if (n[p.id] <= 0) delete n[p.id];
              return n;
          });
          showToast(e.message || "Failed to add to cart");
      });
  }
  function inc(p) {
    if (!getToken()) { navigate("/auth"); return; }
    const inCart = cart[p?.id] || 0;
    const available = p?.stock ?? 999;
    
    if (inCart >= available) {
      showToast("Maximum stock reached");
      return;
    }

    setCart((c) => ({ ...c, [p.id]: (c[p.id] || 0) + 1 }));
    api("/cart/add", { method: "POST", body: { productId: p.id, quantity: 1 }, auth: true }).catch(() => {
        setCart(c => {
            const n = { ...c };
            n[p.id] = (n[p.id] || 1) - 1;
            if (n[p.id] <= 0) delete n[p.id];
            return n;
        });
    });
  }
  function dec(p) {
    if (!getToken()) { navigate("/auth"); return; }
    setCart((c) => { const q = (c[p.id] || 0) - 1; const n = { ...c }; if (q <= 0) delete n[p.id]; else n[p.id] = q; return n; });
   const itemId = cartItemIds[p.id];
if (!itemId) return;
api(`/cart/item/${itemId}`, { method: "PUT", body: { qty: Math.max(0, (cart[p.id] || 1) - 1) }, auth: true }).catch(() => { });
  }
  function remove(p) {
    if (!getToken()) { navigate("/auth"); return; }
    setCart((c) => { const n = { ...c }; delete n[p.id]; return n; });
    const itemId = cartItemIds[p.id];
if (!itemId) return;
api(`/cart/item/${itemId}`, { method: "DELETE", auth: true })
      .then(() => showToast("Item removed successfully"))
      .catch((e) => showToast(e.message || "Failed to remove item"));
  }
  function clearCart() {
    setCart({});
  }
  const isHome = route === "/" || route === "";
  const [cartItemIds, setCartItemIds] = useState({});

const refreshCart = () => {
  const t = getToken();
  if (!t) return;
  api("/cart", { auth: true }).then(res => {
    const mapped = {};
    const ids = {};
    res.items.forEach(i => {
      const pid = i.product?.id;
      mapped[pid] = i.qty;
      ids[pid] = i.id;
    });
    setCart(mapped);
    setCartItemIds(ids);
  }).catch(() => { });
};
  useEffect(() => {
    const t = getToken();
    if (t) {
      api("/auth/me", { auth: true })
        .then((me) => { setUser(me); return api("/cart", { auth: true }); })
        .then((res) => {
  const mapped = {};
  const ids = {};
  res.items.forEach(i => {
    const pid = i.product?.id;
    mapped[pid] = i.qty;
    ids[pid] = i.id;
  });
  setCart(mapped);
  setCartItemIds(ids);
})
        .catch(() => {
          setUser(null);
          navigate("/auth");
        });
    }
  }, []);
  useEffect(() => {
    const t = getToken();
    if (t) {
      api("/auth/me", { auth: true })
        .then((me) => setUser(me))
        .catch(() => setUser(null));
    } else {
      setUser(null);
      // Protect sensitive routes
      const protectedRoutes = ["/cart", "/orders", "/profile", "/address", "/dashboard", "/seller", "/delivery", "/recipes-admin"];
      if (protectedRoutes.some(r => route.startsWith(r))) {
        navigate("/auth");
      }
    }
  }, [route]);
  useEffect(() => {
    if (!user) return;
    if ((route === "/seller" || route === "/recipes-admin") && !(user.role === "seller" || user.role === "admin")) {
      navigate("/");
    }
    if (route === "/delivery" && user.role !== "delivery") {
      navigate("/");
    }
  }, [route, user]);
  let body = (
    <>
      <Hero />
      <Categories />
      <ProductGrid onAdd={handleAdd} searchQuery={search} />
      <FeatureBanner />
      <Newsletter showToast={showToast} />
    </>
  );
  if (route.startsWith("/category/")) {
    const name = decodeURIComponent(route.replace("/category/", ""));
    body = <Category name={name} onAdd={handleAdd} searchQuery={search} />;
  }
  if (route === "/cart") {
    body = <Cart cart={cart} onInc={inc} onDec={dec} onRemove={remove} onClearCart={clearCart} />;
  }
  if (route === "/auth") {
  if (user) {
    navigate("/");
  } else {
    body = <Auth />;
  }
}
  if (route === "/forgot") {
    body = <ForgotPassword />;
  }

  if (route === "/verify-otp") {
  body = <VerifyOtp />;
}
  if (route === "/profile") {
    body = <Profile user={user} setUser={setUser} />;
  }
  if (route === "/all-products") {
    body = <AllProducts onAdd={handleAdd} searchQuery={search} />;
  }
  if (route.startsWith("/product/")) {
    const id = route.replace("/product/", "");
    body = <Product id={id} onAdd={handleAdd} />;
  }
  if (route === "/address") {
    body = <Address />;
  }
  if (route === "/seller") {
    body = <SellerDashboard />;
  }
  if (route === "/orders") {
    body = <Orders />;
  }
  if (route === "/recipes") {
    body = <Recipes />;
  }
  if (route === "/recipes-admin") {
    body = <AdminRecipes />;
  }
  if (route.startsWith("/recipe/")) {
    const id = route.replace("/recipe/", "");
    body = <RecipeView id={id} onRefreshCart={refreshCart} showToast={showToast} />;
  }
  if (route === "/delivery") {
    body = <DeliveryDashboard />;
  }
  if (route === "/dashboard") {
    body = <UserDashboard />;
  }
  return (
    <>
      <Header cartCount={count} searchQuery={search} setSearch={setSearch} user={user} onLogout={logout} />
      {body}
      {toast.show && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 011.414 1.414z" /></svg>
            <span className="font-semibold">{toast.msg}</span>
            <button onClick={() => navigate("/cart")} className="ml-2 bg-emerald-700 hover:bg-emerald-800 text-xs px-2 py-1 rounded-lg transition-colors">View Cart</button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
