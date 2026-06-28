import { useEffect, useState } from "react";
import { api, apiForm, fileUrl } from "../lib/api";
import { categories } from "../assets/greencart/greencart_assets/assets";

export default function SellerDashboard() {
  const [orders, setOrders] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]?.path || "Vegetables");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api("/seller/orders", { auth: true })
      .then((res) => setOrders(Array.isArray(res) ? res : []))
      .catch(() => setOrders([]));
    api("/products/mine", { auth: true })
      .then((res) => setMyProducts(Array.isArray(res) ? res : []))
      .catch(() => setMyProducts([]));
  }, []);

  const revenue = orders.reduce(
    (sum, o) => sum + (o.paymentStatus === "Paid" ? o.total || 0 : 0),
    0
  );
  const pending = orders.filter((o) => o.orderStatus !== "Delivered").length;
  const [assignOrderId, setAssignOrderId] = useState("");
  const [assignEmail, setAssignEmail] = useState("");
  const [statusOrderId, setStatusOrderId] = useState("");
  const [statusValue, setStatusValue] = useState("Processing");

  async function addProduct(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("category", category);
      fd.append("price", String(price));
      if (offerPrice) fd.append("offerPrice", String(offerPrice));
      if (description) fd.append("description", description);
      if (weight) fd.append("weight", weight);
      if (stock) fd.append("stock", String(stock));

      if (imageFiles.length > 0) {
        fd.append("file", imageFiles[0]);
      }

      await apiForm("/products", fd, { auth: true });
      setName("");
      setCategory(categories[0]?.path || "Vegetables");
      setPrice("");
      setOfferPrice("");
      setDescription("");
      setWeight("");
      setStock("");
      setImageFiles([]);
      const res = await api("/products/mine", { auth: true });

      setMyProducts(Array.isArray(res) ? res : res.products || []);
      alert("Product added");
    } catch (e) {
      alert(e.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-emerald-600 font-black uppercase tracking-widest text-xs">
              Seller Portal
            </p>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight mt-2">
              Welcome Back 👋
            </h1>
            <p className="text-gray-500 mt-3 text-lg">
              Manage products, orders and revenue.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-6 text-white shadow-xl">
            <p className="text-sm uppercase tracking-widest">Revenue</p>
            <h2 className="text-5xl font-black mt-3">₹{revenue}</h2>
          </div>
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-6 text-white shadow-xl">
            <p className="text-sm uppercase tracking-widest">Total Orders</p>
            <h2 className="text-5xl font-black mt-3">{orders.length}</h2>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-6 text-white shadow-xl">
            <p className="text-sm uppercase tracking-widest">Pending Orders</p>
            <h2 className="text-5xl font-black mt-3">{pending}</h2>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
            <p className="text-sm uppercase tracking-widest">Active Products</p>
            <h2 className="text-5xl font-black mt-3">{myProducts.length}</h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={() =>
              document.getElementById("add-product")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all hover:scale-105"
          >
            + Add Product
          </button>
          <button
            onClick={() =>
              window.scrollTo({
                top: 900,
                behavior: "smooth",
              })
            }
            className="bg-white border border-gray-200 hover:border-emerald-500 px-6 py-3 rounded-2xl font-bold shadow-sm transition-all hover:scale-105"
          >
            Manage Orders
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 p-6 shadow-sm bg-white">
          <div className="text-xl font-black text-gray-900 mb-6 italic tracking-tighter">
            Recent Logistics Activity
          </div>

          <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-3 bg-gray-50 rounded-xl mb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <div>Order ID</div>
            <div>Timestamp</div>
            <div>Valuation</div>
            <div className="text-center">Status</div>
            <div className="text-center">Verification</div>
            <div className="text-right">Reference</div>
          </div>

          <div className="space-y-4">
            {orders.slice(0, 10).map((o) => (
              <div
                key={o.id}
                className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center p-4 rounded-xl border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50/10 transition-all group"
              >
                <div
                  className="text-xs font-black text-gray-900 italic cursor-pointer hover:text-emerald-600 transition-colors"
                  onClick={() => {
                    setAssignOrderId(o.id);
                    setStatusOrderId(o.id);
                    window.scrollTo({
                      top:
                        document.body.querySelector("form")?.offsetTop || 1000,
                      behavior: "smooth",
                    });
                  }}
                  title="Click to manage this order"
                >
                  #{String(o.id).padStart(8, "0").toUpperCase()}
                </div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-tight">
                  {new Date(o.createdAt).toLocaleString()}
                </div>
                <div className="text-sm font-black text-gray-900 italic">
                  ₹{o.total || "-"}
                </div>
                <div className="flex justify-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      o.orderStatus === "Delivered"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}
                  >
                    {o.orderStatus || "-"}
                  </span>
                </div>
                <div className="flex justify-center">
                  {o.orderStatus === "Delivered" ? (
                    o.otpVerified ? (
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 italic">
                        SECURE
                      </span>
                    ) : (
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        -
                      </span>
                    )
                  ) : (
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                      -
                    </span>
                  )}
                </div>
                <div className="text-right text-[10px] font-black text-gray-300 group-hover:text-emerald-500 transition-colors">
                  {String(o.id).padStart(8, "0")}
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="py-12 text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] italic">
                No transaction records found in vault
              </div>
            )}
          </div>
          <hr className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                api(`/seller/orders/${assignOrderId}/assign`, {
                  method: "PUT",
                  body: { deliveryEmail: assignEmail },
                  auth: true,
                })
                  .then(() => {
                    alert("Assigned delivery successfully");
                    setAssignOrderId("");
                    setAssignEmail("");
                  })
                  .catch((err) =>
                    alert(err.message || "Failed to assign: check email/role.")
                  );
              }}
              className="space-y-2 bg-blue-50/30 p-4 rounded-xl border border-blue-100"
            >
              <div className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Assign Delivery
              </div>
              <input
                className="w-full border rounded-lg px-3 py-2 bg-white"
                placeholder="Order ID"
                value={assignOrderId}
                onChange={(e) => setAssignOrderId(e.target.value)}
                required
              />
              <input
                className="w-full border rounded-lg px-3 py-2 bg-white"
                placeholder="Delivery partner email"
                value={assignEmail}
                onChange={(e) => setAssignEmail(e.target.value)}
                required
              />
              <button className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors">
                Confirm Assignment
              </button>
            </form>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                api(`/seller/orders/${statusOrderId}/status`, {
                  method: "PUT",
                  body: { status: statusValue },
                  auth: true,
                })
                  .then(() => {
                    alert("Status updated");
                    setStatusOrderId("");
                  })
                  .catch(() => alert("Failed to update status"));
              }}
              className="space-y-2"
            >
              <div className="text-sm font-semibold text-gray-800">
                Update Order Status
              </div>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Order ID"
                value={statusOrderId}
                onChange={(e) => setStatusOrderId(e.target.value)}
                required
              />
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
              >
                {[
                  "Processing",
                  "Packed",
                  "Shipped",
                  "OutForDelivery",
                  "Delivered",
                  "Cancelled",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm">
                Update
              </button>
            </form>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const title = e.target.title.value;
                const msg = e.target.msg.value;
                try {
                  await api("/newsletter/announce", {
                    method: "POST",
                    body: { title, message: msg },
                    auth: true,
                  });
                  alert("Announcement sent to subscribers!");
                  e.target.reset();
                } catch (err) {
                  alert(err.message || "Failed to send");
                }
              }}
              className="space-y-2"
            >
              <div className="text-sm font-semibold text-gray-800">
                Send Announcement to Subscribers
              </div>
              <input
                name="title"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Subject/Title"
                required
              />
              <textarea
                name="msg"
                rows="3"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Your message..."
                required
              />
              <button className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm">
                Send Announcement
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-6 bg-gray-50/10 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter italic">
              Delivery Logistics Audit
            </h2>
            <div className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full italic shadow-lg shadow-indigo-100">
              Official Registry
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Order & Date
                  </th>
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Acquired Items
                  </th>
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Customer
                  </th>
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Courier Partner
                  </th>
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Logistics Status
                  </th>
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                    Evidence & Logs
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="group hover:bg-white transition-colors"
                  >
                    <td className="py-5 pr-4">
                      <div
                        className="text-xs font-black text-gray-900 italic cursor-pointer hover:text-emerald-600 transition-colors"
                        onClick={() => {
                          setAssignOrderId(o.id);
                          setStatusOrderId(o.id);
                          window.scrollTo({
                            top:
                              document.body.querySelector("form")?.offsetTop ||
                              1000,
                            behavior: "smooth",
                          });
                        }}
                        title="Click to manage this order"
                      >
                        #{String(o.id).padStart(8, "0")}
                      </div>
                      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-5 pr-4">
                      <div className="flex -space-x-1.5">
                        {o.items?.slice(0, 3).map((it, idx) => (
                          <div
                            key={idx}
                            className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm"
                            title={`${it.name} (ID: ${it.productId})`}
                          >
                            <img
                              src={
                                it.image
                                  ? fileUrl(it.image)
                                  : "/placeholder.png"
                              }
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          </div>
                        ))}
                        {o.items?.length > 3 && (
                          <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-900 text-[8px] font-bold text-white flex items-center justify-center shadow-sm">
                            +{o.items.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-5 pr-4">
                      <div className="text-xs font-black text-gray-900">
                        {o.user?.name || "-"}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {o.user?.email || "-"}
                      </div>
                    </td>
                    <td className="py-5 pr-4">
                      {o.assignedDelivery ? (
                        <>
                          <div className="text-xs font-black text-indigo-600 italic uppercase">
                            {o.assignedDelivery.name}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {o.assignedDelivery.email}
                          </div>
                        </>
                      ) : (
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic">
                          -
                        </span>
                      )}
                    </td>
                    <td className="py-5 pr-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          o.orderStatus === "Delivered"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : o.orderStatus === "Cancelled"
                              ? "bg-red-50 text-red-600 border-red-100"
                              : "bg-blue-50 text-blue-600 border-blue-100"
                        }`}
                      >
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {o.deliveryProofImages?.length > 0 && (
                          <div className="flex -space-x-2">
                            {o.deliveryProofImages.slice(0, 2).map((img, i) => (
                              <img
                                key={i}
                                src={fileUrl(img)}
                                className="w-8 h-8 rounded-lg border-2 border-white object-cover shadow-sm bg-white cursor-pointer hover:scale-110 transition-transform"
                                alt="Evidence"
                                onClick={() =>
                                  window.open(fileUrl(img), "_blank")
                                }
                              />
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setAssignOrderId(o.id);
                            setStatusOrderId(o.id);
                            window.scrollTo({
                              top:
                                document.body.querySelector("form")
                                  ?.offsetTop || 1000,
                              behavior: "smooth",
                            });
                          }}
                          className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                          title="Manage Status / Assign Partner"
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
                              strokeWidth={2.5}
                              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            alert(
                              `Mission Logs:\n${o.deliveryNotes?.map((n) => `[${n.role}] ${n.message} (@ ${new Date(n.at).toLocaleString()})`).join("\n") || "No logs available"}`
                            )
                          }
                          className="p-2 bg-gray-900 text-white rounded-xl hover:bg-indigo-600 transition-colors shadow-sm"
                          title="View Logs"
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
                              strokeWidth={2.5}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="py-20 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest italic">
                No logistics records found in vault
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter">
              My Product Catalog
            </h2>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black">
              {myProducts.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myProducts.map((p) => (
              <div
                key={p.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-5 relative overflow-hidden"
              >
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    className="p-1.5 rounded-lg bg-red-50 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={async () => {
                      if (!confirm("Erase this listing permanently?")) return;
                      try {
                        await api(`/products/${p.id}`, {
                          method: "DELETE",
                          auth: true,
                        });
                        setMyProducts((arr) =>
                          arr.filter((x) => x.id !== p.id)
                        );
                      } catch (e) {
                        alert(e.message || "Delete failed");
                      }
                    }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
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
                <div className="w-full h-48 bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={p.imageUrl ? fileUrl(p.imageUrl) : "/placeholder.png"}
                    alt={p.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                    {p.category}
                  </div>
                  <div className="font-bold text-gray-900 line-clamp-1">
                    {p.name}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-emerald-700 font-black tracking-tighter italic">
                      ₹{p.offerPrice ?? p.price}
                    </div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">
                      Stock: {p.stock ?? 0}
                    </div>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    const nv = Number(
                      prompt("Update Inventory Level:", String(p.stock ?? 0)) ||
                        ""
                    );
                    if (isNaN(nv) || nv < 0) return;
                    try {
                      const r = await api(`/products/${p.id}/stock`, {
                        method: "PUT",
                        auth: true,
                        body: { stock: nv },
                      });
                      setMyProducts((arr) =>
                        arr.map((x) =>
                          x.id === p.id ? { ...x, stock: r.stock } : x
                        )
                      );
                    } catch (err) {
                      alert(err.message || "Update failed");
                    }
                  }}
                  className="w-full mt-4 py-2 bg-gray-50 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                >
                  Update Inventory
                </button>
              </div>
            ))}
            {myProducts.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-300 font-black uppercase tracking-[0.2em]">
                No Listings Found
              </div>
            )}
          </div>
        </div>

        <div
          id="add-product"
          className="rounded-[32px] bg-gradient-to-br from-white to-emerald-50 border border-emerald-100 p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden relative"
        >
          <div className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              Create New Product
            </h2>
            <p className="text-gray-500 mt-3 text-lg">
              Upload and publish products to your store
            </p>
          </div>
          <form
            onSubmit={addProduct}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 mt-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Category</label>
              <select
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 mt-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.path} value={c.path}>
                    {c.path}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Price</label>
              <input
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 mt-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">
                Offer Price (optional)
              </label>
              <input
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 mt-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                type="number"
                min="0"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Stock Quantity</label>
              <input
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 mt-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">
                Weight / Measurement (e.g. 500g)
              </label>
              <input
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 mt-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                placeholder="500g, 1kg, Pack of 6"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Description</label>
              <textarea
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 mt-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Images</label>
              <input
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 mt-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setImageFiles(Array.from(e.target.files || []))
                }
              />
              {imageFiles.length ? (
                <div className="flex items-center gap-2 mt-2">
                  {imageFiles.slice(0, 4).map((f, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 rounded border border-gray-200 overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(f)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="md:col-span-2">
              <button
                disabled={saving}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-500 text-white font-black rounded-2xl py-4 text-lg shadow-xl hover:scale-[1.02] transition-all disabled:opacity-60"
              >
                {saving ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}