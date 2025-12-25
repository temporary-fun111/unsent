"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

type Msg = {
  id: string;
  title: string | null;
  body: string;
  mood: string | null;
  created_at: string;
  is_archived: boolean;
};

export default function VaultPage() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("messages")
        .select("id,title,body,mood,created_at,is_archived")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) setMsgs(data as any);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF7FB] p-6">
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#FF4DA6]">Your Vault</h1>
          <Link
            href="/write"
            className="rounded-2xl bg-[#FF4DA6] px-4 py-2 font-semibold text-white hover:opacity-90 transition"
          >
            + Write
          </Link>
        </div>

        {loading ? (
          <p className="mt-6 text-sm">Loading…</p>
        ) : msgs.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-6 shadow">
            <p className="text-[#1F1F1F]">No messages yet.</p>
            <p className="mt-1 text-sm text-gray-600">
              Write your first unsent message 💗
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {msgs.map((m) => (
              <Link
                key={m.id}
                href={`/m/${m.id}`}
                className="block rounded-3xl bg-white p-5 shadow hover:opacity-90 transition"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-[#1F1F1F]">
                    {m.title?.trim() ? m.title : "Untitled"}
                  </h2>
                  {m.mood && (
                    <span className="rounded-full bg-[#FFD1E6] px-3 py-1 text-xs font-semibold text-[#FF4DA6]">
                      {m.mood}
                    </span>
                  )}
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-gray-700">
                  {m.body}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
