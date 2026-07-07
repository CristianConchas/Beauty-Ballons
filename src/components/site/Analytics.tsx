/**
 * Analytics.tsx
 *
 * Inyecta Google Analytics 4 y Meta Pixel de forma diferida.
 * Los IDs se leen desde seo_config en Supabase para que el admin
 * pueda cambiarlos sin redeploy.
 *
 * Uso:
 *   <Analytics gaId="G-XXXXXXX" pixelId="XXXXXXX" />
 *
 * Configurar en Supabase → seo_config:
 *   google_analytics_id = "G-XXXXXXXXXX"
 *   meta_pixel_id       = "XXXXXXXXXXXXXXXXX"
 */

interface AnalyticsProps {
  gaId?:    string | null
  pixelId?: string | null
}

export function Analytics({ gaId, pixelId }: AnalyticsProps) {
  if (!gaId && !pixelId) return null

  return (
    <>
      {/* ── Google Analytics 4 ─────────────────────────────── */}
      {gaId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                  send_page_view: true,
                  anonymize_ip: true,
                });
              `,
            }}
          />
        </>
      )}

      {/* ── Meta Pixel ─────────────────────────────────────── */}
      {pixelId && (
        <>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  )
}
