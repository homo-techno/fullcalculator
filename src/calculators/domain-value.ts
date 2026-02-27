import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const domainValueCalculator: CalculatorDefinition = {
  slug: "domain-value",
  title: "Domain Name Value Estimator",
  description:
    "Estimate the market value of a domain name based on length, extension, keyword strength, age, and comparable sales data.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "domain value",
    "domain appraisal",
    "domain name worth",
    "domain price estimator",
    "website value",
    "domain name valuation",
    "domain selling price",
  ],
  variants: [
    {
      slug: "domain-value",
      title: "Domain Name Value Estimator",
      description:
        "Estimate your domain name's market value based on key characteristics.",
      fields: [
        {
          id: "domainLength",
          label: "Domain Name Length (characters)",
          type: "number",
          defaultValue: 8,
        },
        {
          id: "extension",
          label: "Domain Extension",
          type: "select",
          options: [
            { label: ".com", value: "com" },
            { label: ".io", value: "io" },
            { label: ".ai", value: "ai" },
            { label: ".co", value: "co" },
            { label: ".net", value: "net" },
            { label: ".org", value: "org" },
            { label: ".xyz / other new TLD", value: "other" },
          ],
          defaultValue: "com",
        },
        {
          id: "domainType",
          label: "Domain Type",
          type: "select",
          options: [
            { label: "Single Dictionary Word", value: "single_word" },
            { label: "Two-Word Combination", value: "two_word" },
            { label: "Brandable (made-up word)", value: "brandable" },
            { label: "Acronym / Initials", value: "acronym" },
            { label: "Exact Match Keyword", value: "exact_match" },
            { label: "Numeric / Mixed", value: "numeric" },
          ],
          defaultValue: "two_word",
        },
        {
          id: "industryRelevance",
          label: "Industry Relevance",
          type: "select",
          options: [
            { label: "Tech / AI / Crypto (high demand)", value: "tech" },
            { label: "Finance / Insurance", value: "finance" },
            { label: "Health / Medical", value: "health" },
            { label: "E-commerce / Retail", value: "ecommerce" },
            { label: "General / Other", value: "general" },
          ],
          defaultValue: "tech",
        },
        {
          id: "domainAge",
          label: "Domain Age (years)",
          type: "number",
          defaultValue: 5,
        },
        {
          id: "monthlySearchVolume",
          label: "Keyword Monthly Search Volume",
          type: "number",
          defaultValue: 5000,
        },
      ],
      calculate(inputs) {
        const domainLength = parseFloat(inputs.domainLength as string);
        const extension = inputs.extension as string;
        const domainType = inputs.domainType as string;
        const industryRelevance = inputs.industryRelevance as string;
        const domainAge = parseFloat(inputs.domainAge as string);
        const monthlySearchVolume = parseFloat(
          inputs.monthlySearchVolume as string
        );

        // Base value by extension
        const extensionMultiplier: Record<string, number> = {
          com: 10,
          io: 4,
          ai: 6,
          co: 3,
          net: 2,
          org: 1.5,
          other: 0.5,
        };

        // Domain type multiplier
        const typeMultiplier: Record<string, number> = {
          single_word: 15,
          two_word: 5,
          brandable: 3,
          acronym: 2,
          exact_match: 8,
          numeric: 1,
        };

        // Industry premium
        const industryMultiplier: Record<string, number> = {
          tech: 2.5,
          finance: 3.0,
          health: 2.0,
          ecommerce: 1.5,
          general: 1.0,
        };

        // Length bonus (shorter = more valuable)
        let lengthMultiplier = 1;
        if (domainLength <= 3) lengthMultiplier = 20;
        else if (domainLength <= 4) lengthMultiplier = 10;
        else if (domainLength <= 5) lengthMultiplier = 5;
        else if (domainLength <= 7) lengthMultiplier = 2;
        else if (domainLength <= 10) lengthMultiplier = 1;
        else lengthMultiplier = 0.5;

        const ageBonus = Math.min(domainAge * 0.05, 0.5) + 1; // up to 50% bonus
        const searchBonus = 1 + Math.log10(Math.max(monthlySearchVolume, 1)) * 0.2;

        const baseValue = 100;
        const estimatedValue =
          baseValue *
          (extensionMultiplier[extension] || 1) *
          (typeMultiplier[domainType] || 1) *
          (industryMultiplier[industryRelevance] || 1) *
          lengthMultiplier *
          ageBonus *
          searchBonus;

        const lowEstimate = estimatedValue * 0.5;
        const highEstimate = estimatedValue * 2.0;

        return {
          "Estimated Value": "$" + formatNumber(estimatedValue),
          "Low Estimate": "$" + formatNumber(lowEstimate),
          "High Estimate": "$" + formatNumber(highEstimate),
          "Extension Premium": formatNumber(extensionMultiplier[extension] || 1) + "x",
          "Length Premium": formatNumber(lengthMultiplier) + "x",
          "Type Premium": formatNumber(typeMultiplier[domainType] || 1) + "x",
          "Industry Premium":
            formatNumber(industryMultiplier[industryRelevance] || 1) + "x",
          "Age Bonus": formatNumber(ageBonus) + "x",
        };
      },
    },
  ],
  relatedSlugs: [
    "seo-traffic-value",
    "startup-runway",
    "saas-metrics",
    "shopify-profit",
  ],
  faq: [
    {
      question: "How are domain names valued?",
      answer:
        "Domain values depend on length (shorter is better), extension (.com is most valuable), keyword relevance, search volume, industry demand, brandability, and comparable sales. Single dictionary word .com domains can sell for $50,000-$10M+, while average domains sell for $500-$5,000.",
    },
    {
      question: "What makes a domain name valuable?",
      answer:
        "The most valuable domains are short (3-5 characters), have a .com extension, contain high-value keywords (finance, AI, crypto), and are memorable and brandable. Domain age and existing backlinks also add value. Domains in trending industries command premium prices.",
    },
  ],
  formula:
    "Estimated Value = Base Value x Extension Multiplier x Type Multiplier x Industry Multiplier x Length Multiplier x Age Bonus x Search Volume Bonus. Each factor is derived from comparable domain sales data.",
};
