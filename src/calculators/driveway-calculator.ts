import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const drivewayCalculator: CalculatorDefinition = {
  slug: "driveway-calculator",
  title: "Driveway Calculator",
  description: "Free driveway calculator. Calculate materials, cost, and quantities for concrete, asphalt, gravel, and paver driveways.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["driveway calculator", "driveway cost calculator", "concrete driveway calculator", "asphalt driveway calculator", "gravel driveway calculator"],
  variants: [
    {
      id: "driveway-materials",
      name: "Driveway Materials",
      description: "Calculate materials needed for a new driveway",
      fields: [
        { name: "length", label: "Driveway Length (feet)", type: "number", placeholder: "e.g. 40" },
        { name: "width", label: "Driveway Width (feet)", type: "number", placeholder: "e.g. 12" },
        { name: "material", label: "Driveway Material", type: "select", options: [
          { label: "Concrete (4\" thick)", value: "concrete" },
          { label: "Asphalt (3\" thick)", value: "asphalt" },
          { label: "Gravel (6\" thick)", value: "gravel" },
          { label: "Pavers (on 6\" base)", value: "pavers" },
          { label: "Stamped Concrete (4\" thick)", value: "stamped" },
        ], defaultValue: "concrete" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const material = inputs.material as string;
        if (!length || !width) return null;

        const areaSqFt = length * width;
        let thickness: number;
        let materialQty: string;
        let materialUnit: string;
        let costPerSqFt: number;
        let additionalInfo: string;

        switch (material) {
          case "concrete": {
            thickness = 4;
            const cuFt = areaSqFt * (thickness / 12);
            const cuYd = cuFt / 27;
            materialQty = formatNumber(cuYd * 1.10, 2);
            materialUnit = "cubic yards (with 10% waste)";
            costPerSqFt = 8;
            additionalInfo = `${Math.ceil(cuFt / 0.6)} bags of 80-lb concrete (or ${formatNumber(cuYd * 1.10, 1)} cu yd ready-mix)`;
            break;
          }
          case "asphalt": {
            thickness = 3;
            const tons = (areaSqFt * thickness * 145) / (12 * 2000); // 145 lbs/cu ft density
            materialQty = formatNumber(tons * 1.10, 2);
            materialUnit = "tons (with 10% waste)";
            costPerSqFt = 5;
            additionalInfo = `Requires 6-8\" compacted gravel sub-base`;
            break;
          }
          case "gravel": {
            thickness = 6;
            const cuYd = (areaSqFt * (thickness / 12)) / 27;
            materialQty = formatNumber(cuYd * 1.10, 2);
            materialUnit = "cubic yards (with 10% waste)";
            costPerSqFt = 2;
            additionalInfo = `${formatNumber(cuYd * 1.35, 2)} tons of crushed stone`;
            break;
          }
          case "pavers": {
            thickness = 2.375; // Paver thickness
            const paverCount = Math.ceil(areaSqFt * 4.5); // ~4.5 standard pavers per sq ft
            materialQty = formatNumber(paverCount * 1.10, 0);
            materialUnit = "pavers (with 10% waste)";
            costPerSqFt = 15;
            additionalInfo = `Plus 6\" gravel base (${formatNumber((areaSqFt * 0.5) / 27, 2)} cu yd) and 1\" sand bedding`;
            break;
          }
          case "stamped": {
            thickness = 4;
            const cuFt = areaSqFt * (thickness / 12);
            const cuYd = cuFt / 27;
            materialQty = formatNumber(cuYd * 1.10, 2);
            materialUnit = "cubic yards (with 10% waste)";
            costPerSqFt = 14;
            additionalInfo = "Includes coloring and stamping pattern. Seal coat recommended annually.";
            break;
          }
          default: {
            thickness = 4;
            materialQty = "0";
            materialUnit = "";
            costPerSqFt = 8;
            additionalInfo = "";
          }
        }

        const estimatedCost = areaSqFt * costPerSqFt;

        return {
          primary: { label: "Material Needed", value: `${materialQty} ${materialUnit}` },
          details: [
            { label: "Driveway area", value: `${formatNumber(areaSqFt, 0)} sq ft` },
            { label: "Material thickness", value: `${thickness} inches` },
            { label: "Estimated installed cost", value: `$${formatNumber(estimatedCost, 0)}` },
            { label: "Cost per sq ft (installed)", value: `$${formatNumber(costPerSqFt, 2)}` },
            { label: "Additional materials", value: additionalInfo },
            { label: "Dimensions", value: `${length}' × ${width}'` },
          ],
          note: "Concrete driveways need 4\" minimum thickness (6\" for heavy vehicles). All driveways need proper gravel sub-base and drainage slope (1/4\" per foot minimum). Costs are approximate and vary by region.",
        };
      },
    },
    {
      id: "driveway-cost-compare",
      name: "Driveway Cost Comparison",
      description: "Compare costs of different driveway materials",
      fields: [
        { name: "length", label: "Driveway Length (feet)", type: "number", placeholder: "e.g. 40" },
        { name: "width", label: "Driveway Width (feet)", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        if (!length || !width) return null;

        const areaSqFt = length * width;

        const options = [
          { name: "Gravel", low: 1.5, high: 3, lifespan: "5-15 years" },
          { name: "Asphalt", low: 4, high: 8, lifespan: "15-20 years" },
          { name: "Concrete", low: 6, high: 12, lifespan: "25-50 years" },
          { name: "Stamped Concrete", low: 10, high: 18, lifespan: "25-50 years" },
          { name: "Pavers", low: 12, high: 25, lifespan: "25-50+ years" },
          { name: "Heated Driveway", low: 14, high: 30, lifespan: "25-50 years" },
        ];

        const details = options.map(opt => ({
          label: `${opt.name} (${opt.lifespan})`,
          value: `$${formatNumber(areaSqFt * opt.low, 0)} - $${formatNumber(areaSqFt * opt.high, 0)}`,
        }));

        details.unshift({ label: "Driveway area", value: `${formatNumber(areaSqFt, 0)} sq ft` });

        return {
          primary: { label: "Driveway Area", value: `${formatNumber(areaSqFt, 0)} sq ft` },
          details,
          note: "Prices include materials and installation. Gravel is cheapest upfront but requires ongoing maintenance. Concrete and pavers have the highest long-term value. Consider climate, aesthetic, and maintenance when choosing.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "asphalt-calculator", "gravel-calculator"],
  faq: [
    { question: "How thick should a concrete driveway be?", answer: "Standard concrete driveways should be 4 inches thick. Increase to 5-6 inches for heavy vehicles (RVs, trucks) or at the apron where it meets the street. Use 4,000 PSI concrete mix for driveways. Fiber mesh or wire mesh reinforcement is recommended." },
    { question: "How wide should a driveway be?", answer: "Single car: 10-12 feet wide. Two cars side-by-side: 20-24 feet. With parking pad: 12 feet for driving lane + parking area. Check local codes for minimum setback requirements from property lines." },
  ],
  formula: "Concrete (cu yd) = L × W × Thickness / 12 / 27 | Asphalt (tons) = L × W × Thickness × 145 / 12 / 2000 | Gravel (cu yd) = L × W × Depth / 12 / 27",
};
