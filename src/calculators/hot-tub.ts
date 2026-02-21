import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hotTubCalculator: CalculatorDefinition = {
  slug: "hot-tub-calculator",
  title: "Hot Tub Calculator",
  description: "Free hot tub calculator. Calculate hot tub volume in gallons, chemical amounts, and heating cost estimates based on dimensions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hot tub calculator", "hot tub volume", "hot tub gallons", "spa volume calculator", "hot tub chemical calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Hot Tub Volume & Costs",
      description: "Calculate volume, chemicals, and heating costs for your hot tub",
      fields: [
        { name: "length", label: "Length (inches)", type: "number", placeholder: "e.g. 84" },
        { name: "width", label: "Width (inches)", type: "number", placeholder: "e.g. 84" },
        { name: "depth", label: "Depth (inches)", type: "number", placeholder: "e.g. 36" },
        { name: "electricRate", label: "Electricity Rate ($/kWh)", type: "number", placeholder: "e.g. 0.12", step: 0.01, defaultValue: 0.12 },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const depth = inputs.depth as number;
        const electricRate = (inputs.electricRate as number) || 0.12;
        if (!length || !width || !depth) return null;

        const cubicInches = length * width * depth;
        const gallons = cubicInches / 231;
        // Hot tubs are not perfect rectangles, ~80% fill factor
        const actualGallons = gallons * 0.8;
        const liters = actualGallons * 3.785;

        // Chemical estimates for initial fill
        const chlorineOz = (actualGallons / 250) * 0.5; // ~0.5 oz per 250 gal for 2ppm
        const phDownOz = actualGallons / 500; // approximate starting amount

        // Heating cost: raise 50F degree temp rise, 8.34 lbs per gallon, 1 BTU per lb per F
        const btusNeeded = actualGallons * 8.34 * 50;
        const kwhNeeded = btusNeeded / 3412;
        const heatingCost = kwhNeeded * electricRate;

        // Monthly maintenance heating (keeping temp, ~3-6 kWh/day)
        const monthlyKwh = 4.5 * 30;
        const monthlyHeatingCost = monthlyKwh * electricRate;

        return {
          primary: { label: "Hot Tub Volume", value: `${formatNumber(actualGallons, 0)} gallons` },
          details: [
            { label: "Volume (80% fill)", value: `${formatNumber(actualGallons, 0)} gallons` },
            { label: "Maximum volume", value: `${formatNumber(gallons, 0)} gallons` },
            { label: "Volume (liters)", value: `${formatNumber(liters, 0)} L` },
            { label: "Chlorine for initial fill", value: `${formatNumber(chlorineOz, 1)} oz (granular)` },
            { label: "pH adjuster (approx)", value: `${formatNumber(phDownOz, 1)} oz` },
            { label: "Cost to heat (initial fill)", value: `$${formatNumber(heatingCost, 2)}` },
            { label: "Est. monthly heating cost", value: `$${formatNumber(monthlyHeatingCost, 2)}` },
            { label: "Dimensions", value: `${length}" x ${width}" x ${depth}"` },
          ],
          note: "Volume uses 80% fill factor since hot tubs are not perfect rectangles. Heating estimate assumes 50°F temperature rise. Monthly cost assumes well-insulated hot tub using ~4.5 kWh/day.",
        };
      },
    },
  ],
  relatedSlugs: ["pool-volume-calculator", "pool-chemical-calculator", "electricity-usage-calculator"],
  faq: [
    { question: "How many gallons is my hot tub?", answer: "Multiply length x width x depth in inches, divide by 231 to get gallons, then multiply by 0.8 for the actual fill volume (hot tubs are not perfect rectangles). Most 4-person hot tubs hold 250-350 gallons." },
    { question: "How much does it cost to heat a hot tub?", answer: "Initial heating costs $3-$8 depending on size and electricity rate. Monthly operating costs are typically $20-$50 for a well-insulated hot tub. Poorly insulated tubs can cost $75-$150 per month." },
    { question: "What chemicals do I need for a hot tub?", answer: "Essential hot tub chemicals include chlorine or bromine sanitizer, pH increaser/decreaser, alkalinity increaser, and test strips. Maintain chlorine at 1-3 ppm, pH at 7.2-7.6, and alkalinity at 80-120 ppm." },
  ],
  formula: "Gallons = (L x W x D in inches) / 231 x 0.8 | Heating BTU = Gallons x 8.34 x Temp Rise",
};
