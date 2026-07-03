-- ============================================================
-- Beauty Ballons — Schema v2 (Final corregido)
-- Aplica correcciones C1-C9 + R1-R6 de la auditoría técnica
-- ============================================================

create extension if not exists "pgcrypto";

-- ── Función: updated_at automático ────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql security definer set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- ── Funciones singleton (C2) ─────────────────────────────────
create or replace function public.enforce_site_config_singleton()
returns trigger language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.site_config limit 1) then raise exception 'site_config: usar UPDATE, no INSERT'; end if; return new; end; $$;

create or replace function public.enforce_seo_config_singleton()
returns trigger language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.seo_config limit 1) then raise exception 'seo_config: usar UPDATE, no INSERT'; end if; return new; end; $$;

create or replace function public.enforce_hero_section_singleton()
returns trigger language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.hero_section limit 1) then raise exception 'hero_section: usar UPDATE, no INSERT'; end if; return new; end; $$;

-- ── Tabla de admins (C1) ──────────────────────────────────────
create table public.admin_users (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'editor',
  created_at timestamptz not null default now(),
  constraint chk_admin_role check (role in ('owner','editor'))
);
alter table public.admin_users enable row level security;

-- ── Funciones helper de roles (C1) ───────────────────────────
create or replace function public.is_admin() returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.admin_users where id = auth.uid()); $$;

create or replace function public.is_owner() returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner'); $$;

-- Políticas admin_users
create policy "admin_users_select_owner" on public.admin_users for select using (public.is_owner());
create policy "admin_users_insert_owner" on public.admin_users for insert with check (public.is_owner());
create policy "admin_users_delete_owner" on public.admin_users for delete using (public.is_owner());

-- ── site_config ───────────────────────────────────────────────
create table public.site_config (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'Beauty Ballons',
  tagline text, logo_url text, logo_dark_url text, favicon_url text,
  color_primary text not null default '#D4618C',
  color_secondary text not null default '#9B6FD4',
  color_accent text, color_background text not null default '#FFFBFE', color_text text not null default '#1C1B1F',
  font_heading text not null default 'Playfair Display', font_body text not null default 'Inter',
  whatsapp_number text not null default '521234567890',
  whatsapp_default_msg text not null default 'Hola Beauty Ballons! 🎈 Me gustaría cotizar una decoración para mi evento.',
  whatsapp_float_visible boolean not null default true,
  navbar_cta_text text not null default 'Cotizar',
  cta_final_btn_text text not null default 'Cotizar ahora por WhatsApp',
  show_mini_form boolean not null default true, mini_form_placeholder text,
  metric_1_value text not null default '+50', metric_1_label text not null default 'Eventos realizados',
  metric_2_value text not null default '1-2 hrs', metric_2_label text not null default 'Respuesta cotización',
  metric_3_value text not null default 'ZMG', metric_3_label text not null default 'Zona de cobertura',
  trust_bar_visible boolean not null default true,
  coverage_zone text not null default 'Zona Metropolitana de Guadalajara',
  response_time text not null default '1 a 2 horas', events_count integer not null default 50,
  price_range text default '$$', opening_hours text default 'Mo-Su 09:00-20:00',
  legal_text text, privacy_policy_url text, maintenance_mode boolean not null default false, maintenance_msg text,
  updated_at timestamptz not null default now(),
  constraint chk_color_primary    check (color_primary    ~ '^#[0-9A-Fa-f]{3,6}$'),
  constraint chk_color_secondary  check (color_secondary  ~ '^#[0-9A-Fa-f]{3,6}$'),
  constraint chk_color_background check (color_background ~ '^#[0-9A-Fa-f]{3,6}$'),
  constraint chk_color_text       check (color_text       ~ '^#[0-9A-Fa-f]{3,6}$'),
  constraint chk_site_name_len    check (char_length(site_name) between 2 and 60),
  constraint chk_wa_number_format check (whatsapp_number ~ '^\d{10,15}$')
);
create trigger trg_site_config_updated_at before update on public.site_config for each row execute function public.set_updated_at();
create trigger trg_site_config_singleton before insert on public.site_config for each row execute function public.enforce_site_config_singleton();

