"use client";

import Script from "next/script";
import { CookieConsent, useCookieConsent } from "./cookie-consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  const { consent, accept, decline } = useCookieConsent();

  if (!GA_ID) return null;

  return (
    <>
      {consent === true && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="lazyOnload"
          />
          <Script id="ga4-init" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                send_page_view: true,
                anonymize_ip: true
              });
            `}
          </Script>
        </>
      )}
      {consent === null && (
        <CookieConsent onAccept={accept} onDecline={decline} />
      )}
    </>
  );
}
