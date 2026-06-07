import { useEffect, useState } from "react";
import { getAuthStatus, isRegisteredUser } from "./auth";
import { getSupabaseClient } from "./client";

export interface AuthState {
  loading: boolean;
  email: string | null;
  isRegistered: boolean;
}

export function useAuthStatus(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: true,
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
        email: status.user?.email ?? null,
        isRegistered: status.isRegistered,
      });
    }).catch(() => {
      if (!alive) return;
      setState({ loading: false, email: null, isRegistered: false });
    });

    if (!supabase) {
      setState({ loading: false, email: null, isRegistered: false });
      return () => {
        alive = false;
      };
    }

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setState({
        loading: false,
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
