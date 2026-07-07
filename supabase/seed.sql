-- ============================================================
-- SEED — Beauty Ballons
-- Datos reales del negocio para iniciar la plataforma
-- Ejecutar DESPUÉS de 0001_initial_schema.sql
-- ============================================================

-- ── site_config ─────────────────────────────────────────────
INSERT INTO public.site_config (
  site_name, tagline, logo_url,
  color_primary, color_secondary, color_accent,
  color_background, color_text,
  whatsapp_number, whatsapp_default_msg, navbar_cta_text,
  coverage_zone, price_range, opening_hours,
  metric_1_value, metric_1_label,
  metric_2_value, metric_2_label,
  metric_3_value, metric_3_label,
  trust_bar_visible, whatsapp_float_visible,
  maintenance_mode
) VALUES (
  'Beauty Ballons',
  'Decoración de eventos con estilo y amor',
  NULL,
  '#C8517A', '#9B6FD4', '#C9963A',
  '#FDF6EE', '#1C0A16',
  '523322942088',
  'Hola Beauty Ballons! Me gustaría cotizar una decoración para mi evento.',
  'Cotizar',
  'Guadalajara · Zapopan · ZMG',
  '$$',
  'Mo-Su 09:00-20:00',
  '+50',  'Eventos realizados',
  '+100', 'Familias felices',
  'ZMG',  'Guadalajara y área',
  true, true,
  false
);

-- ── seo_config ───────────────────────────────────────────────
INSERT INTO public.seo_config (
  meta_title, meta_description,
  canonical_url,
  og_image_url,
  schema_city, schema_region, schema_country,
  schema_area_served,
  google_analytics_id, meta_pixel_id
) VALUES (
  'Beauty Ballons | Decoración de Eventos en Guadalajara',
  'Decoración de eventos con globos, centros de mesa, velas y recuerditos en Guadalajara. Bodas, XV Años, Baby Shower y más. ¡Cotiza por WhatsApp!',
  'https://beautyballons.vercel.app',
  NULL,
  'Guadalajara', 'Jalisco', 'MX',
  ARRAY['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Tonalá', 'Tlajomulco de Zúñiga'],
  NULL, NULL
);

-- ── hero_section ─────────────────────────────────────────────
INSERT INTO public.hero_section (
  headline, headline_em, subheadline,
  badge_text,
  bg_image_url, bg_overlay_opacity,
  cta_primary_text,   cta_primary_action,
  cta_secondary_text, cta_secondary_action,
  show_balloons, text_align
) VALUES (
  'Cada detalle',
  'perfectamente decorado',
  'Globos, centros de mesa, velas y recuerditos. Cotiza sin compromiso y recibe atención personalizada.',
  '🎈 Guadalajara · Zapopan · ZMG',
  NULL, 0.45,
  'Cotizar sin compromiso', 'whatsapp',
  'Ver nuestros trabajos',  'scroll_portafolio',
  false, 'left'
);

-- ── section_labels ───────────────────────────────────────────
INSERT INTO public.section_labels (section_key, title, subtitle) VALUES
  ('portfolio',     'Nuestros trabajos',        'Cada evento es único — ve lo que hemos creado'),
  ('services',      'necesitas?',               'Toca el servicio para cotizar al instante'),
  ('process',       'sencillo',                 NULL),
  ('testimonials',  'de nosotros',              NULL),
  ('faq',           'Todo lo que necesitas saber', NULL),
  ('cta_final',     'lo mejor',                 'Sin compromiso. Solo cuéntanos de tu evento.');

-- ── service_categories ───────────────────────────────────────
INSERT INTO public.service_categories (name, slug, sort_order, is_active) VALUES
  ('Globos',          'globos',       1, true),
  ('Decoración',      'decoracion',   2, true),
  ('Mesas y detalles','mesas',        3, true),
  ('Eventos',         'eventos',      4, true);

-- ── services ─────────────────────────────────────────────────
DO $$
DECLARE
  v_globos   uuid;
  v_decor    uuid;
  v_mesas    uuid;
  v_eventos  uuid;
