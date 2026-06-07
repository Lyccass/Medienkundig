import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "./client";

export interface AuthStatus {
  user: User | null;
  isRegistered: boolean;
}

export async function ensureSupabaseUser(): Promise<User | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session?.user) return sessionData.session.user;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) return null;
  return data.user;
}

export function isRegisteredUser(user: User | null): boolean {
  return Boolean(user && !(user as { is_anonymous?: boolean }).is_anonymous);
}

export async function getAuthStatus(): Promise<AuthStatus> {
  const supabase = getSupabaseClient();
  if (!supabase) return { user: null, isRegistered: false };

  const { data } = await supabase.auth.getSession();
  const user = data.session?.user ?? null;
  return { user, isRegistered: isRegisteredUser(user) };
}

interface AuthSuccess {
  ok: true;
  needsConfirmation?: boolean;
}

interface AuthFailure {
  ok: false;
  message: string;
}

export async function registerWithPassword(params: {
  displayName: string;
  email: string;
  password: string;
}): Promise<AuthSuccess | AuthFailure> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { ok: false, message: "Supabase ist noch nicht konfiguriert." };
  }

  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        display_name: params.displayName,
      },
      emailRedirectTo: `${window.location.origin}/?auth=callback`,
    },
  });

  if (error) return { ok: false, message: error.message };
  return { ok: true, needsConfirmation: !data.session };
}

export async function loginWithPassword(params: {
  email: string;
  password: string;
}): Promise<AuthSuccess | AuthFailure> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { ok: false, message: "Supabase ist noch nicht konfiguriert." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  });

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export async function requestPasswordReset(email: string): Promise<AuthSuccess | AuthFailure> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { ok: false, message: "Supabase ist noch nicht konfiguriert." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/?auth=login`,
  });

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export async function signOut() {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  await supabase.auth.signOut();
}