-- ── seo_config ────────────────────────────────────────────────
create table public.seo_config (
  id uuid primary key default gen_random_uuid(),
  meta_title text not null default 'Beauty Ballons | Decoración de Eventos en Guadalajara',
  meta_description text not null default 'Decoración de eventos con globos en Guadalajara, Zapopan y ZMG.',
  meta_keywords text[], og_title text, og_description text,
  og_image_url text not null default '', canonical_url text not null default 'https://beautyballons.vercel.app',
  schema_city text not null default 'Guadalajara', schema_region text not null default 'Jalisco',
  schema_country text not null default 'MX',
  schema_area_served text[] not null default array['Guadalajara','Zapopan','Tlaquepaque','Tonalá','Tlajomulco de Zúñiga'],
  google_analytics_id text, meta_pixel_id text, tiktok_pixel_id text,
  updated_at timestamptz not null default now(),
  constraint chk_meta_title_len check (char_length(meta_title) <= 60),
  constraint chk_meta_desc_len  check (char_length(meta_description) <= 160)
);
create trigger trg_seo_config_updated_at before update on public.seo_config for each row execute function public.set_updated_at();
create trigger trg_seo_config_singleton before insert on public.seo_config for each row execute function public.enforce_seo_config_singleton();

-- ── social_links ──────────────────────────────────────────────
create table public.social_links (
  id uuid primary key default gen_random_uuid(), platform text not null, url text not null,
  username text, is_active boolean not null default true, sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  constraint chk_platform check (platform in ('instagram','facebook','tiktok','youtube','twitter')),
  constraint chk_url_format check (url ~ '^https?://'),
  constraint uq_platform unique (platform)
);
create index idx_social_links_active on public.social_links (is_active, sort_order);
create trigger trg_social_links_updated_at before update on public.social_links for each row execute function public.set_updated_at();

-- ── hero_section ──────────────────────────────────────────────
create table public.hero_section (
  id uuid primary key default gen_random_uuid(),
  badge_text text, headline text not null default 'Hacemos tu evento único e inolvidable', headline_em text, subheadline text,
  cta_primary_text text not null default 'Cotizar por WhatsApp', cta_primary_action text not null default 'whatsapp',
  cta_secondary_text text, cta_secondary_action text,
  bg_image_url text not null default '', bg_image_mobile_url text,
  bg_overlay_opacity real not null default 0.5, show_balloons boolean not null default true,
  text_align text not null default 'left', updated_at timestamptz not null default now(),
  constraint chk_headline_len check (char_length(headline) between 3 and 60),
  constraint chk_overlay_range check (bg_overlay_opacity between 0.0 and 0.9),
  constraint chk_text_align check (text_align in ('left','center')),
  constraint chk_cta_primary_action check (cta_primary_action in ('whatsapp','scroll_portfolio','scroll_services','scroll_contact'))
);
create trigger trg_hero_updated_at before update on public.hero_section for each row execute function public.set_updated_at();
create trigger trg_hero_singleton before insert on public.hero_section for each row execute function public.enforce_hero_section_singleton();

-- ── section_labels (R2: sin CHECK de section_key) ────────────
create table public.section_labels (
  id uuid primary key default gen_random_uuid(), section_key text not null, title text not null, subtitle text,
  updated_at timestamptz not null default now(),
  constraint uq_section_key unique (section_key), constraint chk_title_len check (char_length(title) between 2 and 80)
);
create trigger trg_section_labels_updated_at before update on public.section_labels for each row execute function public.set_updated_at();

-- ── process_steps (C7, R3) ────────────────────────────────────
create table public.process_steps (
  id uuid primary key default gen_random_uuid(), step_number integer not null,
  icon text not null, title text not null, description text not null,
  is_active boolean not null default true, sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  constraint uq_step_number unique (step_number),
  constraint chk_title_len check (char_length(title) between 2 and 30),
  constraint chk_description_len check (char_length(description) between 2 and 80)
);
create index idx_process_steps_active on public.process_steps (is_active, sort_order);
create trigger trg_process_steps_updated_at before update on public.process_steps for each row execute function public.set_updated_at();

-- ── service_categories ────────────────────────────────────────
create table public.service_categories (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null,
  is_active boolean not null default true, sort_order integer not null default 0, created_at timestamptz not null default now(),
  constraint uq_service_category_slug unique (slug),
  constraint chk_service_category_name check (char_length(name) between 2 and 40)
);
create index idx_service_categories_active on public.service_categories (is_active, sort_order);

-- ── services (R6) ─────────────────────────────────────────────
create table public.services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.service_categories(id) on delete set null,
  created_by uuid references public.admin_users(id) on delete set null,
  name text not null, icon text not null, short_description text, cover_image_url text,
  whatsapp_msg text not null, is_featured boolean not null default false,
  is_active boolean not null default true, sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint chk_service_name_len check (char_length(name) between 3 and 40),
  constraint chk_service_wa_len check (char_length(whatsapp_msg) between 10 and 200)
);
create index idx_services_featured on public.services (is_featured, is_active, sort_order) where is_active = true;
create index idx_services_category on public.services (category_id);
create trigger trg_services_updated_at before update on public.services for each row execute function public.set_updated_at();