BEGIN
  SELECT id INTO v_globos  FROM public.service_categories WHERE slug = 'globos';
  SELECT id INTO v_decor   FROM public.service_categories WHERE slug = 'decoracion';
  SELECT id INTO v_mesas   FROM public.service_categories WHERE slug = 'mesas';
  SELECT id INTO v_eventos FROM public.service_categories WHERE slug = 'eventos';

  INSERT INTO public.services (category_id, name, icon, description, whatsapp_msg, sort_order, is_featured, is_active) VALUES
    (v_globos,  'Arco de globos',     '🌸', 'Arcos personalizados para cualquier evento',
     'Hola! Me interesa cotizar un *arco de globos*. ¿Pueden ayudarme?', 1, true, true),
    (v_decor,   'Decoración de salón','✨', 'Transformamos cualquier espacio en algo mágico',
     'Hola! Me interesa cotizar *decoración de salón*. ¿Pueden ayudarme?', 2, true, true),
    (v_mesas,   'Centros de mesa',    '💐', 'Diseños únicos para cada mesa de tu evento',
     'Hola! Me interesa cotizar *centros de mesa*. ¿Pueden ayudarme?', 3, true, true),
    (v_mesas,   'Velas decorativas',  '🕯️', 'Velas personalizadas que dan ambiente especial',
     'Hola! Me interesa cotizar *velas decorativas*. ¿Pueden ayudarme?', 4, true, true),
    (v_mesas,   'Recuerditos',        '🎁', 'Recuerdos personalizados para tus invitados',
     'Hola! Me interesa cotizar *recuerditos personalizados*. ¿Pueden ayudarme?', 5, true, true),
    (v_globos,  'Globos con helio',   '🎈', 'Globos de helio para cualquier ocasión',
     'Hola! Me interesa cotizar *globos con helio*. ¿Pueden ayudarme?', 6, true, true),
    (v_eventos, 'Baby Shower',        '👶', 'Decoración especial para recibir al bebé',
     'Hola! Me interesa cotizar decoración para *Baby Shower*. ¿Pueden ayudarme?', 7, true, true),
    (v_eventos, 'XV Años',            '👑', 'Celebra sus XV con la decoración más especial',
     'Hola! Me interesa cotizar decoración para *XV Años*. ¿Pueden ayudarme?', 8, true, true),
    (v_eventos, 'Boda',               '💍', 'Haz de tu boda un momento inolvidable',
     'Hola! Me interesa cotizar decoración para *Boda*. ¿Pueden ayudarme?', 9, true, true),
    (v_eventos, 'Cumpleaños',         '🎂', 'Celebraciones llenas de color y alegría',
     'Hola! Me interesa cotizar decoración para *Cumpleaños*. ¿Pueden ayudarme?', 10, true, true),
    (v_mesas,   'Mesa de dulces',     '🍭', 'Mesas de dulces decoradas con estilo',
     'Hola! Me interesa cotizar una *mesa de dulces*. ¿Pueden ayudarme?', 11, true, true),
    (v_eventos, 'Evento especial',    '🎊', 'Para cualquier celebración que imagines',
     'Hola! Me interesa cotizar decoración para un *evento especial*. ¿Pueden ayudarme?', 12, true, true);
END $$;

-- ── portfolio_categories ─────────────────────────────────────
INSERT INTO public.portfolio_categories (name, slug, sort_order, is_active) VALUES
  ('Todos',       'all',      0, true),
  ('Bodas',       'bodas',    1, true),
  ('XV Años',     'xv-anos',  2, true),
  ('Baby Shower', 'baby',     3, true),
  ('Cumpleaños',  'cumple',   4, true),
  ('Corporativo', 'corp',     5, true);

