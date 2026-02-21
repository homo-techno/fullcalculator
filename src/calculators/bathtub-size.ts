import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bathtubSizeCalculator: CalculatorDefinition = {
  slug: "bathtub-size-calculator",
  title: "Bathtub Size & Volume Calculator",
  description: "Free bathtub size and volume calculator. Calculate bathtub water capacity, fill time, and water costs for standard, soaking, and freestanding tubs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bathtub size calculator", "bathtub volume calculator", "bathtub water capacity", "tub gallon calculator", "bathtub dimensions"],
  variants: [
    {
      id: "tub-volume",
      name: "Bathtub Volume & Water Use",
      description: "Calculate water capacity and usage for your bathtub",
      fields: [
        { name: "length", label: "Tub Length (inches)", type: "number", placeholder: "e.g. 60" },
        { name: "width", label: "Tub Width (inches)", type: "number", placeholder: "e.g. 30" },
        { name: "depth", label: "Water Depth (inches)", type: "number", placeholder: "e.g. 14", defaultValue: 14 },
        { name: "tubShape", label: "Tub Shape", type: "select", options: [
          { label: "Standard Rectangular (alcove)", value: "0.75" },
          { label: "Oval / Freestanding", value: "0.65" },
          { label: "Corner / Triangle", value: "0.55" },
          { label: "Japanese Soaking (deep)", value: "0.80" },
        ], defaultValue: "0.75" },
        { name: "waterCost", label: "Water Cost per 1000 Gallons ($)", type: "number", placeholder: "e.g. 5", defaultValue: 5 },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const depth = (inputs.depth as number) || 14;
        const shapeFactor = parseFloat(inputs.tubShape as string) || 0.75;
        const waterCost = (inputs.waterCost as number) || 5;
        if (!length || !width) return null;

        const volumeCuIn = length * width * depth * shapeFactor;
        const gallons = volumeCuIn / 231;
        const liters = gallons * 3.785;
        const fillTimeMin = gallons / 4; // Average faucet: 4 GPM
        const costPerBath = (gallons / 1000) * waterCost;
        const monthlyBaths = 30;
        const monthlyCost = costPerBath * monthlyBaths;

        // Hot water cost (heating ~70% of water from 55°F to 120°F)
        const hotWaterGallons = gallons * 0.7;
        const btuNeeded = hotWaterGallons * 8.33 * (120 - 55);
        const hotWaterCost = (btuNeeded / 100000) * 1.2; // ~$1.20 per therm

        return {
          primary: { label: "Bathtub Capacity", value: `${formatNumber(gallons, 1)} gallons` },
          details: [
            { label: "Volume", value: `${formatNumber(liters, 1)} liters` },
            { label: "Fill time (at 4 GPM)", value: `${formatNumber(fillTimeMin, 1)} minutes` },
            { label: "Water cost per bath", value: `$${formatNumber(costPerBath, 3)}` },
            { label: "Hot water energy cost per bath", value: `$${formatNumber(hotWaterCost, 2)}` },
            { label: "Total cost per bath", value: `$${formatNumber(costPerBath + hotWaterCost, 2)}` },
            { label: "Monthly cost (daily baths)", value: `$${formatNumber(monthlyCost + hotWaterCost * monthlyBaths, 2)}` },
          ],
          note: "Shape factor accounts for tapered/curved tub walls. Actual capacity depends on tub design. Average bath uses 36-50 gallons; a shower uses 17-20 gallons.",
        };
      },
    },
    {
      id: "tub-standard",
      name: "Standard Tub Size Finder",
      description: "Find the right standard bathtub size for your bathroom",
      fields: [
        { name: "spaceLength", label: "Available Space Length (inches)", type: "number", placeholder: "e.g. 60" },
        { name: "spaceWidth", label: "Available Space Width (inches)", type: "number", placeholder: "e.g. 32" },
        { name: "tubType", label: "Tub Type", type: "select", options: [
          { label: "Standard Alcove", value: "alcove" },
          { label: "Drop-In", value: "dropin" },
          { label: "Freestanding", value: "freestanding" },
          { label: "Corner", value: "corner" },
          { label: "Walk-In (accessible)", value: "walkin" },
        ], defaultValue: "alcove" },
      ],
      calculate: (inputs) => {
        const spaceLength = inputs.spaceLength as number;
        const spaceWidth = inputs.spaceWidth as number;
        const tubType = inputs.tubType as string;
        if (!spaceLength || !spaceWidth) return null;

        const standardSizes = {
          alcove: [
            { l: 60, w: 30, name: "Standard (60\"×30\")", gal: 42 },
            { l: 60, w: 32, name: "Wide (60\"×32\")", gal: 48 },
            { l: 66, w: 32, name: "Long (66\"×32\")", gal: 55 },
            { l: 54, w: 30, name: "Compact (54\"×30\")", gal: 35 },
            { l: 48, w: 28, name: "Small (48\"×28\")", gal: 28 },
          ],
          dropin: [
            { l: 60, w: 42, name: "Standard (60\"×42\")", gal: 65 },
            { l: 72, w: 42, name: "Large (72\"×42\")", gal: 80 },
            { l: 66, w: 36, name: "Medium (66\"×36\")", gal: 60 },
          ],
          freestanding: [
            { l: 55, w: 27, name: "Small (55\"×27\")", gal: 40 },
            { l: 60, w: 30, name: "Standard (60\"×30\")", gal: 52 },
            { l: 67, w: 31, name: "Large (67\"×31\")", gal: 65 },
            { l: 71, w: 32, name: "Extra Large (71\"×32\")", gal: 75 },
          ],
          corner: [
            { l: 60, w: 60, name: "Standard (60\"×60\")", gal: 75 },
            { l: 48, w: 48, name: "Small (48\"×48\")", gal: 50 },
          ],
          walkin: [
            { l: 52, w: 30, name: "Standard (52\"×30\")", gal: 50 },
            { l: 60, w: 30, name: "Large (60\"×30\")", gal: 60 },
          ],
        };

        const sizes = standardSizes[tubType as keyof typeof standardSizes] || standardSizes.alcove;
        const fitting = sizes.filter(s => s.l <= spaceLength && s.w <= spaceWidth);
        const recommended = fitting.length > 0 ? fitting[fitting.length - 1] : sizes[sizes.length - 1];

        const details = [
          { label: "Your available space", value: `${spaceLength}" × ${spaceWidth}"` },
          { label: "Recommended tub", value: recommended.name },
          { label: "Approximate capacity", value: `${recommended.gal} gallons` },
        ];

        fitting.forEach((s, i) => {
          details.push({ label: `Option ${i + 1}`, value: `${s.name} - ${s.gal} gal` });
        });

        if (fitting.length === 0) {
          details.push({ label: "Warning", value: "No standard sizes fit. Consider a custom or compact tub." });
        }

        return {
          primary: { label: "Recommended Size", value: recommended.name },
          details,
          note: "Allow 1-2\" clearance on each side for installation. Alcove tubs need exact width match. Freestanding tubs need space around all sides.",
        };
      },
    },
  ],
  relatedSlugs: ["bathroom-tile-calculator", "shower-tile-calculator", "pool-volume-calculator"],
  faq: [
    { question: "What is the standard bathtub size?", answer: "Standard alcove tub: 60\" long × 30\" wide × 14-16\" deep. This fits a standard 5-foot bathroom alcove. Compact tubs (48\"-54\") are available for small bathrooms. Soaking tubs are 60\"-72\" with deeper water (17\"-22\")." },
    { question: "How many gallons does a bathtub hold?", answer: "A standard bathtub holds 36-50 gallons when filled. Soaking tubs hold 60-80 gallons. Whirlpool/jacuzzi tubs can hold 80-110 gallons. For comparison, a typical shower uses 17-20 gallons." },
  ],
  formula: "Volume (gallons) = (L × W × Depth × Shape Factor) / 231 | Fill Time = Gallons / Flow Rate (GPM)",
};
