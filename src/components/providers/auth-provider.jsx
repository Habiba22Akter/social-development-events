"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

/**
 * Holds the signed-in user for the whole app shell.
 *
 * This is the single place that will talk to BetterAuth once auth is wired up:
 * replace the local `user` state with `authClient.useSession()` (or hydrate it
 * from a server session in the root layout) and point `signOut` at
 * `authClient.signOut()`. Everything in the navbar already reads from here.
 */
const AuthContext = createContext({
  user: null,
  isPending: false,
  setUser: () => {},
  signOut: async () => {},
});

export function AuthProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const signOut = useCallback(async () => {
    setIsPending(true);
    try {
      // TODO(auth): await authClient.signOut();
      setUser(null);
      router.push("/");
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }, [router]);

  const value = useMemo(
    () => ({ user, isPending, setUser, signOut }),
    [user, isPending, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
