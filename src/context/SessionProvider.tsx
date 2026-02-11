// providers/session-provider.tsx
"use client";

import { logoutAction } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const SessionContext = createContext<{
  loading: boolean;
  session: Session | null;
  refresh: () => Promise<void>;
  logout: (options?: { redirectTo?: string }) => Promise<void>;
} | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/session", {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch session");

      const data: Session = await res.json();
      setSession(data);
    } catch {
      setSession({ authenticated: false, user: null });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  const logout = useCallback(
    async ({ redirectTo }: { redirectTo?: string } = {}) => {
      await logoutAction();

      // immediately update local state
      setSession({ authenticated: false, user: null });

      // re-evaluate layouts / server components
      router.refresh();

      // optional redirect
      if (redirectTo) {
        router.push(redirectTo);
      }
    },
    [router],
  );

  return (
    <SessionContext.Provider value={{ session, loading, refresh, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");

  return {
    ...ctx.session,
    user: ctx.session?.user ?? null,
    authenticated: ctx.session?.authenticated ?? false,
    refresh: ctx.refresh,
    logout: ctx.logout,
  };
}
