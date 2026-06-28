import { useEffect, useState } from "react";
import { api, apiForm, fileUrl } from "../lib/api";
import { assets } from "../assets/greencart/greencart_assets/assets";
import { navigate } from "../lib/router";

export default function Profile({ user, setUser }) {
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    async function ensureUser() {
      if (!user) {
        try {
          const me = await api("/auth/me", { auth: true });
          if (mounted) {
            setUser?.(me);
            setName(me.name || "");
          }
        } catch {
          navigate("/auth");
        }
      } else {
        setName(user.name || "");
      }
    }
    ensureUser();
    return () => {
      mounted = false;
    };
  }, [user, setUser]);

  async function saveProfile(e) {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      await api("/auth/profile", {
        method: "PUT",
        body: { name, currentPassword, newPassword },
        auth: true,
      });
      const me = await api("/auth/me", { auth: true });
      setUser?.(me);
      setCurrentPassword("");
      setNewPassword("");
      alert("Profile updated");
    } catch (e) {
      setErr(e.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  async function uploadAvatar(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      await apiForm("/auth/avatar", fd, { auth: true });
      const me = await api("/auth/me", { auth: true });
      setUser?.(me);
      alert("Avatar updated");
    } catch (e) {
      alert(e.message || "Failed to upload avatar");
    }
  }

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-12 animate-fade-in">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          Your Profile
        </h1>

        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 p-5 text-white shadow-[0_20px_60px_rgba(16,185,129,0.35)] mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

          <div className="flex items-center gap-4 relative z-10">
            <img
              src={user?.avatarUrl ? fileUrl(user.avatarUrl) : assets.profile_icon}
              alt=""
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl transition-all duration-500 hover:scale-110 hover:rotate-3"
            />

            <div>
              <p className="uppercase tracking-widest text-sm opacity-80">
                Profile Center
              </p>

              <h1 className="text-3xl font-black mt-1">{user?.name}</h1>

              <p className="mt-2 text-white/80">{user?.email}</p>
              <div className="flex gap-3 mt-4">
                <label className="inline-flex px-5 py-2 rounded-full bg-white text-emerald-600 font-bold cursor-pointer hover:scale-105 transition shadow-lg">
                  Change Avatar
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={uploadAvatar}
                  />
                </label>

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/auth";
                  }}
                  className="px-5 py-2 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white">
            <p className="text-gray-400 uppercase text-xs">Account Type</p>

            <h2 className="text-4xl font-black mt-2">{user?.role}</h2>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white">
            <p className="text-gray-400 uppercase text-xs">Status</p>

            <h2 className="text-3xl font-black text-emerald-600 mt-2">Active</h2>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white">
            <p className="text-gray-400 uppercase text-xs">Profile Completion</p>

            <h2 className="text-3xl font-black mt-2">100%</h2>
          </div>
        </div>
        <form
          onSubmit={saveProfile}
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-6"
        >
          <div>
            <h2 className="text-2xl font-black text-gray-900">Profile Settings</h2>

            <p className="text-gray-500 mt-1">
              Update your personal information and password.
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input
              className="w-full rounded-2xl border border-gray-200 px-5 py-4 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Current Password
              </label>
              <input
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                New Password
              </label>
              <input
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            disabled={saving}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-black tracking-widest uppercase shadow-xl hover:scale-[1.02] active:scale-95 hover:shadow-[0_20px_60px_rgba(16,185,129,0.35)] transition-all duration-300"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {err && <div className="text-sm text-red-600">{err}</div>}
        </form>
      </div>
    </section>
  );
}