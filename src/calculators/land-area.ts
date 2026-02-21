import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const landAreaCalculator: CalculatorDefinition = {
  slug: "land-area-calculator",
  title: "Land Area Calculator",
  description:
    "Free land area calculator. Convert between acres, square feet, hectares, and square meters. Calculate lot size, land cost per acre, and parcel dimensions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "land area calculator",
    "lot size calculator",
    "acreage calculator",
    "land size converter",
    "acres to square feet",
  ],
  variants: [
    {
      id: "convert",
      name: "Land Area Conversion",
      description: "Convert between land area units",
      fields: [
        { name: "area", label: "Area Value", type: "number", placeholder: "e.g. 2.5", min: 0, step: 0.01 },
        {
          name: "fromUnit",
          label: "From Unit",
          type: "select",
          options: [
            { label: "Acres", value: "acres" },
            { label: "Square Feet", value: "sqft" },
            { label: "Square Meters", value: "sqm" },
            { label: "Hectares", value: "hectares" },
            { label: "Square Yards", value: "sqyd" },
          ],
          defaultValue: "acres",
        },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const unit = inputs.fromUnit as string;
        if (!area) return null;

        // Convert everything to square feet first
        const toSqft: Record<string, number> = {
          acres: 43560,
          sqft: 1,
          sqm: 10.7639,
          hectares: 107639,
          sqyd: 9,
        };

        const sqft = area * (toSqft[unit] || 1);
        const acres = sqft / 43560;
        const sqm = sqft / 10.7639;
        const hectares = sqft / 107639;
        const sqyd = sqft / 9;

        return {
          primary: { label: "Square Feet", value: formatNumber(sqft, 2) },
          details: [
            { label: "Acres", value: formatNumber(acres, 4) },
            { label: "Hectares", value: formatNumber(hectares, 4) },
            { label: "Square meters", value: formatNumber(sqm, 2) },
            { label: "Square yards", value: formatNumber(sqyd, 2) },
          ],
        };
      },
    },
    {
      id: "cost-per-acre",
      name: "Land Cost Calculator",
      description: "Calculate price per acre and total land cost",
      fields: [
        { name: "totalPrice", label: "Total Land Price", type: "number", placeholder: "e.g. 250000", prefix: "$", min: 0 },
        { name: "totalAcres", label: "Total Acres", type: "number", placeholder: "e.g. 10", suffix: "acres", min: 0, step: 0.01 },
        { name: "desiredAcres", label: "Desired Acres (optional)", type: "number", placeholder: "e.g. 3", suffix: "acres", min: 0, step: 0.01 },
      ],
      calculate: (inputs) => {
        const price = inputs.totalPrice as number;
        const acres = inputs.totalAcres as number;
        const desired = (inputs.desiredAcres as number) || 0;
        if (!price || !acres) return null;

        const pricePerAcre = price / acres;
        const pricePerSqft = price / (acres * 43560);
        const desiredCost = desired > 0 ? pricePerAcre * desired : null;

        return {
          primary: { label: "Price Per Acre", value: `$${formatNumber(pricePerAcre)}` },
          details: [
            { label: "Price per sq ft", value: `$${formatNumber(pricePerSqft, 4)}` },
            { label: "Total land area", value: `${formatNumber(acres)} acres (${formatNumber(acres * 43560)} sq ft)` },
            { label: "Total price", value: `$${formatNumber(price)}` },
            ...(desiredCost !== null ? [{ label: `Cost for ${formatNumber(desired)} acres`, value: `$${formatNumber(desiredCost)}` }] : []),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "property-tax-calculator", "home-value-calculator"],
  faq: [
    {
      question: "How many square feet are in an acre?",
      answer:
        "One acre equals 43,560 square feet. To visualize it, an acre is about 90% of a football field (which is 48,000 sq ft including end zones). A half-acre lot is 21,780 sq ft.",
    },
    {
      question: "How do I calculate price per acre?",
      answer:
        "Price per acre = Total Price / Total Acres. For example, if a 5-acre parcel is listed at $150,000, the price per acre is $30,000. Compare this to local averages for similar land types.",
    },
    {
      question: "What is a hectare?",
      answer:
        "A hectare is a metric unit of area equal to 10,000 square meters or about 2.471 acres. It's commonly used internationally for measuring land area, especially in agriculture and real estate outside the US.",
    },
  ],
  formula: "1 Acre = 43,560 sq ft = 4,046.86 sq m | 1 Hectare = 2.471 Acres | Price/Acre = Total Price / Total Acres",
};
