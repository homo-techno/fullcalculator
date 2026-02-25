import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const patioPaverCalcCalculator: CalculatorDefinition = {
  slug: "patio-paver-calc-calculator",
  title: "Patio Paver Block Calculator",
  description: "Free patio paver calculator. Estimate how many paver blocks, sand base, and edging materials you need for your patio, walkway, or driveway project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["patio paver calculator", "paver block calculator", "how many pavers do I need", "brick paver calculator", "paver patio cost calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Patio Paver Materials",
      description: "Estimate pavers, base materials, and edging",
      fields: [
        { name: "length", label: "Patio Length (feet)", type: "number", placeholder: "e.g. 16" },
        { name: "width", label: "Patio Width (feet)", type: "number", placeholder: "e.g. 12" },
        { name: "paverSize", label: "Paver Size", type: "select", options: [{ label: "4\" x 8\" (standard brick)", value: "4x8" }, { label: "6\" x 6\"", value: "6x6" }, { label: "6\" x 9\"", value: "6x9" }, { label: "12\" x 12\"", value: "12x12" }], defaultValue: "4x8" },
        { name: "costPerPaver", label: "Cost per Paver (optional)", type: "number", placeholder: "e.g. 0.75", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const paverSize = (inputs.paverSize as string) || "4x8";
        const costPerPaver = inputs.costPerPaver as number;
        if (!length || !width) return null;

        const areaSqFt = length * width;
        const perimeterFt = 2 * (length + width);

        // Pavers per sq ft (including 1/8" joint spacing)
        let paversPerSqFt = 0;
        let paverLabel = "";
        if (paverSize === "4x8") {
          paversPerSqFt = 4.5;
          paverLabel = "4\" x 8\"";
        } else if (paverSize === "6x6") {
          paversPerSqFt = 4;
          paverLabel = "6\" x 6\"";
        } else if (paverSize === "6x9") {
          paversPerSqFt = 2.67;
          paverLabel = "6\" x 9\"";
        } else {
          paversPerSqFt = 1;
          paverLabel = "12\" x 12\"";
        }

        const paversExact = Math.ceil(areaSqFt * paversPerSqFt);
        const paversWithWaste = Math.ceil(paversExact * 1.10);

        // Base materials: 6" gravel base + 1" sand setting bed
        const gravelCuYd = (areaSqFt * (6 / 12)) / 27;
        const gravelTons = gravelCuYd * 2700 / 2000;
        const sandCuYd = (areaSqFt * (1 / 12)) / 27;
        const sandTons = sandCuYd * 2600 / 2000;

        // Polymeric sand for joints
        const polySandBags = Math.ceil(areaSqFt / 40);

        // Edge restraint
        const edgingPcs = Math.ceil(perimeterFt / 8); // 8-foot sections
        const edgeSpikes = Math.ceil(perimeterFt / 1.5); // spike every 18"

        const details: { label: string; value: string }[] = [
          { label: "Patio Area", value: `${formatNumber(areaSqFt)} sq ft` },
          { label: "Paver Size", value: paverLabel },
          { label: "Pavers (exact)", value: formatNumber(paversExact) },
          { label: "Pavers with 10% Waste", value: formatNumber(paversWithWaste) },
          { label: "Gravel Base (6\")", value: `${formatNumber(gravelTons, 2)} tons` },
          { label: "Sand Bed (1\")", value: `${formatNumber(sandTons, 2)} tons` },
          { label: "Polymeric Sand Bags", value: formatNumber(polySandBags) },
          { label: "Edge Restraint (8' pcs)", value: formatNumber(edgingPcs) },
          { label: "Edge Spikes", value: formatNumber(edgeSpikes) },
        ];

        if (costPerPaver) {
          const paverCost = paversWithWaste * costPerPaver;
          const baseCost = gravelTons * 35 + sandTons * 40 + polySandBags * 25;
          const edgeCost = edgingPcs * 10 + edgeSpikes * 0.5;
          const totalCost = paverCost + baseCost + edgeCost;
          details.push({ label: "Paver Cost", value: `$${formatNumber(paverCost, 2)}` });
          details.push({ label: "Base & Edge Materials", value: `$${formatNumber(baseCost + edgeCost, 2)}` });
          details.push({ label: "Estimated Total", value: `$${formatNumber(totalCost, 2)}` });
          details.push({ label: "Cost per sq ft", value: `$${formatNumber(totalCost / areaSqFt, 2)}` });
        }

        return {
          primary: { label: "Pavers Needed", value: `${formatNumber(paversWithWaste)} pavers` },
          details,
          note: "Includes 10% waste factor for cuts and breakage. Standard installation requires 6\" compacted gravel base, 1\" sand bed, and paver edge restraint. Compact base in 2\" lifts.",
        };
      },
    },
  ],
  relatedSlugs: ["flagstone-patio-calculator", "concrete-calculator", "gravel-calculator"],
  faq: [
    { question: "How many pavers do I need per square foot?", answer: "It depends on paver size: 4x8\" brick pavers = ~4.5 per sq ft, 6x6\" = ~4 per sq ft, 6x9\" = ~2.67 per sq ft, 12x12\" = 1 per sq ft. Always add 10% for cuts and waste." },
    { question: "What base do I need under patio pavers?", answer: "A proper paver base consists of 6 inches of compacted gravel (crushed stone), topped with 1 inch of coarse sand as a setting bed. The gravel should be compacted in 2-inch lifts." },
    { question: "Do I need edging for a paver patio?", answer: "Yes, paver edge restraint is essential to prevent the pavers from shifting outward over time. Use rigid plastic or aluminum edging secured with 10-inch spikes every 18 inches." },
  ],
  formula: "Pavers = Area (sq ft) x Pavers per sq ft x 1.10 waste factor",
};
