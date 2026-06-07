# Medienkundig Supabase Backend

This backend stores learning progress for authenticated Supabase users.

## Architecture

- `apps/webapp` stays a Vite client app.
- `supabase/` is the backend boundary for the current product: schema, migrations, Row Level Security policies, and Postgres functions.
- The client reads its own progress directly through Supabase Auth/RLS.
- The client does not write trusted counters directly. Exercise completions go through `complete_learning_exercises(text[])`, which checks the server-side exercise catalog and awards XP only for newly completed active exercises.
- Do not add `apps/backend` until we need server-only workflows such as admin APIs, paid plans, webhooks, email jobs, analytics aggregation, or third-party secrets. At that point it should be a small separate service, not a proxy monolith around Supabase.

## Security Model

- The browser only uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Never expose `sb_secret_*`, service role keys, or JWT signing keys in client code.
- All user-owned tables have Row Level Security enabled.
- Policies restrict reads and writes to `user_id = auth.uid()`.
- Anonymous Auth can be enabled for exploring without an account; anonymous users still use the `authenticated` Postgres role and are protected by the same RLS policies.
- Email/password Auth is used for real accounts. Keep email confirmation enabled before launch.
- If we need to preserve the exact anonymous Supabase user ID during registration, implement the official anonymous-user conversion flow with `auth.updateUser()` / identity linking. The current client syncs local progress into the registered account after login.

## Apply Migrations

```bash
supabase link --project-ref inxkxgsibxtchnlaroas
supabase db push
```

## Required Dashboard Settings

Enable Supabase Auth with:

- Email provider
- Confirm email
- Anonymous Sign-ins for exploring before registration

If Anonymous Sign-ins are disabled, the app keeps working locally through `localStorage`, but progress will not sync before login.

## Account Roadmap

- Password reset is handled through Supabase Auth reset emails.
- Export progress can be added client-side from `learning_progress`, `exercise_attempts`, and `user_stats`.
- Delete account requires a server-side service-role operation. Do not implement it directly in the browser.
