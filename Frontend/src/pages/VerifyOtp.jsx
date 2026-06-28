import { useState } from "react";
import { api } from "../lib/api";
import { navigate } from "../lib/router";

export default function VerifyOtp() {

  const [otp, setOtp] = useState("");

  const email =
    localStorage.getItem(
      "verifyEmail"
    );

  const [err, setErr] =
    useState("");

  async function verify(e) {

    e.preventDefault();

    try {

      await api(
        `/auth/verify-otp?email=${email}&otp=${otp}`,
        {
          method: "POST"
        }
      );

      alert(
        "Email verified successfully"
      );

      navigate("/auth");

    } catch(err) {

      setErr(
        err.message ||
        "Invalid OTP"
      );
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center">

      <form
        onSubmit={verify}
        className="bg-white p-10 rounded-2xl shadow-xl"
      >

        <h1 className="text-2xl font-black mb-6">
          Verify OTP
        </h1>

        <input
          className="border p-3 rounded-xl w-full mb-4"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e)=>
            setOtp(e.target.value)
          }
        />

        <button
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl w-full"
        >
          Verify
        </button>

        {err && (
          <p className="text-red-500 mt-4">
            {err}
          </p>
        )}

      </form>

    </div>
  );
}