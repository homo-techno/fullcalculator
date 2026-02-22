import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const meteorShowerCalculator: CalculatorDefinition = {
  slug: "meteor-shower-calculator",
  title: "Meteor Shower Radiant Calculator",
  description: "Free meteor shower calculator. Estimate the zenithal hourly rate and visible meteor rate based on conditions.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["meteor shower", "zenithal hourly rate", "meteor rate", "shooting stars", "meteor radiant"],
  variants: [
    {
      id: "visible-rate",
      name: "Estimate Visible Meteor Rate",
      description: "HR = ZHR * sin(altitude) * (1 / (lm_factor))",
      fields: [
        { name: "zhr", label: "Zenithal Hourly Rate (ZHR)", type: "number", placeholder: "e.g. 120" },
        { name: "altitude", label: "Radiant Altitude (degrees)", type: "number", placeholder: "e.g. 50", min: 0, max: 90 },
        { name: "limitMag", label: "Limiting Magnitude", type: "number", placeholder: "e.g. 5.5", step: 0.1, defaultValue: 5.5 },
      ],
      calculate: (inputs) => {
        const zhr = inputs.zhr as number;
        const alt = inputs.altitude as number;
        const lm = inputs.limitMag as number || 5.5;
        if (!zhr || !alt) return null;
        const altRad = alt * Math.PI / 180;
        const sinAlt = Math.sin(altRad);
        const lmFactor = Math.pow(10, 0.4 * (6.5 - lm));
        const hr = zhr * sinAlt / lmFactor;
        return {
          primary: { label: "Visible Meteors/Hour", value: `${formatNumber(Math.round(hr))}` },
          details: [
            { label: "ZHR", value: formatNumber(zhr) },
            { label: "Radiant Altitude", value: `${formatNumber(alt)} degrees` },
            { label: "Sin(altitude)", value: formatNumber(sinAlt, 3) },
            { label: "Limiting Magnitude Factor", value: formatNumber(lmFactor, 3) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["angular-diameter-calculator", "light-travel-calculator", "telescope-fov-calculator"],
  faq: [
    { question: "What is ZHR?", answer: "Zenithal Hourly Rate is the theoretical maximum number of meteors visible per hour under perfect conditions with the radiant at zenith." },
    { question: "Why do I see fewer meteors than the ZHR?", answer: "The radiant is rarely at zenith, light pollution reduces limiting magnitude, and sky conditions vary." },
  ],
  formula: "Visible Rate = ZHR * sin(altitude) / limiting_magnitude_factor",
};
