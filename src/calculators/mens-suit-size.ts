import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mensSuitSizeCalculator: CalculatorDefinition = {
  slug: "mens-suit-size-calculator",
  title: "Men's Suit Size Calculator",
  description: "Free men's suit size calculator. Find your jacket, trouser, and shirt size from body measurements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["mens suit size calculator", "suit size chart", "jacket size calculator", "men's blazer size", "suit fitting guide"],
  variants: [
    {
      id: "jacket",
      name: "Jacket / Blazer Size",
      description: "Find your suit jacket or blazer size",
      fields: [
        { name: "chest", label: "Chest (around fullest part)", type: "number", placeholder: "e.g. 40", suffix: "in", step: 0.5 },
        { name: "unit", label: "Measurement Unit", type: "select", options: [
          { label: "Inches", value: "in" },
          { label: "Centimeters", value: "cm" },
        ], defaultValue: "in" },
        { name: "fit", label: "Preferred Fit", type: "select", options: [
          { label: "Slim fit", value: "slim" },
          { label: "Regular fit", value: "regular" },
          { label: "Relaxed / comfort fit", value: "relaxed" },
        ], defaultValue: "regular" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 70", suffix: "in", step: 0.5 },
      ],
      calculate: (inputs) => {
        let chest = inputs.chest as number;
        const unit = inputs.unit as string;
        const fit = inputs.fit as string;
        let height = inputs.height as number;
        if (!chest) return null;

        if (unit === "cm") {
          chest = chest / 2.54;
          if (height) height = height / 2.54;
        }

        // US jacket size = chest measurement (rounded to nearest even number)
        let jacketSize = Math.round(chest / 2) * 2;

        // Fit adjustment
        if (fit === "slim") jacketSize = jacketSize; // true to size
        else if (fit === "relaxed") jacketSize = jacketSize + 2;

        // Length designation
        let lengthDesignation = "R (Regular)";
        if (height) {
          if (height < 67) lengthDesignation = "S (Short)";
          else if (height < 70) lengthDesignation = "R (Regular)";
          else if (height < 73) lengthDesignation = "L (Long)";
          else lengthDesignation = "XL (Extra Long)";
        }

        // EU/IT size
        const euSize = jacketSize + 10;

        // UK size is same as US for suits
        const ukSize = jacketSize;

        // Drop (difference between jacket and trouser)
        const standardTrouserSize = jacketSize - 6;

        return {
          primary: { label: "US Jacket Size", value: `${jacketSize}${lengthDesignation.charAt(0)}` },
          details: [
            { label: "Jacket Size", value: `${jacketSize}` },
            { label: "Length", value: lengthDesignation },
            { label: "EU/IT Size", value: `${euSize}` },
            { label: "UK Size", value: `${ukSize}` },
            { label: "Suggested Trouser Size", value: `${standardTrouserSize} (standard 6\" drop)` },
            { label: "Chest Measurement", value: `${formatNumber(chest, 1)} in` },
          ],
          note: "Suit sizes vary between brands. Have a tailor adjust sleeve length, trouser length, and waist for the best fit.",
        };
      },
    },
    {
      id: "trousers",
      name: "Trouser / Pant Size",
      description: "Find your suit trouser size",
      fields: [
        { name: "waist", label: "Waist (at natural waistline)", type: "number", placeholder: "e.g. 34", suffix: "in", step: 0.5 },
        { name: "inseam", label: "Inseam (crotch to ankle)", type: "number", placeholder: "e.g. 32", suffix: "in", step: 0.5 },
        { name: "unit", label: "Measurement Unit", type: "select", options: [
          { label: "Inches", value: "in" },
          { label: "Centimeters", value: "cm" },
        ], defaultValue: "in" },
      ],
      calculate: (inputs) => {
        let waist = inputs.waist as number;
        let inseam = inputs.inseam as number;
        const unit = inputs.unit as string;
        if (!waist) return null;

        if (unit === "cm") {
          waist = waist / 2.54;
          if (inseam) inseam = inseam / 2.54;
        }

        const trouserSize = Math.round(waist);
        const euTrouserSize = Math.round(waist * 2.54 / 2) * 2; // EU uses cm-based even sizes

        // Inseam classification
        let inseamClass = "";
        if (inseam) {
          if (inseam < 29) inseamClass = "Short";
          else if (inseam < 31) inseamClass = "Regular";
          else if (inseam < 33) inseamClass = "Long";
          else inseamClass = "Extra Long";
        }

        return {
          primary: { label: "Trouser Size", value: `${trouserSize}` },
          details: [
            { label: "Waist", value: `${formatNumber(waist, 1)} in` },
            { label: "EU Trouser Size", value: `~${euTrouserSize}` },
            ...(inseam ? [
              { label: "Inseam", value: `${formatNumber(inseam, 1)} in` },
              { label: "Inseam Length", value: inseamClass },
              { label: "Full Size", value: `${trouserSize}x${Math.round(inseam)}` },
            ] : []),
          ],
          note: "Dress trousers are typically worn at the natural waist, which is higher than where jeans sit. Measure accordingly.",
        };
      },
    },
  ],
  relatedSlugs: ["dress-size-calculator", "belt-size-calculator", "body-measurement-calculator"],
  faq: [
    { question: "How do I know my suit jacket size?", answer: "Your jacket size is based on your chest measurement. Measure around the fullest part of your chest, under your arms. The chest measurement in inches is approximately your jacket size (e.g., 40\" chest = size 40)." },
    { question: "What do S, R, and L mean in suit sizes?", answer: "S = Short (under 5'7\"), R = Regular (5'7\"-5'11\"), L = Long (5'11\"-6'2\"), XL = Extra Long (over 6'2\"). This refers to jacket length, not overall size." },
    { question: "What is the standard drop in suit sizing?", answer: "The 'drop' is the difference between jacket and trouser size. Standard drop is 6 (jacket 40 = trouser 34). Athletic drop is 7-8 (larger chest, slimmer waist). Portly has a drop of 4 or less." },
    { question: "How should a suit jacket fit?", answer: "The shoulder seam should sit at your shoulder point. You should be able to button it without pulling. Sleeves should show 1/4 to 1/2 inch of shirt cuff. The jacket length should cover your seat." },
  ],
  formula: "Jacket size ≈ chest measurement (inches) | EU size = US + 10 | Trouser size ≈ waist (inches) | Standard drop: jacket − 6 = trouser",
};
