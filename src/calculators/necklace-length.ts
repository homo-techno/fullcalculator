import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const necklaceLengthCalculator: CalculatorDefinition = {
  slug: "necklace-length-calculator",
  title: "Necklace Length Calculator",
  description: "Free necklace length calculator. Find the ideal necklace length based on your neck size, body type, and neckline style.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["necklace length calculator", "necklace size chart", "choker length", "chain length guide", "necklace length for neckline"],
  variants: [
    {
      id: "by-neck-size",
      name: "From Neck Measurement",
      description: "Find the ideal necklace length based on your neck circumference",
      fields: [
        { name: "neckCirc", label: "Neck Circumference", type: "number", placeholder: "e.g. 14", step: 0.25 },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Inches", value: "in" },
          { label: "Centimeters", value: "cm" },
        ], defaultValue: "in" },
        { name: "style", label: "Desired Style", type: "select", options: [
          { label: "Choker (sits at base of neck)", value: "choker" },
          { label: "Collar (sits on collarbone)", value: "collar" },
          { label: "Princess (below collarbone)", value: "princess" },
          { label: "Matinee (above bust)", value: "matinee" },
          { label: "Opera (at bust or below)", value: "opera" },
          { label: "Rope (below bust)", value: "rope" },
        ], defaultValue: "princess" },
      ],
      calculate: (inputs) => {
        let neckCirc = inputs.neckCirc as number;
        const unit = inputs.unit as string;
        const style = inputs.style as string;
        if (!neckCirc) return null;

        if (unit === "cm") neckCirc = neckCirc / 2.54;

        // Standard necklace lengths and adjustments
        const styleData: Record<string, { add: number; standardLength: number; description: string }> = {
          choker: { add: 2, standardLength: 16, description: "Sits snugly at base of neck" },
          collar: { add: 4, standardLength: 16, description: "Rests on the collarbone" },
          princess: { add: 6, standardLength: 18, description: "Falls just below the collarbone (most popular)" },
          matinee: { add: 10, standardLength: 22, description: "Falls above the bustline" },
          opera: { add: 16, standardLength: 30, description: "Falls at the bustline or below" },
          rope: { add: 22, standardLength: 36, description: "Long enough to double up or knot" },
        };

        const info = styleData[style];
        const personalizedLength = neckCirc + info.add;
        const roundedLength = Math.round(personalizedLength);
        const lengthCm = roundedLength * 2.54;

        // Suggest nearest standard size
        const standardSizes = [14, 16, 18, 20, 22, 24, 30, 36];
        let nearestStandard = standardSizes[0];
        let minDiff = Infinity;
        for (const s of standardSizes) {
          if (Math.abs(s - personalizedLength) < minDiff) {
            minDiff = Math.abs(s - personalizedLength);
            nearestStandard = s;
          }
        }

        return {
          primary: { label: "Recommended Length", value: `${roundedLength} inches` },
          details: [
            { label: "Style", value: `${style.charAt(0).toUpperCase() + style.slice(1)} — ${info.description}` },
            { label: "In Centimeters", value: `${formatNumber(lengthCm, 0)} cm` },
            { label: "Nearest Standard Size", value: `${nearestStandard} inches` },
            { label: "Neck Circumference", value: `${formatNumber(neckCirc, 1)} inches` },
            { label: "Standard Length for Style", value: `${info.standardLength} inches` },
          ],
          note: "Necklace lengths are measured end-to-end including the clasp. Add 2-4 inches to your neck measurement for a comfortable choker.",
        };
      },
    },
    {
      id: "by-neckline",
      name: "By Neckline / Outfit",
      description: "Find the best necklace length for different necklines",
      fields: [
        { name: "neckline", label: "Neckline Style", type: "select", options: [
          { label: "Crew neck / Round neck", value: "crew" },
          { label: "V-neck", value: "vneck" },
          { label: "Scoop neck", value: "scoop" },
          { label: "Off-shoulder / Strapless", value: "strapless" },
          { label: "Turtleneck / High neck", value: "turtle" },
          { label: "Collared shirt / Button-up", value: "collared" },
          { label: "Square neck", value: "square" },
        ], defaultValue: "vneck" },
      ],
      calculate: (inputs) => {
        const neckline = inputs.neckline as string;

        const recommendations: Record<string, { lengths: string; style: string; avoid: string }> = {
          crew: { lengths: "16-20 inches (princess or matinee)", style: "Pendant on medium chain, layered chains, or longer necklace that sits below the neckline", avoid: "Chokers (compete with the neckline)" },
          vneck: { lengths: "16-24 inches (pendant following the V)", style: "Pendant or Y-necklace that mirrors the V shape. Length should complement the depth of the V.", avoid: "Round chokers (conflict with the angular neckline)" },
          scoop: { lengths: "16-18 inches (collar or princess)", style: "Short pendant, delicate chain, or statement necklace that fills the space", avoid: "Very long chains (fight the wide neckline)" },
          strapless: { lengths: "14-16 inches (choker or collar)", style: "Choker, collar necklace, or short statement piece that highlights exposed collarbone", avoid: "Very long necklaces (draw attention away from neckline)" },
          turtle: { lengths: "22-36 inches (matinee to rope)", style: "Long chains, layered long necklaces, or pendant on long chain worn over the turtleneck", avoid: "Short necklaces (hidden under fabric)" },
          collared: { lengths: "18-24 inches (falls below collar)", style: "Medium chain that falls below the collar, or layer a short necklace inside the collar with a longer one outside", avoid: "Chokers (hidden under collar)" },
          square: { lengths: "16-18 inches (princess)", style: "Delicate chain or angular pendant that complements the square shape", avoid: "Overly ornate necklaces that compete with the structured neckline" },
        };

        const rec = recommendations[neckline];

        return {
          primary: { label: "Recommended Length", value: rec.lengths },
          details: [
            { label: "Best Style", value: rec.style },
            { label: "Avoid", value: rec.avoid },
          ],
          note: "These are guidelines — personal style and body proportions also matter. Try on necklaces with the outfit when possible.",
        };
      },
    },
  ],
  relatedSlugs: ["bracelet-size-calculator", "ring-size-calculator"],
  faq: [
    { question: "What are the standard necklace lengths?", answer: "Choker: 14-16 inches. Princess: 18 inches (most popular). Matinee: 20-24 inches. Opera: 28-36 inches. Rope: 36+ inches. Each sits at a different point on the chest." },
    { question: "What is the most popular necklace length?", answer: "18 inches (princess length) is the most popular and versatile necklace length for women. It falls just below the collarbone and works with most necklines." },
    { question: "How do I measure my neck for a necklace?", answer: "Wrap a flexible tape measure around the base of your neck where a choker would sit. Add 2-4 inches for a choker, 4-6 for a collar, or use the measurement as a starting point for longer styles." },
  ],
  formula: "Necklace length = Neck circumference + style offset | Choker: +2\", Collar: +4\", Princess: +6\", Matinee: +10\", Opera: +16\", Rope: +22\"",
};