-- ── portfolio_categories ──────────────────────────────────────
create table public.portfolio_categories (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null,
  is_active boolean not null default true, sort_order integer not null default 0, created_at timestamptz not null default now(),
  constraint uq_portfolio_category_slug unique (slug),
  constraint chk_portfolio_category_name check (char_length(name) between 2 and 30)
);
create index idx_portfolio_categories_active on public.portfolio_categories (is_active, sort_order);

-- ── portfolio_photos (C7, C8, R4, R5, R6) ────────────────────
create table public.portfolio_photos (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.portfolio_categories(id) on delete restrict,
  created_by uuid references public.admin_users(id) on delete set null,
  image_url text not null check (image_url ~ '^https?://'),
  thumbnail_url text not null check (thumbnail_url ~ '^https?://'),
  alt_text text not null, caption text, whatsapp_msg text,
  is_featured boolean not null default false, is_active boolean not null default true,
  sort_order integer not null default 0,
  width integer not null, height integer not null,
  uploaded_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint chk_alt_text_len check (char_length(alt_text) between 5 and 100),
  constraint chk_dimensions check (width > 0 and height > 0)
);
create index idx_portfolio_photos_featured on public.portfolio_photos (is_featured, is_active, sort_order) where is_active = true;
create index idx_portfolio_photos_category on public.portfolio_photos (category_id, is_active, sort_order);
create index idx_portfolio_photos_featured_category on public.portfolio_photos (is_featured, category_id, sort_order) where is_active = true;
create trigger trg_portfolio_photos_updated_at before update on public.portfolio_photos for each row execute function public.set_updated_at();

-- ── testimonials (C3, R1, R6) ─────────────────────────────────
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references public.admin_users(id) on delete set null,
  client_name text not null, event_type text not null, location text,
  rating integer not null, content text not null,
  is_featured boolean not null default false, is_active boolean not null default true,
  sort_order integer not null default 0, created_at timestamptz not null default now(),
  constraint chk_rating check (rating between 1 and 5),
  constraint chk_client_name_len check (char_length(client_name) between 2 and 30),
  constraint chk_content_len check (char_length(content) between 20 and 200),
  constraint chk_featured_rating check (is_featured = false or rating = 5)
);
create unique index uq_one_featured_testimonial on public.testimonials (is_featured) where is_featured = true;
create index idx_testimonials_featured on public.testimonials (is_featured, is_active, sort_order) where is_active = true;
create index idx_testimonials_rating on public.testimonials (rating, is_active);

-- ── faqs (C7, R6) ────────────────────────────────────────────
create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references public.admin_users(id) on delete set null,
  question text not null, answer text not null,
  cta_in_answer boolean not null default false, is_active boolean not null default true,
  sort_order integer not null default 0, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_question_len check (char_length(question) between 10 and 120),
  constraint chk_answer_len check (char_length(answer) between 20 and 400)
);
create index idx_faqs_active on public.faqs (is_active, sort_order);
create trigger trg_faqs_updated_at before update on public.faqs for each row execute function public.set_updated_at();

-- ── leads (C5, R1) ────────────────────────────────────────────
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null, whatsapp text, event_type text, event_date date,
  location text, message text, status text not null default 'new', source text not null default 'unknown',
  utm_source text, utm_medium text, utm_campaign text, device_type text,
  admin_notes text, is_read boolean not null default false, is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  constraint chk_lead_status check (status in ('new','contacted','quoted','closed','lost')),
  constraint chk_lead_source check (source in ('hero','service','portfolio','lightbox','float','cta_final','faq','unknown')),
  constraint chk_lead_name_len check (char_length(name) between 2 and 60),
  constraint chk_lead_message_len check (message is null or char_length(message) <= 500),
  constraint chk_device_type check (device_type is null or device_type in ('mobile','desktop','tablet'))
);
create index idx_leads_status on public.leads (status, created_at desc);
create index idx_leads_unread on public.leads (is_read, is_archived, created_at desc) where is_archived = false;
create index idx_leads_source on public.leads (source, created_at desc);
create index idx_leads_event_date on public.leads (event_date) where event_date is not null;

-- ══ RLS ══════════════════════════════════════════════════════
alter table public.site_config enable row level security;
alter table public.seo_config enable row level security;
alter table public.social_links enable row level security;
alter table public.hero_section enable row level security;
alter table public.section_labels enable row level security;
alter table public.process_steps enable row level security;
alter table public.service_categories enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_categories enable row level security;
alter table public.portfolio_photos enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.leads enable row level security;

-- site_config
create policy "site_config_select_public" on public.site_config for select using (true);
create policy "site_config_update_owner" on public.site_config for update using (public.is_owner()) with check (public.is_owner());

-- seo_config
create policy "seo_config_select_public" on public.seo_config for select using (true);
create policy "seo_config_update_owner" on public.seo_config for update using (public.is_owner()) with check (public.is_owner());