-- ── process_steps ────────────────────────────────────────────
INSERT INTO public.process_steps (step_number, icon, title, description, sort_order, is_active) VALUES
  (1, '💬', 'Contáctanos',
   'Escríbenos por WhatsApp con los detalles de tu evento: fecha, lugar y el tipo de decoración que imaginas.',
   1, true),
  (2, '📋', 'Recibe tu propuesta',
   'Te enviamos una cotización personalizada con opciones y precios claros. Sin compromisos.',
   2, true),
  (3, '🎨', 'Diseñamos juntos',
   'Creamos la decoración perfecta basada en tu estilo y colores favoritos. Tú apruebas antes de producir.',
   3, true),
  (4, '🚚', 'Llegamos e instalamos',
   'El día de tu evento llegamos puntual y montamos todo. Solo tienes que llegar y disfrutar.',
   4, true);

-- ── testimonials ─────────────────────────────────────────────
INSERT INTO public.testimonials (client_name, event_type, location, rating, content, is_featured, is_active, sort_order) VALUES
  ('María G.',   'XV Años',               'Zapopan',      5,
   'Transformaron el salón exactamente como lo imaginé. ¡Todas mis amigas me pidieron su contacto!',
   true, true, 1),
  ('Karen R.',   'Boda',                  'Guadalajara',  5,
   'El arco de globos quedó espectacular. Muy profesionales, llegaron a tiempo y superaron todas mis expectativas.',
   true, true, 2),
  ('Paulina L.', 'Baby Shower',           'Tlaquepaque',  5,
   'Los centros de mesa y recuerditos estuvieron hermosos. Precio muy accesible. ¡100% recomendadas!',
   true, true, 3),
  ('Sofía A.',   'Cumpleaños',            'Zapopan',      5,
   'La decoración fue exactamente lo que quería. Muy rápidas en responder y súper amables.',
   true, true, 4),
  ('Jesús M.',   'Evento corporativo',    'Guadalajara',  5,
   'Las velas y centros de mesa quedaron elegantísimos. Superaron las expectativas de todos los asistentes.',
   true, true, 5),
  ('Valeria H.', 'Bautizo',              'Tonalá',       5,
   'Los recuerditos personalizados fueron un éxito. Cada invitado preguntó quién los hizo.',
   true, true, 6);

-- ── faqs ─────────────────────────────────────────────────────
INSERT INTO public.faqs (question, answer, cta_in_answer, sort_order, is_active) VALUES
  ('¿En qué zonas de Guadalajara trabajan?',
   'Trabajamos en toda la ZMG: Guadalajara, Zapopan, Tlaquepaque, Tonalá y Tlajomulco de Zúñiga.',
   false, 1, true),
  ('¿Qué servicios ofrecen además de globos?',
   'Centros de mesa, velas decorativas, recuerditos personalizados, mesas de dulces, decoración temática y mucho más. ¡Pregúntanos por lo que necesitas!',
   false, 2, true),
  ('¿Con cuánto tiempo debo apartar la fecha?',
   'Mínimo 2 semanas. Para bodas y eventos grandes, 1 mes. Si es urgente, consúltanos y buscamos la solución.',
   true, 3, true),
  ('¿Incluye instalación en el venue?',
   'Sí, todos nuestros servicios incluyen instalación completa en el lugar del evento.',
   false, 4, true),
  ('¿Qué formas de pago aceptan?',
   'Transferencia, depósito y efectivo. 50% de anticipo para confirmar la fecha, el resto al momento de la instalación.',
   false, 5, true),
  ('¿Hacen diseños 100% personalizados?',
   'Sí. Cada decoración se crea desde cero según tu tema, colores y presupuesto. Trae referencias de Pinterest y las adaptamos perfectamente.',
   false, 6, true);

-- ── social_links ─────────────────────────────────────────────
INSERT INTO public.social_links (platform, url, icon, sort_order, is_active) VALUES
  ('instagram', 'https://www.instagram.com/beauty_.balloons', 'instagram', 1, true),
  ('facebook',  'https://www.facebook.com/share/1BWgFdbjAs/', 'facebook',  2, true),
  ('tiktok',    'https://vt.tiktok.com/ZSCxwjGev/',           'tiktok',    3, true);
