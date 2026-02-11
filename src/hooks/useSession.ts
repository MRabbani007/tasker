// hooks/useSession.ts
"use client";

import { useEffect, useState } from "react";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchSession() {
    try {
      const res = await fetch("/api/auth/session", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch session");

      const data: Session = await res.json();

      setSession(data);
    } catch {
      setSession({ authenticated: false, user: null });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSession();

    console.log("triggered");
  }, [fetchSession]);

  return {
    data: session,
    user: session?.user ?? null,
    authenticated: session?.authenticated ?? false,
    loading,
    refresh: fetchSession,
  };
}
