import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pondVolumeCalculator: CalculatorDefinition = {
  slug: "pond-volume-calculator",
  title: "Pond Volume Calculator",
  description:
    "Free pond volume calculator. Calculate fish pond gallons, stocking capacity, pump size, and filter requirements for koi ponds and garden ponds.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pond volume calculator",
    "koi pond calculator",
    "pond gallons calculator",
    "fish pond size",
    "garden pond calculator",
  ],
  variants: [
    {
      id: "rectangular",
      name: "Rectangular Pond",
      fields: [
        {
          name: "length",
          label: "Length (feet)",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
          max: 200,
          step: 0.5,
        },
        {
          name: "width",
          label: "Width (feet)",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          max: 200,
          step: 0.5,
        },
        {
          name: "avgDepth",
          label: "Average Depth (feet)",
          type: "number",
          placeholder: "e.g. 3",
          min: 0.5,
          max: 20,
          step: 0.25,
        },
        {
          name: "fishType",
          label: "Primary Fish Type",
          type: "select",
          options: [
            { label: "Koi (large)", value: "koi" },
            { label: "Goldfish (pond)", value: "goldfish" },
            { label: "Mixed/Other", value: "mixed" },
            { label: "No Fish (water garden)", value: "none" },
          ],
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const avgDepth = inputs.avgDepth as number;
        const fishType = (inputs.fishType as string) || "koi";
        if (!length || !width || !avgDepth || length <= 0 || width <= 0 || avgDepth <= 0) return null;

        const cubicFeet = length * width * avgDepth;
        const gallons = cubicFeet * 7.48052;
        const liters = gallons * 3.78541;

        // Fish stocking
        const gallonsPerFish: Record<string, { gal: number; note: string }> = {
          koi: { gal: 250, note: "250 gal per koi (they grow 24-36 inches)" },
          goldfish: { gal: 50, note: "50 gal per pond goldfish" },
          mixed: { gal: 100, note: "100 gal per fish (conservative)" },
          none: { gal: 0, note: "Water garden - no stocking" },
        };

        const fishInfo = gallonsPerFish[fishType] || gallonsPerFish.mixed;
        const maxFish = fishInfo.gal > 0 ? Math.floor(gallons / fishInfo.gal) : 0;

        // Pump: should circulate entire volume every 1-2 hours
        const pumpGPH = Math.ceil(gallons / 1.5); // 1.5 hour turnover
        const filterGallons = gallons; // Filter rated for pond volume minimum

        // Water treatments
        const waterTreatmentOz = gallons / 100; // typical dechlorinator dosing

        // Depth assessment
        let depthNote = "";
        if (avgDepth < 2) depthNote = "Too shallow for fish overwintering in cold climates.";
        else if (avgDepth < 3) depthNote = "OK for goldfish. Koi may need deeper (3+ ft) in cold climates.";
        else depthNote = "Good depth for most pond fish, including koi.";

        return {
          primary: {
            label: "Pond Volume",
            value: formatNumber(gallons, 0) + " gallons",
          },
          details: [
            { label: "Volume (liters)", value: formatNumber(liters, 0) + " L" },
            { label: "Volume (cubic feet)", value: formatNumber(cubicFeet, 1) + " cu ft" },
            { label: "Surface Area", value: formatNumber(length * width, 0) + " sq ft" },
            {
              label: "Max Fish Capacity",
              value: fishType === "none" ? "N/A" : maxFish + " fish (" + fishInfo.note + ")",
            },
            { label: "Pump Size (GPH)", value: formatNumber(pumpGPH, 0) + " GPH (1.5-hr turnover)" },
            { label: "Filter Rating", value: formatNumber(filterGallons, 0) + "+ gallon rated filter" },
            { label: "Depth Assessment", value: depthNote },
            { label: "Liner Size Needed", value: formatNumber(length + 2 * avgDepth + 2, 0) + "' x " + formatNumber(width + 2 * avgDepth + 2, 0) + "' (with overlap)" },
          ],
        };
      },
    },
    {
      id: "circular",
      name: "Circular/Oval Pond",
      fields: [
        {
          name: "diameter",
          label: "Diameter (feet) or average for oval",
          type: "number",
          placeholder: "e.g. 8",
          min: 1,
          max: 100,
          step: 0.5,
        },
        {
          name: "avgDepth",
          label: "Average Depth (feet)",
          type: "number",
          placeholder: "e.g. 3",
          min: 0.5,
          max: 20,
          step: 0.25,
        },
        {
          name: "shape",
          label: "Shape",
          type: "select",
          options: [
            { label: "Circular", value: "circle" },
            { label: "Oval (use average diameter)", value: "oval" },
            { label: "Kidney/Irregular (~80% of circle)", value: "kidney" },
          ],
        },
      ],
      calculate: (inputs) => {
        const diameter = inputs.diameter as number;
        const avgDepth = inputs.avgDepth as number;
        const shape = (inputs.shape as string) || "circle";
        if (!diameter || !avgDepth || diameter <= 0 || avgDepth <= 0) return null;

        const radius = diameter / 2;
        let cubicFeet = Math.PI * radius * radius * avgDepth;

        // Adjustment for irregular shapes
        if (shape === "kidney") cubicFeet *= 0.8;
        else if (shape === "oval") cubicFeet *= 0.9;

        const gallons = cubicFeet * 7.48052;
        const liters = gallons * 3.78541;
        const surfaceArea = Math.PI * radius * radius * (shape === "kidney" ? 0.8 : shape === "oval" ? 0.9 : 1);
        const pumpGPH = Math.ceil(gallons / 1.5);

        return {
          primary: {
            label: "Pond Volume",
            value: formatNumber(gallons, 0) + " gallons",
          },
          details: [
            { label: "Volume (liters)", value: formatNumber(liters, 0) + " L" },
            { label: "Volume (cubic feet)", value: formatNumber(cubicFeet, 1) + " cu ft" },
            { label: "Surface Area", value: formatNumber(surfaceArea, 0) + " sq ft" },
            { label: "Pump Size (GPH)", value: formatNumber(pumpGPH, 0) + " GPH" },
            { label: "Shape Factor", value: shape === "kidney" ? "80% of full circle" : shape === "oval" ? "90% of full circle" : "Full circle" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fish-tank-size-calculator", "aquarium-calculator", "pool-volume-calculator"],
  faq: [
    {
      question: "How many gallons does my pond hold?",
      answer:
        "For rectangular ponds: Length (ft) x Width (ft) x Depth (ft) x 7.48 = gallons. For circular ponds: Radius^2 x 3.14 x Depth x 7.48 = gallons. For irregular shapes, multiply by 0.8 as an approximation. Knowing your pond volume is essential for stocking fish, sizing equipment, and dosing treatments.",
    },
    {
      question: "How many koi can I put in my pond?",
      answer:
        "The general guideline is 250 gallons per koi for long-term health. Koi can grow 24-36 inches and live 25-35+ years, so they need substantial space. A 1,000-gallon pond should hold no more than 4 koi. Overstocking leads to poor water quality, disease, and stunted growth.",
    },
    {
      question: "How deep should a koi pond be?",
      answer:
        "A koi pond should be at least 3 feet deep (4+ feet is ideal) in most climates. Depth helps maintain stable temperatures, provides protection from predators (herons), and allows fish to overwinter safely below the ice line in cold climates. Shallow areas (1-2 feet) are fine for plants and margins.",
    },
  ],
  formula:
    "Rectangular: gallons = L (ft) x W (ft) x D (ft) x 7.48. Circular: gallons = pi x r^2 x D x 7.48. Kidney: circular x 0.8. Pump GPH = gallons / 1.5 hours. Koi stocking: 250 gallons per fish. Goldfish: 50 gallons per fish.",
};
