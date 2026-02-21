import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beerAbvCalculator: CalculatorDefinition = {
  slug: "beer-abv-calculator",
  title: "Beer ABV Calculator",
  description:
    "Free beer ABV calculator. Calculate alcohol by volume for homebrewing using original and final gravity readings.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "beer abv calculator",
    "alcohol by volume",
    "homebrew abv",
    "original gravity",
    "final gravity",
    "beer alcohol calculator",
  ],
  variants: [
    {
      id: "gravity",
      name: "ABV from Gravity",
      description: "Calculate ABV using original and final gravity (SG)",
      fields: [
        {
          name: "og",
          label: "Original Gravity (OG)",
          type: "number",
          placeholder: "e.g. 1.050",
          step: 0.001,
        },
        {
          name: "fg",
          label: "Final Gravity (FG)",
          type: "number",
          placeholder: "e.g. 1.010",
          step: 0.001,
        },
      ],
      calculate: (inputs) => {
        const og = inputs.og as number;
        const fg = inputs.fg as number;
        if (!og || !fg) return null;
        if (fg >= og) {
          return {
            primary: { label: "Error", value: "Final gravity must be lower than original gravity" },
          };
        }

        // Standard formula: ABV = (OG - FG) x 131.25
        const abvSimple = (og - fg) * 131.25;
        // More accurate alternate formula
        const abvAdvanced = (76.08 * (og - fg)) / (1.775 - og) * (fg / 0.794);
        const attenuation = ((og - fg) / (og - 1)) * 100;
        const caloriesPer12oz = ((6.9 * (0.79 * abvSimple / (fg * 100))) + 4.0 * ((0.1808 * (668.72 * og)) * (1 - (1 / (1.0665 * fg))))) * 3.55;
        const approxCalories = 1881.22 * fg * (og - fg) / (1.775 - og);

        return {
          primary: {
            label: "ABV",
            value: formatNumber(abvSimple, 2) + "%",
          },
          details: [
            { label: "ABV (Standard Formula)", value: formatNumber(abvSimple, 2) + "%" },
            { label: "ABV (Advanced Formula)", value: formatNumber(abvAdvanced, 2) + "%" },
            { label: "Original Gravity", value: String(og) },
            { label: "Final Gravity", value: String(fg) },
            { label: "Apparent Attenuation", value: formatNumber(attenuation, 1) + "%" },
            { label: "Approx. Calories (12 oz)", value: formatNumber(approxCalories, 0) },
          ],
        };
      },
    },
    {
      id: "plato",
      name: "ABV from Plato",
      description: "Calculate ABV using degrees Plato",
      fields: [
        {
          name: "op",
          label: "Original Plato (\u00B0P)",
          type: "number",
          placeholder: "e.g. 12.5",
        },
        {
          name: "fp",
          label: "Final Plato (\u00B0P)",
          type: "number",
          placeholder: "e.g. 2.5",
        },
      ],
      calculate: (inputs) => {
        const op = inputs.op as number;
        const fp = inputs.fp as number;
        if (!op || fp === undefined) return null;

        // Convert Plato to SG: SG = 1 + (Plato / (258.6 - (Plato * 227.1 / 258.2)))
        const platoToSg = (p: number) => 1 + p / (258.6 - (p * 227.1) / 258.2);
        const og = platoToSg(op);
        const fg = platoToSg(fp);
        const abv = (og - fg) * 131.25;
        const attenuation = ((op - fp) / op) * 100;

        return {
          primary: {
            label: "ABV",
            value: formatNumber(abv, 2) + "%",
          },
          details: [
            { label: "Original Plato", value: op + "\u00B0P" },
            { label: "Final Plato", value: fp + "\u00B0P" },
            { label: "Converted OG", value: formatNumber(og, 4) },
            { label: "Converted FG", value: formatNumber(fg, 4) },
            { label: "Apparent Attenuation", value: formatNumber(attenuation, 1) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["alcohol-dilution-calculator", "wine-serving-calculator", "bac-calculator"],
  faq: [
    {
      question: "How is beer ABV calculated?",
      answer:
        "The most common formula is ABV = (Original Gravity - Final Gravity) x 131.25. You measure the original gravity (OG) before fermentation and the final gravity (FG) after fermentation is complete using a hydrometer or refractometer.",
    },
    {
      question: "What is a good attenuation percentage?",
      answer:
        "Typical apparent attenuation ranges from 65-85%. Lower attenuation (65-72%) produces sweeter, fuller-bodied beers. Higher attenuation (75-85%) produces drier, lighter beers. Most ale yeasts attenuate 72-78%.",
    },
    {
      question: "What is the difference between gravity and Plato?",
      answer:
        "Both measure sugar content. Specific gravity (SG) is a ratio relative to water (e.g., 1.050). Degrees Plato (\u00B0P) represents the percentage of sugar by weight (e.g., 12.5\u00B0P means 12.5% sugar). 1\u00B0P is roughly equivalent to an SG of 1.004.",
    },
  ],
  formula:
    "ABV (Standard) = (OG - FG) x 131.25. ABV (Advanced) = (76.08 x (OG - FG)) / (1.775 - OG) x (FG / 0.794). Apparent Attenuation = (OG - FG) / (OG - 1) x 100. Plato to SG: SG = 1 + (P / (258.6 - P x 0.88))",
};
