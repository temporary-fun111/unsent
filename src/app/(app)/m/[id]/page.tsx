"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

const moods = ["Calm", "Sad", "Angry", "Grateful", "Confused", "Loved"];

type Msg = {
  id: string;
  to_name: string | null;
  title: string | null;
  body: string;
  mood: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

export default function MessagePage({ params }: { params: { id: string } }) {
  const id = params.id;

  const [msg, setMsg] = useState<Msg | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string>("");

  // editable fields
  const [toName, setToName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [archived, setArchived] = useState(false);

  useEffect(() => {
    const load = async () => {
      setError("");
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("messages")
        .select("id,to_name,title,body,mood,is_archived,created_at,updated_at")
        .eq("id", id)
        .single();

      if (error || !data) {
        setError(error?.message || "Message not found.");
        setLoading(false);
        return;
      }

      const m = data as Msg;
      setMsg(m);

      setToName(m.to_name ?? "");
      setTitle(m.title ?? "");
      setBody(m.body ?? "");
      setMood(m.mood ?? null);
      setArchived(!!m.is_archived);

      setLoading(false);
    };

    load();
  }, [id]);

  const update = async () => {
    setError("");
    if (!body.trim()) {
      setError("Message body is required.");
      return;
    }

    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      location.href = "/login";
      return;
    }

    const { error } = await supabase
      .from("messages")
      .update({
        to_name: toName.trim() || null,
        title: title.trim() || null,
        body: body.trim(),
        mood,
        is_archived: archived,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    location.href = "/vault";
  };

  const toggleArchiveQuick = () => setArchived((x) => !x);

  const remove = async () => {
    setError("");
    const ok = confirm("Delete this message permanently?");
    if (!ok) return;

    setDeleting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      location.href = "/login";
      return;
    }

    const { error } = await supabase.from("messages").delete().eq("id", id);

    setDeleting(false);

    if (error) {
      setError(error.message);
      return;
    }

    location.href = "/vault";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF7FB] p-6">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow">
          Loading…
        </div>
      </div>
    );
  }

  if (error && !msg) {
    return (
      <div className="min-h-screen bg-[#FFF7FB] p-6">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow">
          <p className="font-semibold text-[#1F1F1F]">Error</p>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <Link
            href="/vault"
            className="mt-4 inline-block rounded-2xl bg-[#FF4DA6] px-4 py-2 font-semibold text-white"
          >
            Back to Vault
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7FB] p-6">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#FF4DA6]">Edit</h1>
          <Link href="/vault" className="text-sm font-semibold text-[#FF4DA6]">
            Back
          </Link>
        </div>

        <label className="mt-4 block text-sm font-semibold">For (private)</label>
        <input
          value={toName}
          onChange={(e) => setToName(e.target.value)}
          className="mt-1 w-full rounded-2xl border border-[#F3B6D3] p-3 outline-none"
          placeholder="e.g., Someone I miss"
        />

        <label className="mt-4 block text-sm font-semibold">Title (optional)</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-2xl border border-[#F3B6D3] p-3 outline-none"
          placeholder="A short title…"
        />

        <label className="mt-4 block text-sm font-semibold">Message</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="mt-1 h-48 w-full rounded-2xl border border-[#F3B6D3] p-3 outline-none"
          placeholder="Write what you can't send…"
        />

        <div className="mt-4">
          <p className="text-sm font-semibold">Mood (optional)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {moods.map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => setMood(mood === x ? null : x)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mood === x ? "bg-[#FF4DA6] text-white" : "bg-[#FFD1E6] text-[#FF4DA6]"
                }`}
              >
                {x}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-[#F3B6D3] bg-[#FFF7FB] p-4">
          <div>
            <p className="text-sm font-semibold text-[#1F1F1F]">Archived</p>
            <p className="text-xs text-gray-600">Hide it from your main flow.</p>
          </div>
          <button
            type="button"
            onClick={toggleArchiveQuick}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              archived ? "bg-[#FF4DA6] text-white" : "bg-white text-[#FF4DA6] border border-[#F3B6D3]"
            }`}
          >
            {archived ? "ON" : "OFF"}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-3">
          <button
            onClick={update}
            disabled={saving}
            className="w-full rounded-2xl bg-[#FF4DA6] py-3 font-semibold text-white disabled:opacity-60 hover:opacity-90 transition"
          >
            {saving ? "Updating…" : "Update"}
          </button>

          <button
            onClick={remove}
            disabled={deleting}
            className="w-full rounded-2xl border border-red-200 bg-white py-3 font-semibold text-red-600 disabled:opacity-60 hover:opacity-90 transition"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Created: {msg?.created_at ? new Date(msg.created_at).toLocaleString() : "-"}
        </p>
      </div>
    </div>
  );
}
