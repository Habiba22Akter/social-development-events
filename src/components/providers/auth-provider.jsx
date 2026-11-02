"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

/**
 * Single source of truth for the signed-in user.
 *
 * The session itself lives in BetterAuth's HTTP-only cookie; `useSession()`
 * reads it, keeps it fresh when the tab regains focus, and updates every
 * consumer after sign-in/sign-out.
 */
const AuthContext = createContext({
  user: null,
  session: null,
  isPending: true,
  isRefetching: false,
  isSigningOut: false,
  refetch: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const { data, isPending, isRefetching, refetch } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const signOut = useCallback(async () => {
    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Could not sign you out. Try again.");
        return;
      }

      toast.success("You are signed out.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not sign you out. Check your connection.");
    } finally {
      setIsSigningOut(false);
    }
  }, [router]);

  const value = useMemo(
    () => ({
      user: data?.user ?? null,
      session: data?.session ?? null,
      isPending,
      isRefetching,
      isSigningOut,
      refetch,
      signOut,
    }),
    [data, isPending, isRefetching, isSigningOut, refetch, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
