import { assets } from "../assets/greencart/greencart_assets/assets";
import { useEffect, useState } from "react";
import { api, setToken } from "../lib/api";
import { navigate } from "../lib/router";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [phone, setPhone] = useState("");
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setErr("");

    setLoading(true);

    try {
      // REGISTER FLOW
      if (mode === "register") {
        await api("/auth/register", {
          method: "POST",
          body: {
            email,
            password,
            name,
            role,
            phone,
            storeName: role === "seller" ? storeName : "",
          },
        });

        // SAVE EMAIL FOR OTP PAGE
        localStorage.setItem("verifyEmail", email);

        // GO TO OTP PAGE
        navigate("/verify-otp");

        return;
      }

      // LOGIN FLOW
      const res = await api("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      setToken(res.token);

      const me = await api("/auth/me", { auth: true });

      navigate(
        me.role === "seller" || me.role === "admin"
          ? "/seller"
          : me.role === "delivery"
          ? "/delivery"
          : "/"
      );
    } catch (e) {
      setErr(e.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center py-6 md:py-12 px-4 md:px-6 lg:px-8">
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>

      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white/80 backdrop-blur-xl rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/40">
        {/* Visual Side */}
        <div className="hidden lg:block relative group overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-green-500 h-full border-r border-white/10">
          <img
            src={assets.bottom_banner_image_sm}
            alt=""
            className="absolute right-0 bottom-0 w-[80%] h-auto object-contain opacity-40 transition-transform duration-[2000ms] group-hover:scale-110 pointer-events-none select-none"
          />
          {/* Shaded Effect */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute top-8 left-8 z-20 bg-white text-emerald-600 px-4 py-2 rounded-full font-black text-xs shadow-xl animate-bounce">
            🌱 Organic Marketplace
          </div>
          <div className="absolute top-16 left-12 right-12 z-10 text-white drop-shadow-lg">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-4 block">
              Welcome to GreenCart
            </span>
            <h2 className="text-4xl xl:text-5xl font-black leading-[1.1] tracking-tighter mb-4 italic">
              Experience Freshness
              <br /> Like Never Before.
            </h2>
            <p className="text-gray-100 font-medium text-sm max-w-xs leading-relaxed opacity-90">
              Join our community of over 50,000+ healthy chefs and organic
              enthusiasts.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6">
              <div>
                <h3 className="text-3xl font-black">50K+</h3>
                <p className="text-xs uppercase">Users</p>
              </div>

              <div>
                <h3 className="text-3xl font-black">15K+</h3>
                <p className="text-xs uppercase">Orders</p>
              </div>

              <div>
                <h3 className="text-3xl font-black">4.9★</h3>
                <p className="text-xs uppercase">Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center">
          <div className="mb-12">
            <div className="flex p-1 bg-gray-50 rounded-xl w-fit mb-6 shadow-inner border border-gray-100">
              <button
                onClick={() => setMode("login")}
                className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  mode === "login"
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("register")}
                className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  mode === "register"
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Register
              </button>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">
              {mode === "login" ? "Welcome Back 👋" : "Create Your Account 🚀"}
            </h1>
            <p className="text-gray-400 font-medium text-xs">
              {mode === "login"
                ? "Enter your credentials to access your pantry."
                : "Create your account to start curating fresh ingredients."}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4 animate-fade-in">
            {mode === "register" && (
              <div className="space-y-4 animate-fade-in">
                <input
                  className="input-field"
                  placeholder="Legal Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <div className="flex gap-4 p-2 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
                  {["user", "seller", "delivery"].map((r) => (
                    <label
                      key={r}
                      className={`flex-1 flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all ${
                        role === r
                          ? "bg-white shadow-sm ring-1 ring-emerald-500/20"
                          : "hover:bg-white/50 grayscale"
                      }`}
                    >
                      <input
                        type="radio"
                        value={r}
                        checked={role === r}
                        onChange={(e) => setRole(e.target.value)}
                        className="hidden"
                      />
                      <>
                        <div className="text-2xl mb-2">
                          {r === "user" && "👤"}
                          {r === "seller" && "🏪"}
                          {r === "delivery" && "🚚"}
                        </div>

                        <span
                          className={`text-[8px] font-black uppercase tracking-widest ${
                            role === r ? "text-emerald-500" : "text-gray-400"
                          }`}
                        >
                          {r}
                        </span>
                      </>
                    </label>
                  ))}
                </div>

                <input
                  className="input-field"
                  placeholder="Mobile Connection"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                {role === "seller" && (
                  <input
                    className="input-field animate-fade-in"
                    placeholder="Official Store Name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                  />
                )}
              </div>
            )}

            <input
              className="input-field"
              type="email"
              placeholder="Email Direction"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="input-field"
              type="password"
              placeholder="Key Phrase (Password)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black py-4 rounded-2xl hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-200 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 text-xs uppercase tracking-[0.2em]"
            >
              {loading
                ? "TRANSACTING..."
                : mode === "login"
                ? "AUTHENTICATE"
                : "ESTABLISH ACCOUNT"}
            </button>
          </form>

          {err && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 animate-bounce-in">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-xs font-bold text-red-600 uppercase tracking-tighter">
                {err}
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-center gap-6">
            <span className="text-xs text-gray-400">🔒 Secure</span>

            <span className="text-xs text-gray-400">⚡ Fast</span>

            <span className="text-xs text-gray-400">🌱 Organic</span>
          </div>

          <div className="mt-8 text-center">
            {mode === "login" ? (
              <button
                onClick={() => navigate("/forgot")}
                className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-500/30 pb-0.5"
              >
                Forgot Password? (Recovery Key)
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}