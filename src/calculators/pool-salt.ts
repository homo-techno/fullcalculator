import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const poolSaltCalculator: CalculatorDefinition = {
  slug: "pool-salt-calculator",
  title: "Pool Salt Calculator",
  description: "Free pool salt calculator. Calculate how much salt to add to your saltwater pool to reach the optimal level.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pool salt calculator", "salt water pool calculator", "how much salt for pool", "pool salinity calculator", "salt chlorinator calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Salt to Add",
      fields: [
        { name: "volume", label: "Pool Volume", type: "number", placeholder: "e.g. 20000", suffix: "gallons" },
        { name: "currentSalt", label: "Current Salt Level", type: "number", placeholder: "e.g. 2500", suffix: "ppm" },
        { name: "targetSalt", label: "Target Salt Level", type: "number", placeholder: "e.g. 3200", suffix: "ppm", defaultValue: 3200 },
      ],
      calculate: (inputs) => {
        const volume = inputs.volume as number;
        const currentSalt = inputs.currentSalt as number;
        const targetSalt = inputs.targetSalt as number;
        if (!volume || currentSalt === undefined || currentSalt === null || !targetSalt) return null;

        if (currentSalt >= targetSalt) {
          return {
            primary: { label: "Salt to Add", value: "0 lbs" },
            details: [
              { label: "Current Level", value: `${formatNumber(currentSalt, 0)} ppm` },
              { label: "Target Level", value: `${formatNumber(targetSalt, 0)} ppm` },
              { label: "Status", value: currentSalt > 3600 ? "Salt level is high — consider diluting with fresh water" : "Salt level is at or above target" },
            ],
            note: "If salt is above 3600 ppm, the chlorine generator may shut off. Dilute by partially draining and refilling with fresh water.",
          };
        }

        // Salt to add (lbs) = (target - current) × volume / 120000
        const saltLbs = ((targetSalt - currentSalt) * volume) / 120000;
        const saltKg = saltLbs * 0.4536;

        // Number of 40-lb bags
        const bags40 = saltLbs / 40;

        // Salinity classification
        let status: string;
        if (targetSalt < 2700) status = "Below recommended range (most generators need 2700–3400 ppm)";
        else if (targetSalt <= 3400) status = "Within recommended range for salt chlorine generators";
        else if (targetSalt <= 3600) status = "High end of acceptable range";
        else status = "Above recommended range — may damage equipment";

        return {
          primary: { label: "Salt to Add", value: `${formatNumber(saltLbs, 0)} lbs` },
          details: [
            { label: "Salt to Add (kg)", value: formatNumber(saltKg, 0) },
            { label: "40-lb Bags Needed", value: formatNumber(Math.ceil(bags40), 0) },
            { label: "Pool Volume", value: `${formatNumber(volume, 0)} gallons` },
            { label: "Current Salt Level", value: `${formatNumber(currentSalt, 0)} ppm` },
            { label: "Target Salt Level", value: `${formatNumber(targetSalt, 0)} ppm` },
            { label: "Increase Needed", value: `${formatNumber(targetSalt - currentSalt, 0)} ppm` },
            { label: "Target Status", value: status },
          ],
          note: "Add salt gradually — pour around pool edges with the pump running. Wait 24 hours and retest before adding more. Use only pool-grade salt (NaCl 99%+ pure).",
        };
      },
    },
  ],
  relatedSlugs: ["pool-volume-calculator", "water-hardness-calculator", "soil-ph-calculator"],
  faq: [
    { question: "How much salt does a pool need?", answer: "Most salt chlorine generators require 2700–3400 ppm of salt (about 3200 ppm is ideal). A typical 20,000-gallon pool needs about 533 lbs of salt to go from 0 to 3200 ppm." },
    { question: "Can you add too much salt to a pool?", answer: "Yes. Above 3600 ppm, many salt chlorinators will shut off to prevent damage. The only way to lower salt is to drain some water and refill with fresh water. Always add salt gradually." },
    { question: "How often do you add salt to a salt water pool?", answer: "Salt doesn't evaporate and is recycled by the chlorinator. You typically only need to add salt when water is lost through splashing, backwashing, or dilution from rain. Test monthly." },
  ],
  formula: "Salt (lbs) = (target ppm − current ppm) × pool gallons / 120,000",
};
