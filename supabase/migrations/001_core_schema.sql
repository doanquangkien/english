-- ============================================================
-- Migration 001: Core Schema — Auth & Authorization
-- Phase 01 — ENGLISH Platform
-- ============================================================

-- 1. ENUM TYPES
-- ============================================================
create type public.user_role as enum ('student', 'teacher', 'admin', 'super_admin');
create type public.cefr_level as enum ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- 2. TABLES
-- ============================================================

-- 2.1 organizations
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_id uuid, -- FK added after profiles
  plan text not null default 'free',
  created_at timestamptz not null default now()
);

-- 2.2 profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid references public.organizations(id) on delete set null,
  display_name text,
  username text unique,
  avatar_url text,
  role public.user_role not null default 'student',
  cefr_level public.cefr_level,
  native_language text not null default 'vi',
  timezone text not null default 'Asia/Ho_Chi_Minh',
  daily_goal_minutes int not null default 15,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  total_xp bigint not null default 0,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add FK for organizations.owner_id after profiles exists
alter table public.organizations
  add constraint fk_organizations_owner
  foreign key (owner_id) references public.profiles(id) on delete set null;

-- 2.3 permissions (static seed data)
create table public.permissions (
  role public.user_role not null,
  resource text not null,
  action text not null check (action in ('create', 'read', 'update', 'delete', 'publish')),
  allowed boolean not null default false,
  primary key (role, resource, action)
);

-- 3. INDEXES
-- ============================================================
create index idx_profiles_role on public.profiles(role);
create index idx_profiles_org_id on public.profiles(org_id);
create index idx_permissions_role_resource on public.permissions(role, resource);

-- 4. FUNCTIONS & TRIGGERS
-- ============================================================

-- 4.1 Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- Attach trigger to auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- 4.2 Helper: get current user's role (for RLS policies)
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- 4.3 Auto-update updated_at
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();

-- 5. RLS — ENABLE ON ALL TABLES
-- ============================================================
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.permissions enable row level security;

-- 6. GRANT PRIVILEGES
-- ============================================================
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.organizations to authenticated;
grant select on public.permissions to authenticated;

grant select on public.profiles to anon;
grant select on public.organizations to anon;

-- 7. RLS POLICIES — profiles
-- ============================================================

-- Anyone can read their own profile; admins can read all
create policy "profiles_select_own_or_admin" on public.profiles
  for select
  using (
    id = auth.uid()
    or public.current_user_role() in ('admin', 'super_admin')
  );

-- Authenticated users can insert their own profile
create policy "profiles_insert_own" on public.profiles
  for insert
  with check (id = auth.uid());

-- Users can update their own profile; admins can update any
create policy "profiles_update_own_or_admin" on public.profiles
  for update
  using (
    id = auth.uid()
    or public.current_user_role() in ('admin', 'super_admin')
  );

-- Only super_admin can delete profiles
create policy "profiles_delete_super_admin" on public.profiles
  for delete
  using (public.current_user_role() = 'super_admin');

-- 8. RLS POLICIES — organizations
-- ============================================================

-- Anyone authenticated can read organizations
create policy "organizations_select_authenticated" on public.organizations
  for select
  using (auth.uid() is not null);

-- Authenticated users can create organizations
create policy "organizations_insert_authenticated" on public.organizations
  for insert
  with check (auth.uid() is not null);

-- Owner or admin can update
create policy "organizations_update_owner_or_admin" on public.organizations
  for update
  using (
    owner_id = auth.uid()
    or public.current_user_role() in ('admin', 'super_admin')
  );

-- Only super_admin can delete organizations
create policy "organizations_delete_super_admin" on public.organizations
  for delete
  using (public.current_user_role() = 'super_admin');

-- 9. RLS POLICIES — permissions
-- ============================================================

-- All authenticated users can read permissions
create policy "permissions_select_authenticated" on public.permissions
  for select
  using (auth.uid() is not null);

-- Only super_admin can modify permissions
create policy "permissions_insert_super_admin" on public.permissions
  for insert
  with check (public.current_user_role() = 'super_admin');

create policy "permissions_update_super_admin" on public.permissions
  for update
  using (public.current_user_role() = 'super_admin');

create policy "permissions_delete_super_admin" on public.permissions
  for delete
  using (public.current_user_role() = 'super_admin');

-- 10. SEED DATA — permissions
-- ============================================================

-- Phase 01 resources: profiles, organizations
-- Matrix from SPEC Chapter 5.4

-- student
insert into public.permissions (role, resource, action, allowed) values
  ('student', 'profiles', 'create', false),
  ('student', 'profiles', 'read', true),
  ('student', 'profiles', 'update', true),    -- own profile only (enforced by RLS)
  ('student', 'profiles', 'delete', false),
  ('student', 'organizations', 'create', false),
  ('student', 'organizations', 'read', true),
  ('student', 'organizations', 'update', false),
  ('student', 'organizations', 'delete', false);

-- teacher
insert into public.permissions (role, resource, action, allowed) values
  ('teacher', 'profiles', 'create', false),
  ('teacher', 'profiles', 'read', true),
  ('teacher', 'profiles', 'update', true),    -- own profile only
  ('teacher', 'profiles', 'delete', false),
  ('teacher', 'organizations', 'create', true),
  ('teacher', 'organizations', 'read', true),
  ('teacher', 'organizations', 'update', true), -- own org
  ('teacher', 'organizations', 'delete', false);

-- admin
insert into public.permissions (role, resource, action, allowed) values
  ('admin', 'profiles', 'create', false),
  ('admin', 'profiles', 'read', true),
  ('admin', 'profiles', 'update', true),
  ('admin', 'profiles', 'delete', false),
  ('admin', 'organizations', 'create', true),
  ('admin', 'organizations', 'read', true),
  ('admin', 'organizations', 'update', true),
  ('admin', 'organizations', 'delete', true);

-- super_admin
insert into public.permissions (role, resource, action, allowed) values
  ('super_admin', 'profiles', 'create', true),
  ('super_admin', 'profiles', 'read', true),
  ('super_admin', 'profiles', 'update', true),
  ('super_admin', 'profiles', 'delete', true),
  ('super_admin', 'organizations', 'create', true),
  ('super_admin', 'organizations', 'read', true),
  ('super_admin', 'organizations', 'update', true),
  ('super_admin', 'organizations', 'delete', true);
