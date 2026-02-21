import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cabinetCalculator: CalculatorDefinition = {
  slug: "cabinet-calculator",
  title: "Kitchen Cabinet Calculator",
  description: "Free kitchen cabinet calculator. Estimate the number of cabinets, linear footage, and cost for your kitchen remodel or new kitchen layout.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["kitchen cabinet calculator", "cabinet cost calculator", "how many cabinets do I need", "kitchen remodel calculator", "cabinet linear footage"],
  variants: [
    {
      id: "cabinet-count",
      name: "Cabinet Count & Layout",
      description: "Estimate cabinets needed based on kitchen dimensions",
      fields: [
        { name: "wallLength", label: "Total Wall Length for Cabinets (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "layout", label: "Kitchen Layout", type: "select", options: [
          { label: "L-Shaped", value: "l-shape" },
          { label: "U-Shaped", value: "u-shape" },
          { label: "Galley (Two Walls)", value: "galley" },
          { label: "Single Wall", value: "single" },
          { label: "Island + Perimeter", value: "island" },
        ], defaultValue: "l-shape" },
        { name: "upperCabinets", label: "Include Upper Cabinets?", type: "select", options: [
          { label: "Yes - Full Uppers", value: "full" },
          { label: "Yes - Partial Uppers", value: "partial" },
          { label: "No Uppers", value: "none" },
        ], defaultValue: "full" },
      ],
      calculate: (inputs) => {
        const wallLength = inputs.wallLength as number;
        const layout = inputs.layout as string;
        const upperSetting = inputs.upperCabinets as string;
        if (!wallLength) return null;

        // Deduct for appliances (fridge ~36", range ~30", sink ~36" = ~8.5 ft typical)
        const applianceDeduction = layout === "single" ? 6 : 8.5;
        const usableLength = Math.max(wallLength - applianceDeduction, 0);

        // Base cabinets: mix of 12", 18", 24", 30", 36" widths; average ~24" per cabinet
        const baseCabinetCount = Math.ceil((usableLength * 12) / 24);

        // Upper cabinets
        let upperLength: number;
        switch (upperSetting) {
          case "full": upperLength = usableLength * 0.85; break;
          case "partial": upperLength = usableLength * 0.5; break;
          default: upperLength = 0;
        }
        const upperCabinetCount = Math.ceil((upperLength * 12) / 30);

        const totalCabinets = baseCabinetCount + upperCabinetCount;
        const linearFt = usableLength;

        return {
          primary: { label: "Total Cabinets", value: `${totalCabinets} cabinets` },
          details: [
            { label: "Base cabinets", value: `${baseCabinetCount}` },
            { label: "Upper/wall cabinets", value: `${upperCabinetCount}` },
            { label: "Linear feet (base)", value: `${formatNumber(linearFt, 1)} ft` },
            { label: "Upper cabinet length", value: `${formatNumber(upperLength, 1)} ft` },
            { label: "Deducted for appliances", value: `${formatNumber(applianceDeduction, 1)} ft` },
          ],
          note: "Cabinet count is approximate based on average 24\" base cabinets and 30\" wall cabinets. Actual count depends on your specific layout and cabinet widths chosen.",
        };
      },
    },
    {
      id: "cabinet-cost",
      name: "Cabinet Cost Estimate",
      description: "Estimate total kitchen cabinet costs by quality level",
      fields: [
        { name: "linearFeet", label: "Linear Feet of Cabinets", type: "number", placeholder: "e.g. 20" },
        { name: "quality", label: "Cabinet Quality", type: "select", options: [
          { label: "Stock / Budget ($100-$300/linear ft)", value: "stock" },
          { label: "Semi-Custom ($200-$550/linear ft)", value: "semi" },
          { label: "Custom ($500-$1200/linear ft)", value: "custom" },
        ], defaultValue: "semi" },
        { name: "countertop", label: "Include Countertops?", type: "select", options: [
          { label: "No", value: "0" },
          { label: "Laminate ($15-$40/sq ft)", value: "25" },
          { label: "Granite ($50-$100/sq ft)", value: "75" },
          { label: "Quartz ($50-$120/sq ft)", value: "85" },
          { label: "Butcher Block ($40-$80/sq ft)", value: "55" },
        ], defaultValue: "0" },
        { name: "installation", label: "Installation", type: "select", options: [
          { label: "DIY", value: "0" },
          { label: "Professional ($75-$150/linear ft)", value: "100" },
        ], defaultValue: "100" },
      ],
      calculate: (inputs) => {
        const linearFeet = inputs.linearFeet as number;
        const quality = inputs.quality as string;
        const countertopCostPerSqFt = parseInt(inputs.countertop as string) || 0;
        const installCostPerFt = parseInt(inputs.installation as string) || 0;
        if (!linearFeet) return null;

        let cabinetCostPerFt: number;
        switch (quality) {
          case "stock": cabinetCostPerFt = 200; break;
          case "semi": cabinetCostPerFt = 375; break;
          case "custom": cabinetCostPerFt = 850; break;
          default: cabinetCostPerFt = 375;
        }

        const cabinetCost = linearFeet * cabinetCostPerFt;
        const countertopSqFt = linearFeet * 2.1; // 25" depth average
        const countertopCost = countertopCostPerSqFt > 0 ? countertopSqFt * countertopCostPerSqFt : 0;
        const installCost = linearFeet * installCostPerFt;
        const hardwareCost = linearFeet * 15;
        const totalCost = cabinetCost + countertopCost + installCost + hardwareCost;

        const details = [
          { label: "Cabinet cost", value: `$${formatNumber(cabinetCost, 0)}` },
          { label: "Hardware (knobs/pulls)", value: `$${formatNumber(hardwareCost, 0)}` },
        ];
        if (countertopCost > 0) {
          details.push({ label: "Countertop cost", value: `$${formatNumber(countertopCost, 0)}` });
          details.push({ label: "Countertop area", value: `${formatNumber(countertopSqFt, 1)} sq ft` });
        }
        if (installCost > 0) {
          details.push({ label: "Installation cost", value: `$${formatNumber(installCost, 0)}` });
        }
        details.push({ label: "Linear feet", value: `${formatNumber(linearFeet, 0)} ft` });

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost, 0)}` },
          details,
          note: "Prices vary significantly by region, brand, and material. Stock cabinets from big-box stores are the most affordable. Semi-custom offers more size and style options.",
        };
      },
    },
  ],
  relatedSlugs: ["countertop-calculator", "backsplash-calculator", "square-footage-calculator"],
  faq: [
    { question: "How many cabinets do I need for my kitchen?", answer: "A typical kitchen has 12-15 base cabinets and 8-12 upper cabinets. The exact count depends on kitchen size, layout, and appliance placement. Measure your total wall length, subtract appliance spaces, and divide by average cabinet width (24\" for base, 30\" for upper)." },
    { question: "How much do kitchen cabinets cost?", answer: "Stock cabinets: $100-$300 per linear foot. Semi-custom: $200-$550 per linear foot. Custom: $500-$1,200+ per linear foot. A typical 10×10 kitchen (20 linear feet) costs $4,000-$24,000 for cabinets alone." },
  ],
  formula: "Base Cabinets = (Wall Length - Appliances) × 12 / 24 | Upper Cabinets = Upper Length × 12 / 30 | Cost = Linear Feet × Cost Per Foot",
};
