create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  locale text not null default 'de',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer not null default 0 check (xp >= 0),
  streak integer not null default 1 check (streak >= 0),
  last_activity_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_exercises (
  id text primary key,
  category_id text not null,
  exercise_type text not null,
  xp_reward integer not null default 10 check (xp_reward >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id text not null references public.learning_exercises(id) on update cascade,
  category_id text not null,
  exercise_type text not null,
  completed_at timestamptz not null default now(),
  xp_earned integer not null default 0 check (xp_earned >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, exercise_id)
);

create table if not exists public.exercise_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id text not null references public.learning_exercises(id) on update cascade,
  category_id text not null,
  exercise_type text not null,
  correct boolean not null default true,
  xp_earned integer not null default 0 check (xp_earned >= 0),
  answer jsonb,
  created_at timestamptz not null default now()
);

create index if not exists learning_progress_user_completed_idx
  on public.learning_progress (user_id, completed_at desc);

create index if not exists learning_progress_category_idx
  on public.learning_progress (category_id);

create index if not exists exercise_attempts_user_created_idx
  on public.exercise_attempts (user_id, created_at desc);

create index if not exists exercise_attempts_exercise_idx
  on public.exercise_attempts (exercise_id);

insert into public.learning_exercises (id, category_id, exercise_type, xp_reward)
values
  ('gl-1', 'grundlagen', 'multipleChoice', 10),
  ('gl-2', 'grundlagen', 'urlTrainer', 10),
  ('gl-3', 'grundlagen', 'multipleChoice', 10),
  ('gl-4', 'grundlagen', 'multipleChoice', 10),
  ('gl-5', 'grundlagen', 'multipleChoice', 10),
  ('gl-6', 'grundlagen', 'vervollstaendigen', 10),
  ('gl-7', 'grundlagen', 'memory', 20),
  ('scam-l1-phishing', 'scamming', 'warnzeichen', 10),
  ('scam-l1-smishing', 'scamming', 'nextStep', 10),
  ('scam-l1-enkeltrick', 'scamming', 'audioAuswahl', 10),
  ('scam-l1-schockanruf', 'scamming', 'audioAuswahl', 10),
  ('scam-l2-spoofing', 'scamming', 'fall', 10),
  ('scam-l2-vishing', 'scamming', 'audioAuswahl', 10),
  ('scam-l2-lovescam', 'scamming', 'fall', 10),
  ('scam-l2-gewinn', 'scamming', 'fall', 10),
  ('scam-memory-8', 'scamming', 'memory', 20),
  ('news-1', 'news', 'multipleChoice', 10),
  ('news-2', 'news', 'fall', 10),
  ('news-3', 'news', 'vervollstaendigen', 10),
  ('news-4', 'news', 'memory', 20),
  ('news-5', 'news', 'multipleChoice', 10),
  ('sm-1', 'socialmedia', 'multipleChoice', 10),
  ('sm-2', 'socialmedia', 'fall', 10),
  ('sm-3', 'socialmedia', 'vervollstaendigen', 10),
  ('sm-4', 'socialmedia', 'memory', 20),
  ('sm-5', 'socialmedia', 'multipleChoice', 10)
