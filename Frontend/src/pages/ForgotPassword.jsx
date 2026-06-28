import { useState } from "react";
import { api } from "../lib/api";
import { navigate } from "../lib/router";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [verified, setVerified] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function reqOtp(e) {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      await api(`/auth/request-reset-otp?email=${encodeURIComponent(email)}`, { method: "POST" });
      setMsg("OTP sent to your email");
      setVerified(false);
      setStep(2);
    } catch (e) { setErr(e.message); }
  }
  async function verify(e) {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      await api(`/auth/verify-reset-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, { method: "POST" });
      setVerified(true);
      setMsg("OTP verified");
    } catch (e) { setErr(e.message); }
  }
  async function reset(e) {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      if (!verified) { setErr("Please verify OTP first"); return; }
      await api("/auth/reset-password", { method: "POST", body: { email, otp, newPassword: password } });
      setMsg("Password reset successful. Please login.");
      navigate("/auth");
    } catch (e) { setErr(e.message); }
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="max-w-md mx-auto border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-extrabold text-gray-800 mb-2">{step===1?"Forgot Password":"Reset Password"}</h1>
          {step===1 ? (
            <form onSubmit={reqOtp} className="space-y-3">
              <input className="w-full border rounded-lg px-4 py-2" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
              <button className="w-full bg-emerald-600 text-white font-semibold rounded-lg py-3">Send OTP</button>
            </form>
          ) : (
            <>
              <form onSubmit={verify} className="space-y-3">
                <input className="w-full border rounded-lg px-4 py-2" type="text" placeholder="OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} required />
                <button className="w-full bg-emerald-600 text-white font-semibold rounded-lg py-3">{verified?"Verified":"Verify OTP"}</button>
              </form>
              <form onSubmit={reset} className="space-y-3 mt-4">
                <div className="relative">
                  <input className="w-full border rounded-lg px-4 py-2 pr-12" type={showPass?"text":"password"} placeholder="New Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                  <button type="button" onClick={()=>setShowPass((v)=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 12c0 0 3.75-7.5 9.75-7.5s9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                      <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                    </svg>
                  </button>
                </div>
                <button className="w-full bg-emerald-600 text-white font-semibold rounded-lg py-3" disabled={!verified}>Reset Password</button>
              </form>
            </>
          )}
          {msg && <div className="text-sm text-emerald-700 mt-3">{msg}</div>}
          {err && <div className="text-sm text-red-600 mt-3">{err}</div>}
        </div>
      </div>
    </section>
  );
}
