import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hatSizeCalculator: CalculatorDefinition = {
  slug: "hat-size-calculator",
  title: "Hat Size Calculator",
  description: "Free hat size calculator. Convert head circumference to fitted hat sizes in US, UK, and generic S/M/L/XL sizing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hat size calculator", "hat size chart", "head circumference to hat size", "fitted hat size", "cap size calculator"],
  variants: [
    {
      id: "inches",
      name: "From Inches",
      fields: [
        { name: "circ", label: "Head Circumference", type: "number", placeholder: "e.g. 22.5", suffix: "in", step: 0.125 },
      ],
      calculate: (inputs) => {
        const circ = inputs.circ as number;
        if (!circ) return null;

        const cm = circ * 2.54;

        // US/UK hat size = circumference inches / π ≈ circ / 3.14
        // Fitted size uses 1/8 increments
        const fitted = circ / Math.PI;
        const fittedRounded = Math.round(fitted * 8) / 8;
        const whole = Math.floor(fittedRounded);
        const frac = fittedRounded - whole;
        const fracMap: Record<number, string> = { 0: "", 0.125: " 1/8", 0.25: " 1/4", 0.375: " 3/8", 0.5: " 1/2", 0.625: " 5/8", 0.75: " 3/4", 0.875: " 7/8" };
        const fittedStr = `${whole}${fracMap[frac] ?? ""}`;

        // Generic sizing
        let generic = "M";
        if (circ < 21.25) generic = "XS";
        else if (circ < 21.75) generic = "S";
        else if (circ < 22.25) generic = "M";
        else if (circ < 22.75) generic = "L";
        else if (circ < 23.25) generic = "XL";
        else generic = "XXL";

        return {
          primary: { label: "Fitted Hat Size", value: fittedStr },
          details: [
            { label: "Generic Size", value: generic },
            { label: "Head Circumference", value: `${formatNumber(circ, 2)} in` },
            { label: "Head Circumference (cm)", value: `${formatNumber(cm, 1)} cm` },
          ],
          note: "Measure around the widest part of your head, about 1 inch above your eyebrows.",
        };
      },
    },
    {
      id: "cm",
      name: "From Centimeters",
      fields: [
        { name: "circCm", label: "Head Circumference", type: "number", placeholder: "e.g. 57", suffix: "cm", step: 0.1 },
      ],
      calculate: (inputs) => {
        const cm = inputs.circCm as number;
        if (!cm) return null;

        const inches = cm / 2.54;
        const fitted = inches / Math.PI;
        const fittedRounded = Math.round(fitted * 8) / 8;
        const whole = Math.floor(fittedRounded);
        const frac = fittedRounded - whole;
        const fracMap: Record<number, string> = { 0: "", 0.125: " 1/8", 0.25: " 1/4", 0.375: " 3/8", 0.5: " 1/2", 0.625: " 5/8", 0.75: " 3/4", 0.875: " 7/8" };
        const fittedStr = `${whole}${fracMap[frac] ?? ""}`;

        let generic = "M";
        if (cm < 54) generic = "XS";
        else if (cm < 55.5) generic = "S";
        else if (cm < 56.5) generic = "M";
        else if (cm < 58) generic = "L";
        else if (cm < 59.5) generic = "XL";
        else generic = "XXL";

        return {
          primary: { label: "Fitted Hat Size", value: fittedStr },
          details: [
            { label: "Generic Size", value: generic },
            { label: "Head Circumference (cm)", value: `${formatNumber(cm, 1)} cm` },
            { label: "Head Circumference (in)", value: `${formatNumber(inches, 2)} in` },
          ],
          note: "Measure around the widest part of your head, about 2.5 cm above your eyebrows.",
        };
      },
    },
  ],
  relatedSlugs: ["shoe-size-converter", "ring-size-calculator", "helmet-size-calculator"],
  faq: [
    { question: "How do I measure my hat size?", answer: "Use a flexible tape measure around the widest part of your head, about 1 inch (2.5 cm) above your eyebrows and ears. The measurement in inches divided by pi gives your fitted hat size." },
    { question: "What is the average hat size?", answer: "The average men's hat size is about 7 1/8 to 7 1/4 (head circumference 22.25–22.75 inches / 56.5–57.8 cm). The average women's hat size is about 7 to 7 1/8." },
    { question: "What do S, M, L hat sizes mean?", answer: "S (Small) ≈ 6 7/8 (21.5–21.75\"), M (Medium) ≈ 7–7 1/8 (22–22.25\"), L (Large) ≈ 7 1/4–7 3/8 (22.5–22.75\"), XL ≈ 7 1/2–7 5/8 (23–23.25\")." },
  ],
  formula: "Fitted size = head circumference (inches) / π | Generic sizing based on circumference ranges",
};