on conflict (id) do update
set
  category_id = excluded.category_id,
  exercise_type = excluded.exercise_type,
  xp_reward = excluded.xp_reward,
  is_active = true;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (user_id) do nothing;

  insert into public.user_stats (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists users_create_profile on auth.users;
create trigger users_create_profile
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists user_stats_set_updated_at on public.user_stats;
create trigger user_stats_set_updated_at
before update on public.user_stats
for each row execute function public.set_updated_at();

drop trigger if exists learning_exercises_set_updated_at on public.learning_exercises;
create trigger learning_exercises_set_updated_at
before update on public.learning_exercises
for each row execute function public.set_updated_at();

drop trigger if exists learning_progress_set_updated_at on public.learning_progress;
create trigger learning_progress_set_updated_at
before update on public.learning_progress
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_stats enable row level security;
alter table public.learning_exercises enable row level security;
alter table public.learning_progress enable row level security;
alter table public.exercise_attempts enable row level security;

create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "user_stats_select_own"
on public.user_stats for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "user_stats_insert_own"
on public.user_stats for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "user_stats_update_own"
on public.user_stats for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "learning_exercises_select_active"
on public.learning_exercises for select
to authenticated
using (is_active);

create policy "learning_progress_select_own"
on public.learning_progress for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "learning_progress_insert_own"
on public.learning_progress for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "learning_progress_update_own"
on public.learning_progress for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "learning_progress_delete_own"
on public.learning_progress for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "exercise_attempts_select_own"
on public.exercise_attempts for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "exercise_attempts_insert_own"
on public.exercise_attempts for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "exercise_attempts_delete_own"
on public.exercise_attempts for delete
to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.record_learning_attempt(
  p_exercise_id text,
  p_correct boolean,
  p_answer jsonb default null
)
returns public.exercise_attempts
language plpgsql
security invoker
set search_path = public
as $$
declare
  current_user_id uuid := (select auth.uid());
  exercise public.learning_exercises;
  result public.exercise_attempts;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select *
  into exercise
  from public.learning_exercises
  where id = p_exercise_id
    and is_active;

  if exercise.id is null then
    raise exception 'Unknown or inactive exercise';
  end if;

  insert into public.exercise_attempts (
    user_id,
    exercise_id,
    category_id,
    exercise_type,
    correct,
    xp_earned,
    answer
  )
  values (
    current_user_id,
    exercise.id,
    exercise.category_id,
    exercise.exercise_type,
    coalesce(p_correct, false),
    case when coalesce(p_correct, false) then exercise.xp_reward else 0 end,
    p_answer
  )
  returning * into result;

  return result;
end;
$$;

create or replace function public.complete_learning_exercises(p_exercise_ids text[])
returns public.user_stats
language plpgsql
security invoker
set search_path = public
as $$
declare
  current_user_id uuid := (select auth.uid());
  awarded_xp integer := 0;
  result public.user_stats;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  with requested_exercises as (
    select distinct unnest(coalesce(p_exercise_ids, array[]::text[])) as id
  ),
  valid_exercises as (
    select exercise.id, exercise.category_id, exercise.exercise_type, exercise.xp_reward
    from requested_exercises requested
    join public.learning_exercises exercise on exercise.id = requested.id
    where exercise.is_active
  ),
  inserted_progress as (
    insert into public.learning_progress (
      user_id,
      exercise_id,
      category_id,
      exercise_type,
      xp_earned
    )
    select
      current_user_id,
      id,
      category_id,
      exercise_type,
      xp_reward
    from valid_exercises
    on conflict (user_id, exercise_id) do nothing
    returning exercise_id, category_id, exercise_type, xp_earned
  )
  select coalesce(sum(xp_earned), 0)
  into awarded_xp
  from inserted_progress;

  insert into public.user_stats (
    user_id,
    xp,
    streak,
    last_activity_date
  )
  values (
    current_user_id,
    awarded_xp,
    1,
    case when awarded_xp > 0 then current_date else null end
  )
  on conflict (user_id) do update
  set
    xp = public.user_stats.xp + awarded_xp,
    streak = case
      when awarded_xp = 0 then public.user_stats.streak
      when public.user_stats.last_activity_date = current_date then public.user_stats.streak
      when public.user_stats.last_activity_date = current_date - 1 then public.user_stats.streak + 1
      else 1
    end,
    last_activity_date = case
      when awarded_xp > 0 then current_date
      else public.user_stats.last_activity_date
    end
  returning * into result;

  return result;
end;
$$;

grant usage on schema public to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.user_stats to authenticated;
grant select on public.learning_exercises to authenticated;
grant select, insert, update, delete on public.learning_progress to authenticated;
grant select, insert, delete on public.exercise_attempts to authenticated;
grant execute on function public.record_learning_attempt(text, boolean, jsonb) to authenticated;
grant execute on function public.complete_learning_exercises(text[]) to authenticated;
