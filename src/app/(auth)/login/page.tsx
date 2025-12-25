"use client";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7FB] p-6">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold text-[#FF4DA6]">Unsent</h1>
        <p className="mt-2 text-sm text-[#1F1F1F]">
          Write what you can't send. Private-first.
        </p>

        <button
          onClick={signInGoogle}
          className="mt-6 w-full rounded-2xl bg-[#FF4DA6] py-3 font-semibold text-white hover:opacity-90 transition"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
