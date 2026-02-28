import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const utmBuilderCalculator: CalculatorDefinition = {
  slug: "utm-builder",
  title: "UTM Parameter Builder",
  description: "Free UTM campaign URL builder. Generate properly formatted tracking URLs for Google Analytics with all 5 UTM parameters.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["utm builder", "utm generator", "campaign url builder google analytics"],
  variants: [{
    id: "standard",
    name: "UTM Parameter Builder",
    description: "Free UTM campaign URL builder",
    fields: [
      { name: "urlLength", label: "Base URL Length", type: "number", suffix: "chars", min: 10, defaultValue: 30 },
      { name: "params", label: "Parameters Used", type: "select", options: [{ label: "3 required (source, medium, campaign)", value: "3" }, { label: "4 (+ term)", value: "4" }, { label: "All 5 (+ content)", value: "5" }], defaultValue: "3" },
    ],
    calculate: (inputs) => {
      const urlLen = inputs.urlLength as number;
      const paramCount = parseInt(inputs.params as string);
      if (!urlLen) return null;
      const params = ["utm_source=google", "utm_medium=cpc", "utm_campaign=spring_sale"];
      if (paramCount >= 4) params.push("utm_term=keyword");
      if (paramCount >= 5) params.push("utm_content=banner_v1");
      const fullUrl = "https://example.com/?" + params.join("&");
      return {
        primary: { label: "UTM URL Length", value: fullUrl.length + " characters" },
        details: [
          { label: "utm_source (required)", value: "Traffic source (google, facebook, newsletter)" },
          { label: "utm_medium (required)", value: "Marketing medium (cpc, email, social)" },
          { label: "utm_campaign (required)", value: "Campaign name (spring_sale, launch_2025)" },
          { label: "utm_term (optional)", value: "Paid keyword term" },
          { label: "utm_content (optional)", value: "Ad variation (banner_v1, cta_blue)" },
        ],
        note: "Example: " + fullUrl,
      };
    },
  }],
  relatedSlugs: ["cpc-calculator", "roas-calculator"],
  faq: [
    { question: "What are UTM parameters?", answer: "Tags added to URLs to track traffic sources in Google Analytics. 5 parameters: source (where), medium (how), campaign (what), term (keyword), content (variation)." },
    { question: "Which UTM parameters are required?", answer: "utm_source, utm_medium, and utm_campaign are required for GA tracking. utm_term and utm_content are optional for more granular analysis." },
  ],
  formula: "URL + ?utm_source=X&utm_medium=Y&utm_campaign=Z[&utm_term=K&utm_content=V]",
};
