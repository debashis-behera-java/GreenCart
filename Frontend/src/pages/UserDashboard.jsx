import { useEffect, useState } from "react";
import { api, fileUrl } from "../lib/api";
import { assets } from "../assets/greencart/greencart_assets/assets";

export default function UserDashboard() {
  const [me, setMe] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    Promise.all([
      api("/auth/me", { auth: true }),
      api("/orders/my", { auth: true }),
      api("/recipes")
    ])
      .then(([m, o, r]) => { setMe(m); setOrders(o.orders || []); setRecipes(r.recipes || []); })
      .catch(() => { setMe(null); setOrders([]); setRecipes([]); })
      .finally(() => setLoading(false));
  }, []);
  const delivered = orders.filter((o)=> o.orderStatus==="Delivered").length;
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Dashboard</h1>
        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : (
          <>
            {me && (
              <div className="rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                <img src={me.avatarUrl || assets.profile_icon} alt="" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-gray-800">{me.name || me.email}</div>
                  <div className="text-sm text-gray-600">{me.role?.toUpperCase?.()}</div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-sm text-gray-600">Total Orders</div>
                <div className="text-2xl font-bold text-gray-800">{orders.length}</div>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-sm text-gray-600">Delivered</div>
                <div className="text-2xl font-bold text-gray-800">{delivered}</div>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-sm text-gray-600">Pending</div>
                <div className="text-2xl font-bold text-gray-800">{orders.length - delivered}</div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="text-xl font-bold text-gray-800 mb-3">Recent Orders</div>
              <div className="space-y-3">
                {orders.slice(0, 8).map((o)=>(
                  <div key={o.id} className="flex items-center justify-between gap-3 text-sm">
                    <div className="font-medium text-gray-800">#{o.id}</div>
                    <div className="text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
                    <div className="text-gray-800">₹{ o.total}</div>
                    <div className="text-gray-700">{o.orderStatus}</div>
                    {o.orderStatus === "Delivered" && o.otpVerified ? <div className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">OTP verified</div> : null}
                  </div>
                ))}
                {orders.length === 0 && <div className="text-gray-600 text-sm">No orders yet</div>}
              </div>
              <div className="mt-3">
                <a href="#/orders" className="text-emerald-700">See all orders →</a>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="text-xl font-bold text-gray-800 mb-3">Recipes For You</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {recipes.slice(0,6).map((r)=>(
                  <a key={r.id} href={`#/recipe/${r.id}`} className="rounded-lg border border-gray-200 p-2 hover:shadow">
                    <img src={fileUrl(r.imageUrl)} alt="" className="w-full h-24 object-cover rounded border border-gray-200" />
                    <div className="text-sm font-medium text-gray-800 mt-1">{r.name}</div>
                    <div className="text-xs text-gray-600">Serves: {r.serves}</div>
                  </a>
                ))}
                {recipes.length === 0 && <div className="text-gray-600 text-sm">No recipes yet</div>}
              </div>
              <div className="mt-3">
                <a href="#/recipes" className="text-emerald-700">Browse all recipes →</a>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
