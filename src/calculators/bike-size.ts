import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bikeSizeCalculator: CalculatorDefinition = {
  slug: "bike-size-calculator",
  title: "Bike Size Calculator",
  description: "Free bike size calculator. Find the right bicycle frame size for road, mountain, and hybrid bikes based on your height and inseam.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bike size calculator", "bicycle size chart", "bike frame size", "road bike size", "mountain bike size"],
  variants: [
    {
      id: "calc",
      name: "Calculate Bike Frame Size",
      fields: [
        { name: "height", label: "Your Height", type: "number", placeholder: "e.g. 70", suffix: "in" },
        { name: "inseam", label: "Inseam Length", type: "number", placeholder: "e.g. 32", suffix: "in" },
        { name: "bikeType", label: "Bike Type", type: "select", options: [
          { label: "Road Bike", value: "road" },
          { label: "Mountain Bike", value: "mountain" },
          { label: "Hybrid / City Bike", value: "hybrid" },
        ], defaultValue: "road" },
      ],
      calculate: (inputs) => {
        const height = inputs.height as number;
        const inseam = inputs.inseam as number;
        const bikeType = inputs.bikeType as string;
        if (!height || !inseam) return null;

        const inseamCm = inseam * 2.54;
        const heightCm = height * 2.54;

        let frameCm: number;
        let multiplier: number;
        let typeName: string;
        let wheelSize: string;

        if (bikeType === "road") {
          multiplier = 0.70;
          frameCm = inseamCm * multiplier;
          typeName = "Road Bike";
          wheelSize = "700c";
        } else if (bikeType === "mountain") {
          multiplier = 0.66;
          frameCm = inseamCm * multiplier;
          typeName = "Mountain Bike";
          wheelSize = "29\" or 27.5\"";
        } else {
          multiplier = 0.685;
          frameCm = inseamCm * multiplier;
          typeName = "Hybrid Bike";
          wheelSize = "700c";
        }

        // Generic size label
        let sizeLabel = "M";
        if (frameCm < 49) sizeLabel = "XS";
        else if (frameCm < 52) sizeLabel = "S";
        else if (frameCm < 55) sizeLabel = "M";
        else if (frameCm < 58) sizeLabel = "L";
        else sizeLabel = "XL";

        // Standover height ≈ frame size + 25cm for road, frame + 30cm for mountain
        const standoverCm = bikeType === "mountain" ? frameCm + 30 : frameCm + 25;
        const standoverClearance = inseamCm - standoverCm;

        return {
          primary: { label: `${typeName} Frame Size`, value: `${formatNumber(frameCm, 0)} cm (${sizeLabel})` },
          details: [
            { label: "Frame Size Range", value: `${formatNumber(frameCm - 1, 0)}–${formatNumber(frameCm + 1, 0)} cm` },
            { label: "Recommended Wheel Size", value: wheelSize },
            { label: "Your Height", value: `${formatNumber(heightCm, 0)} cm (${height}")` },
            { label: "Your Inseam", value: `${formatNumber(inseamCm, 0)} cm (${inseam}")` },
            { label: "Multiplier Used", value: `inseam × ${multiplier}` },
            { label: "Est. Standover Clearance", value: `${formatNumber(standoverClearance, 1)} cm` },
          ],
          note: "Frame sizes vary between manufacturers. Always test ride when possible. Between sizes, choose smaller for agile handling or larger for stability.",
        };
      },
    },
  ],
  relatedSlugs: ["ski-size-calculator", "helmet-size-calculator", "pace-calculator"],
  faq: [
    { question: "How is bike frame size calculated?", answer: "For road bikes, multiply your inseam (in cm) by 0.70. For mountain bikes, multiply by 0.66. For hybrid bikes, multiply by 0.685. The result is your recommended frame size in centimeters." },
    { question: "Should I size up or down if I'm between sizes?", answer: "If you're between sizes, choose the smaller frame for a more agile, responsive ride, or the larger frame for more stability on long rides. Your riding style matters too — aggressive riders tend to prefer smaller frames." },
    { question: "How do I measure my inseam for bike fitting?", answer: "Stand against a wall in bare feet. Place a book between your legs snugly against your crotch. Measure from the top of the book to the floor. That measurement in inches (or cm) is your cycling inseam." },
  ],
  formula: "Road frame = inseam (cm) × 0.70 | Mountain frame = inseam (cm) × 0.66 | Hybrid frame = inseam (cm) × 0.685",
};
