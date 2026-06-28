import { assets } from "../assets/greencart/greencart_assets/assets";

export default function SellerLogin() {
  function submit(e) {
    e.preventDefault();
    window.location.hash = "#/"; // placeholder: after login go home
  }
  return (
    <section className="bg-white min-h-[70vh] flex items-center">
      <div className="mx-auto max-w-7xl px-4 w-full">
        <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-center mb-4 gap-2">
            <img src={assets.logo} alt="GreenCart" className="h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 text-center mb-2">Seller Login</h1>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input className="w-full border rounded-lg px-4 py-2 mt-1" type="email" placeholder="admin@example.com" required />
            </div>
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input className="w-full border rounded-lg px-4 py-2 mt-1" type="password" placeholder="********" required />
            </div>
            <button className="w-full bg-emerald-600 text-white font-semibold rounded-lg py-2.5">Login</button>
          </form>
        </div>
      </div>
    </section>
  );
}