-- social_links
create policy "social_links_select_public" on public.social_links for select using (true);
create policy "social_links_insert_owner" on public.social_links for insert with check (public.is_owner());
create policy "social_links_update_owner" on public.social_links for update using (public.is_owner()) with check (public.is_owner());
create policy "social_links_delete_owner" on public.social_links for delete using (public.is_owner());

-- hero_section
create policy "hero_section_select_public" on public.hero_section for select using (true);
create policy "hero_section_update_owner" on public.hero_section for update using (public.is_owner()) with check (public.is_owner());

-- section_labels
create policy "section_labels_select_public" on public.section_labels for select using (true);
create policy "section_labels_update_owner" on public.section_labels for update using (public.is_owner()) with check (public.is_owner());

-- process_steps
create policy "process_steps_select_public" on public.process_steps for select using (true);
create policy "process_steps_update_owner" on public.process_steps for update using (public.is_owner()) with check (public.is_owner());

-- service_categories
create policy "service_categories_select_public" on public.service_categories for select using (true);
create policy "service_categories_insert_owner" on public.service_categories for insert with check (public.is_owner());
create policy "service_categories_update_owner" on public.service_categories for update using (public.is_owner()) with check (public.is_owner());
create policy "service_categories_delete_owner" on public.service_categories for delete using (public.is_owner());

-- services (C4: política SELECT unificada)
create policy "services_select" on public.services for select using (is_active = true or public.is_admin());
create policy "services_insert_owner" on public.services for insert with check (public.is_owner());
create policy "services_update_owner" on public.services for update using (public.is_owner()) with check (public.is_owner());
create policy "services_delete_owner" on public.services for delete using (public.is_owner());

-- portfolio_categories
create policy "portfolio_categories_select_public" on public.portfolio_categories for select using (true);
create policy "portfolio_categories_insert_owner" on public.portfolio_categories for insert with check (public.is_owner());
create policy "portfolio_categories_update_owner" on public.portfolio_categories for update using (public.is_owner()) with check (public.is_owner());
create policy "portfolio_categories_delete_owner" on public.portfolio_categories for delete using (public.is_owner());

-- portfolio_photos (C4, Owner + Editor)
create policy "portfolio_photos_select" on public.portfolio_photos for select using (is_active = true or public.is_admin());
create policy "portfolio_photos_insert_admin" on public.portfolio_photos for insert with check (public.is_admin());
create policy "portfolio_photos_update_admin" on public.portfolio_photos for update using (public.is_admin()) with check (public.is_admin());
create policy "portfolio_photos_delete_owner" on public.portfolio_photos for delete using (public.is_owner());

-- testimonials (C4)
create policy "testimonials_select" on public.testimonials for select using (is_active = true or public.is_admin());
create policy "testimonials_insert_owner" on public.testimonials for insert with check (public.is_owner());
create policy "testimonials_update_owner" on public.testimonials for update using (public.is_owner()) with check (public.is_owner());
create policy "testimonials_delete_owner" on public.testimonials for delete using (public.is_owner());

-- faqs (C4)
create policy "faqs_select" on public.faqs for select using (is_active = true or public.is_admin());
create policy "faqs_insert_owner" on public.faqs for insert with check (public.is_owner());
create policy "faqs_update_owner" on public.faqs for update using (public.is_owner()) with check (public.is_owner());
create policy "faqs_delete_owner" on public.faqs for delete using (public.is_owner());

-- leads (C5)
create policy "leads_insert_public" on public.leads for insert with check (
  status = 'new' and is_read = false and is_archived = false and admin_notes is null
  and source in ('hero','service','portfolio','lightbox','float','cta_final','faq','unknown')
  and char_length(name) >= 2
);
create policy "leads_select_admin" on public.leads for select using (public.is_admin());
create policy "leads_update_admin" on public.leads for update using (public.is_admin()) with check (public.is_admin());
create policy "leads_delete_owner" on public.leads for delete using (public.is_owner());

-- ══ STORAGE ══════════════════════════════════════════════════
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('beauty-ballons', 'beauty-ballons', true, 20971520,
  array['image/jpeg','image/jpg','image/png','image/webp','image/heic','image/heif'])
on conflict (id) do nothing;

create policy "storage_public_read" on storage.objects for select using (bucket_id = 'beauty-ballons');
create policy "storage_admin_insert" on storage.objects for insert with check (bucket_id = 'beauty-ballons' and public.is_admin());
create policy "storage_admin_update" on storage.objects for update using (bucket_id = 'beauty-ballons' and public.is_admin());
create policy "storage_owner_delete" on storage.objects for delete using (bucket_id = 'beauty-ballons' and public.is_owner());
