import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const horseWeightCalculator: CalculatorDefinition = {
  slug: "horse-weight-calculator",
  title: "Horse Weight Calculator",
  description:
    "Free horse weight calculator. Estimate your horse's weight using body measurements with the heart girth and body length formula.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "horse weight calculator",
    "estimate horse weight",
    "horse weight by measurement",
    "equine weight calculator",
    "horse body weight formula",
  ],
  variants: [
    {
      id: "adultHorse",
      name: "Adult Horse Weight",
      description: "Using heart girth and body length measurements",
      fields: [
        {
          name: "heartGirth",
          label: "Heart Girth (inches)",
          type: "number",
          placeholder: "e.g. 72",
          min: 40,
          max: 100,
          step: 0.5,
        },
        {
          name: "bodyLength",
          label: "Body Length (inches)",
          type: "number",
          placeholder: "e.g. 64",
          min: 30,
          max: 90,
          step: 0.5,
        },
        {
          name: "horseType",
          label: "Horse Type",
          type: "select",
          options: [
            { label: "Light Breed (Thoroughbred, Arabian)", value: "light" },
            { label: "Stock Breed (Quarter Horse, Paint)", value: "stock" },
            { label: "Draft Breed (Clydesdale, Percheron)", value: "draft" },
            { label: "Pony (under 14.2 hands)", value: "pony" },
          ],
        },
      ],
      calculate: (inputs) => {
        const heartGirth = inputs.heartGirth as number;
        const bodyLength = inputs.bodyLength as number;
        const horseType = (inputs.horseType as string) || "stock";
        if (!heartGirth || !bodyLength || heartGirth <= 0 || bodyLength <= 0) return null;

        // Carroll & Huntington formula: Weight (lbs) = (Heart Girth^2 x Body Length) / 330
        let weight = (heartGirth * heartGirth * bodyLength) / 330;

        // Slight adjustment by type
        const typeFactors: Record<string, number> = {
          light: 0.95,
          stock: 1.0,
          draft: 1.05,
          pony: 0.93,
        };
        weight *= typeFactors[horseType] || 1.0;
        const weightKg = weight * 0.453592;

        // Body condition estimate
        let condition = "";
        const idealRanges: Record<string, { min: number; max: number }> = {
          light: { min: 900, max: 1200 },
          stock: { min: 1000, max: 1300 },
          draft: { min: 1600, max: 2200 },
          pony: { min: 400, max: 900 },
        };
        const range = idealRanges[horseType] || idealRanges.stock;
        if (weight < range.min) condition = "May be underweight for breed";
        else if (weight > range.max) condition = "May be overweight for breed";
        else condition = "Within typical range for breed";

        // Dewormer dose (most are dosed per 250 lbs)
        const dewormerTubes = Math.ceil(weight / 1250); // Most tubes treat 1,250 lbs

        return {
          primary: {
            label: "Estimated Weight",
            value: formatNumber(weight, 0) + " lbs",
          },
          details: [
            { label: "Weight (kg)", value: formatNumber(weightKg, 0) + " kg" },
            { label: "Heart Girth", value: heartGirth + " inches" },
            { label: "Body Length", value: bodyLength + " inches" },
            { label: "Breed Assessment", value: condition },
            { label: "Typical Range", value: range.min + " - " + range.max + " lbs" },
            { label: "Dewormer Tubes Needed", value: String(dewormerTubes) },
            { label: "Daily Feed (est.)", value: formatNumber(weight * 0.02, 0) + " lbs (2% body weight)" },
          ],
        };
      },
    },
    {
      id: "foal",
      name: "Foal/Yearling Weight",
      fields: [
        {
          name: "heartGirth",
          label: "Heart Girth (inches)",
          type: "number",
          placeholder: "e.g. 50",
          min: 20,
          max: 80,
        },
        {
          name: "ageMonths",
          label: "Age (months)",
          type: "number",
          placeholder: "e.g. 6",
          min: 0,
          max: 24,
        },
      ],
      calculate: (inputs) => {
        const heartGirth = inputs.heartGirth as number;
        const ageMonths = inputs.ageMonths as number;
        if (!heartGirth || heartGirth <= 0) return null;

        // Foal weight estimation: HG^2.7 / 660 (simplified)
        const weight = Math.pow(heartGirth, 2.7) / 660;
        const weightKg = weight * 0.453592;

        // Expected mature weight (foal reaches ~46% at 6 months, ~65% at 12 months)
        let maturePercent = 0;
        if (ageMonths && ageMonths > 0) {
          maturePercent = Math.min(100, 24 + ageMonths * 3.8);
        }
        const estimatedMature = maturePercent > 0 ? weight / (maturePercent / 100) : 0;

        const details: { label: string; value: string }[] = [
          { label: "Estimated Weight", value: formatNumber(weight, 0) + " lbs (" + formatNumber(weightKg, 0) + " kg)" },
          { label: "Heart Girth", value: heartGirth + " inches" },
        ];
        if (ageMonths && ageMonths > 0) {
          details.push({ label: "Age", value: ageMonths + " months" });
          details.push({ label: "% of Mature Weight", value: formatNumber(maturePercent, 0) + "%" });
          if (estimatedMature > 0) {
            details.push({ label: "Est. Mature Weight", value: formatNumber(estimatedMature, 0) + " lbs" });
          }
        }

        return {
          primary: {
            label: "Foal Weight Estimate",
            value: formatNumber(weight, 0) + " lbs",
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["horse-feed-calculator", "livestock-water-calculator", "dog-weight-calculator"],
  faq: [
    {
      question: "How do I measure my horse's heart girth?",
      answer:
        "Wrap a soft measuring tape around the horse's barrel, just behind the elbow and withers, at the narrowest point of the ribcage. The tape should be snug but not tight. Measure when the horse is standing square on level ground. This is the 'heart girth' measurement.",
    },
    {
      question: "How accurate is the weight tape formula?",
      answer:
        "The heart girth and body length formula (Weight = Girth^2 x Length / 330) is typically accurate within 3-5% for adult horses in moderate condition. It's less accurate for very thin, obese, pregnant, or heavily muscled horses. A livestock scale is the most accurate method.",
    },
    {
      question: "How much should my horse weigh?",
      answer:
        "Healthy weight varies by breed. Light breeds (Thoroughbred, Arabian) typically weigh 900-1,200 lbs. Stock breeds (Quarter Horse) weigh 1,000-1,300 lbs. Draft breeds can weigh 1,600-2,200+ lbs. Ponies range from 400-900 lbs. Body condition score (1-9 scale) is a better indicator than weight alone.",
    },
  ],
  formula:
    "Adult: Weight (lbs) = (Heart Girth in inches)^2 x Body Length (inches) / 330, adjusted by breed type. Foal: Weight (lbs) = Heart Girth^2.7 / 660. Daily feed = ~2% of body weight.",
};
