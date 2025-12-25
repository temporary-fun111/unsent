"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        location.href = "/login";
        return;
      }
      setEmail(user.email ?? "");
    };
    load();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    location.href = "/";
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow">
      <h1 className="text-2xl font-bold text-[#FF4DA6]">Settings</h1>

      <div className="mt-4 rounded-2xl border border-[#F3B6D3] bg-[#FFF7FB] p-4">
        <p className="text-sm font-semibold text-[#1F1F1F]">Signed in as</p>
        <p className="mt-1 text-sm text-gray-700">{email || "-"}</p>
      </div>

      <button
        onClick={logout}
        className="mt-6 w-full rounded-2xl bg-[#FF4DA6] py-3 font-semibold text-white hover:opacity-90 transition"
      >
        Logout
      </button>

      <div className="mt-6 rounded-2xl border border-[#F3B6D3] bg-[#FFF7FB] p-4">
        <p className="text-sm font-semibold text-[#1F1F1F]">Coming soon</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
          <li>Export data</li>
          <li>Delete account</li>
          <li>Passcode lock (mobile)</li>
        </ul>
      </div>
    </div>
  );
}
