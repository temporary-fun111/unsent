"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallback() {
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      // Supabase usually exchanges the code automatically on load.
      // We just wait until session exists then redirect.
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        if (mounted) location.href = "/vault";
        return;
      }

      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;
        if (session) location.href = "/vault";
      });

      // Safety timeout (avoid infinite loading)
      setTimeout(() => {
        if (!mounted) return;
        location.href = "/login";
      }, 6000);

      return () => sub.subscription.unsubscribe();
    };

    run();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF7FB] p-6 flex items-center justify-center">
      <div className="rounded-3xl bg-white p-6 shadow text-sm">
        Finishing login…
      </div>
    </div>
  );
}
