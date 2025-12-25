"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function LandingPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "exists" | "error">("idle");
  const [errMsg, setErrMsg] = useState<string>("");

  const submit = async () => {
    setErrMsg("");
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setStatus("error");
      setErrMsg("Please enter a valid email.");
      return;
    }

    setStatus("loading");

    const { error } = await supabase.from("waitlist").insert({
      name: name.trim() || null,
      email: cleanEmail,
    });

    if (!error) {
      setStatus("success");
      return;
    }

    // Supabase/Postgres unique violation often comes as 409 or message includes "duplicate key"
    const msg = (error as any)?.message?.toLowerCase?.() ?? "";
    const code = (error as any)?.code ?? "";
    const statusCode = (error as any)?.status ?? 0;

    if (statusCode === 409 || code === "23505" || msg.includes("duplicate")) {
      setStatus("exists");
      return;
    }

    setStatus("error");
    setErrMsg((error as any)?.message || "Something went wrong.");
  };

  return (
    <main className="min-h-screen bg-[#FFF7FB] px-6 py-10">
      <div className="mx-auto max-w-xl">
        <header className="flex items-center justify-between">
          <div className="text-2xl font-bold text-[#FF4DA6]">Unsent</div>
          <Link
            href="/login"
            className="rounded-2xl border border-[#F3B6D3] bg-white px-4 py-2 text-sm font-semibold text-[#FF4DA6]"
          >
            Open App
          </Link>
        </header>

        <section className="mt-10 rounded-3xl bg-white p-7 shadow">
          <h1 className="text-4xl font-extrabold leading-tight text-[#1F1F1F]">
            Write what you <span className="text-[#FF4DA6]">can't</span> send.
          </h1>
          <p className="mt-3 text-sm text-gray-700">
            A private-first unsent message vault. Pink, calm, and safe by design.
          </p>

          <div className="mt-6 grid gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-[#F3B6D3] bg-[#FFF7FB] p-3 outline-none"
              placeholder="Name (optional)"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-[#F3B6D3] bg-[#FFF7FB] p-3 outline-none"
              placeholder="Email (required)"
              inputMode="email"
            />

            <button
              onClick={submit}
              disabled={status === "loading"}
              className="mt-1 w-full rounded-2xl bg-[#FF4DA6] py-3 font-semibold text-white disabled:opacity-60"
            >
              {status === "loading" ? "Joining…" : "Join Waitlist"}
            </button>

            {status === "success" && (
              <div className="rounded-2xl bg-[#FFD1E6] p-3 text-sm font-semibold text-[#FF4DA6]">
                You're in 💗 We'll email you when beta opens.
              </div>
            )}

            {status === "exists" && (
              <div className="rounded-2xl bg-[#FFD1E6] p-3 text-sm font-semibold text-[#FF4DA6]">
                You already joined 💗 See you in beta.
              </div>
            )}

            {status === "error" && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errMsg}
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow">
          <h2 className="text-lg font-bold text-[#1F1F1F]">Privacy promise</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>Private-first vault (no public feed in MVP)</li>
            <li>Location features are OFF by default (coming later)</li>
            <li>You can delete your account anytime (coming in Week 3)</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
