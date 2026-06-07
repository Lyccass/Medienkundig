import { useEffect, useState } from "react";
import { getAuthStatus, isRegisteredUser } from "./auth";
import { getSupabaseClient } from "./client";

export interface AuthState {
  loading: boolean;
  userId: string | null;
  email: string | null;
  isRegistered: boolean;
}

export function useAuthStatus(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: true,
    userId: null,
    email: null,
    isRegistered: false,
  });

  useEffect(() => {
    let alive = true;
    const supabase = getSupabaseClient();

    void getAuthStatus().then((status) => {
      if (!alive) return;
      setState({
        loading: false,
        userId: status.user?.id ?? null,
        email: status.user?.email ?? null,
        isRegistered: status.isRegistered,
      });
    }).catch(() => {
      if (!alive) return;
      setState({ loading: false, userId: null, email: null, isRegistered: false });
    });

    if (!supabase) {
      setState({ loading: false, userId: null, email: null, isRegistered: false });
      return () => {
        alive = false;
      };
    }

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setState({
        loading: false,
        userId: user?.id ?? null,
        email: user?.email ?? null,
        isRegistered: isRegisteredUser(user),
      });
    });

    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return state;
}
