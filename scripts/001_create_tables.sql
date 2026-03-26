-- Salt & Stone AU Supabase Schema
-- customer_profiles, skin_quiz_results, promotions, promotion_usage

-- 1. Customer Profiles (extends auth.users)
create table if not exists public.customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  phone text,
  skin_type text,
  skin_concerns text[],
  shopify_customer_id text,
  ghl_contact_id text,
  marketing_consent boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.customer_profiles enable row level security;

create policy "profiles_select_own" on public.customer_profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.customer_profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.customer_profiles
  for update using (auth.uid() = id);

-- 2. Skin Quiz Results
create table if not exists public.skin_quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  session_id text not null,
  answers jsonb not null,
  skin_type text not null,
  recommended_products text[],
  created_at timestamptz default now()
);

alter table public.skin_quiz_results enable row level security;

create policy "quiz_select_own" on public.skin_quiz_results
  for select using (auth.uid() = user_id);
create policy "quiz_insert_anyone" on public.skin_quiz_results
  for insert with check (true);

-- 3. Promotions
create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric not null,
  min_order_value numeric default 0,
  max_uses integer,
  current_uses integer default 0,
  starts_at timestamptz not null,
  expires_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.promotions enable row level security;

create policy "promotions_select_active" on public.promotions
  for select using (is_active = true and (expires_at is null or expires_at > now()));

-- 4. Promotion Usage
create table if not exists public.promotion_usage (
  id uuid primary key default gen_random_uuid(),
  promotion_id uuid references public.promotions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  order_id text,
  used_at timestamptz default now()
);

alter table public.promotion_usage enable row level security;

create policy "usage_select_own" on public.promotion_usage
  for select using (auth.uid() = user_id);
create policy "usage_insert_own" on public.promotion_usage
  for insert with check (auth.uid() = user_id);

-- 5. Auto-create profile on signup trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.customer_profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', null),
    coalesce(new.raw_user_meta_data ->> 'last_name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- 6. Updated_at trigger for customer_profiles
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger customer_profiles_updated_at
  before update on public.customer_profiles
  for each row
  execute function public.update_updated_at();

-- 7. Shopify Config (persisted tokens, service-role only)
create table if not exists public.shopify_config (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

alter table public.shopify_config enable row level security;

create policy "service_role_only" on public.shopify_config
  using (false);
