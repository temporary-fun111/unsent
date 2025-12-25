"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

const moods = ["Calm", "Sad", "Angry", "Grateful", "Confused", "Loved"];

export default function WritePage() {
  const [toName, setToName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!body.trim()) return alert("Message body is required.");
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { location.href = "/login"; return; }

    const { error } = await supabase.from("messages").insert({
      user_id: user.id,
      to_name: toName.trim() || null,
      title: title.trim() || null,
      body: body.trim(),
      mood,
    });

    setSaving(false);
    if (error) return alert(error.message);

    location.href = "/vault";
  };

  return (
    <div className="min-h-screen bg-[#FFF7FB] p-6">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-[#FF4DA6]">Write</h1>

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
          className="mt-1 h-44 w-full rounded-2xl border border-[#F3B6D3] p-3 outline-none"
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
                  mood === x
                    ? "bg-[#FF4DA6] text-white"
                    : "bg-[#FFD1E6] text-[#FF4DA6]"
                }`}
              >
                {x}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="mt-6 w-full rounded-2xl bg-[#FF4DA6] py-3 font-semibold text-white disabled:opacity-60 hover:opacity-90 transition"
        >
          {saving ? "Saving…" : "Save to Vault"}
        </button>
      </div>
    </div>
  );
}
