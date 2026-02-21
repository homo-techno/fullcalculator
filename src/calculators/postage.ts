import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const postageCalculator: CalculatorDefinition = {
  slug: "postage-calculator",
  title: "Postage Calculator",
  description:
    "Free USPS postage calculator. Estimate mailing costs for letters, large envelopes, and packages by weight.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "postage",
    "USPS",
    "mailing cost",
    "stamp price",
    "shipping calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "weight",
          label: "Weight (oz)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "envelopeType",
          label: "Envelope Type",
          type: "select",
          options: [
            { label: "Letter (up to 3.5 oz)", value: "letter" },
            { label: "Large Envelope / Flat", value: "large" },
            { label: "Package", value: "package" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const envelopeType = (inputs.envelopeType as string) || "letter";
        if (!weight || weight <= 0) return null;

        let cost = 0;
        let description = "";

        if (envelopeType === "letter") {
          if (weight <= 1) {
            cost = 0.68;
          } else {
            cost = 0.68 + Math.ceil(weight - 1) * 0.24;
          }
          description = "USPS First-Class Letter";
        } else if (envelopeType === "large") {
          if (weight <= 1) {
            cost = 1.39;
          } else {
            cost = 1.39 + Math.ceil(weight - 1) * 0.24;
          }
          description = "USPS Large Envelope / Flat";
        } else {
          const baseCost = 4.0;
          cost = baseCost + Math.max(0, weight - 4) * 0.5;
          description = "USPS First-Class Package (estimate)";
        }

        const stamps = Math.ceil(cost / 0.68);

        return {
          primary: {
            label: "Estimated Postage",
            value: "$" + formatNumber(cost, 2),
          },
          details: [
            { label: "Mail Type", value: description },
            { label: "Weight", value: formatNumber(weight, 1) + " oz" },
            {
              label: "Forever Stamps Needed",
              value: String(stamps) + " ($0.68 each)",
            },
            {
              label: "Note",
              value: "Rates are approximate. Check USPS.com for current rates.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["moving-box-calculator"],
  faq: [
    {
      question: "How much does it cost to mail a letter?",
      answer:
        "A standard first-class letter up to 1 oz costs $0.68 (one Forever Stamp). Each additional ounce adds $0.24, up to 3.5 oz maximum for letters.",
    },
    {
      question: "What is the difference between a letter and a large envelope?",
      answer:
        "A letter must be rectangular, 6-11.5 inches long, 3.5-6.125 inches high, and up to 0.25 inches thick. Anything larger is a large envelope (flat) or package.",
    },
  ],
  formula:
    "Letter: $0.68 for first oz + $0.24 each additional oz. Large Envelope: $1.39 for first oz + $0.24 each additional oz. Package rates vary by weight and distance.",
};
