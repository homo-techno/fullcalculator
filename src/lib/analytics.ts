// PostHog analytics wrapper
// To enable: set NEXT_PUBLIC_POSTHOG_KEY in .env.local
// For now, events are logged to console in development

type EventProperties = Record<string, string | number | boolean>;

export function trackEvent(name: string, properties?: EventProperties) {
  // PostHog integration (when key is configured)
  if (
    typeof window !== "undefined" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).posthog
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).posthog.capture(name, properties);
    return;
  }

  // Dev logging
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${name}`, properties);
  }
}

export function trackCalculatorUsed(calculatorSlug: string, variantId: string) {
  trackEvent("calculator_used", {
    calculator: calculatorSlug,
    variant: variantId,
  });
}

export function trackCalculatorCompleted(
  calculatorSlug: string,
  variantId: string
) {
  trackEvent("calculator_completed", {
    calculator: calculatorSlug,
    variant: variantId,
  });
}
