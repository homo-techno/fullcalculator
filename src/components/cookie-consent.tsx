"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "cookie-consent";

export function useCookieConsent() {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "true") setConsent(true);
    else if (stored === "false") setConsent(false);
    // null = not yet decided
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "true");
    setConsent(true);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "false");
    setConsent(false);
  };

  return { consent, accept, decline };
}

export function CookieConsent({
  onAccept,
  onDecline,
}: {
  onAccept: () => void;
  onDecline: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === null) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 text-sm">
      <p className="text-gray-700 mb-3">
        We use cookies for analytics to improve our site.{" "}
        <a href="/privacy" className="underline text-blue-600">
          Privacy Policy
        </a>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => {
            onAccept();
            setVisible(false);
          }}
          className="flex-1 bg-blue-600 text-white rounded px-3 py-1.5 hover:bg-blue-700 transition-colors"
        >
          Accept
        </button>
        <button
          onClick={() => {
            onDecline();
            setVisible(false);
          }}
          className="flex-1 border border-gray-300 text-gray-600 rounded px-3 py-1.5 hover:bg-gray-50 transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
