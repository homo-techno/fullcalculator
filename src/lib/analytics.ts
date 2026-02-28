// GA4 analytics wrapper
// Events are sent via gtag when GA_MEASUREMENT_ID is configured
// Falls back to console logging in development

type EventProperties = Record<string, string | number | boolean>;

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...(args as Parameters<typeof window.gtag>));
  } else if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", ...args);
  }
}

export function trackEvent(name: string, properties?: EventProperties) {
  gtag("event", name, properties);
}

// Calculator page loaded
export function trackCalculatorView(slug: string, category: string) {
  trackEvent("calculator_view", {
    calculator_name: slug,
    calculator_category: category,
  });
}

// User starts entering data (first field interaction)
export function trackCalculatorStart(slug: string, variant: string) {
  trackEvent("calculator_start", {
    calculator_name: slug,
    calculator_variant: variant,
  });
}

// User gets a result
export function trackCalculatorComplete(
  slug: string,
  variant: string,
  timeToComplete: number
) {
  trackEvent("calculator_complete", {
    calculator_name: slug,
    calculator_variant: variant,
    time_to_complete: Math.round(timeToComplete / 1000),
  });
}

// User interacts with result (copy, share, etc.)
export function trackResultAction(slug: string, action: string) {
  trackEvent("calculator_result_action", {
    calculator_name: slug,
    action_type: action,
  });
}

// User leaves without completing
export function trackCalculatorAbandon(
  slug: string,
  fieldsCompleted: number,
  fieldsTotal: number
) {
  trackEvent("calculator_abandon", {
    calculator_name: slug,
    fields_completed: fieldsCompleted,
    fields_total: fieldsTotal,
  });
}

// Feedback: was this helpful?
export function trackFeedback(slug: string, helpful: boolean) {
  trackEvent("calculator_feedback", {
    calculator_name: slug,
    helpful: helpful,
  });
}

// Extend Window for gtag
declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
