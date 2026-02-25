import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const frenchDrainCalcCalculator: CalculatorDefinition = {
  slug: "french-drain-calc-calculator",
  title: "French Drain Gravel Calculator",
  description: "Free French drain calculator. Estimate tons of gravel, linear feet of perforated pipe, landscape fabric, and excavation volume for a French drain system.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["french drain calculator", "french drain gravel calculator", "how much gravel for french drain", "drainage pipe calculator", "french drain cost calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate French Drain Materials",
      description: "Estimate gravel, pipe, and fabric for a French drain",
      fields: [
        { name: "length", label: "Drain Length (feet)", type: "number", placeholder: "e.g. 60" },
        { name: "trenchWidth", label: "Trench Width (inches)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "trenchDepth", label: "Trench Depth (inches)", type: "number", placeholder: "e.g. 18", defaultValue: 18 },
        { name: "pipeSize", label: "Pipe Diameter", type: "select", options: [{ label: "4\" perforated (standard)", value: "4" }, { label: "6\" perforated (heavy drainage)", value: "6" }], defaultValue: "4" },
        { name: "costPerTonGravel", label: "Gravel Cost per Ton (optional)", type: "number", placeholder: "e.g. 40", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const trenchWidthIn = (inputs.trenchWidth as number) || 12;
        const trenchDepthIn = (inputs.trenchDepth as number) || 18;
        const pipeSize = (inputs.pipeSize as string) || "4";
        const costPerTonGravel = inputs.costPerTonGravel as number;
        if (!length) return null;

        const trenchWidthFt = trenchWidthIn / 12;
        const trenchDepthFt = trenchDepthIn / 12;

        // Total trench volume
        const trenchCuFt = length * trenchWidthFt * trenchDepthFt;
        const trenchCuYd = trenchCuFt / 27;

        // Pipe volume to subtract
        const pipeDiameterFt = parseInt(pipeSize) / 12;
        const pipeRadiusFt = pipeDiameterFt / 2;
        const pipeCuFt = Math.PI * pipeRadiusFt * pipeRadiusFt * length;

        // Gravel volume (trench minus pipe)
        const gravelCuFt = trenchCuFt - pipeCuFt;
        const gravelCuYd = gravelCuFt / 27;
        const gravelTons = (gravelCuYd * 2700) / 2000;
        const gravelTonsWithExtra = gravelTons * 1.10;

        // Perforated pipe
        const pipeFt = length;
        const pipePcs10ft = Math.ceil(pipeFt / 10);

        // Landscape fabric: width = trench width + 2 x depth (to line sides and bottom)
        const fabricWidthFt = trenchWidthFt + 2 * trenchDepthFt;
        const fabricSqFt = fabricWidthFt * length;

        // Fittings
        const couplings = pipePcs10ft > 1 ? pipePcs10ft - 1 : 0;

        // Excavation volume (dirt to remove)
        const excavationCuYd = trenchCuYd;

        const details: { label: string; value: string }[] = [
          { label: "Drain Length", value: `${formatNumber(length)} feet` },
          { label: "Trench Size", value: `${trenchWidthIn}\" wide x ${trenchDepthIn}\" deep` },
          { label: "Excavation Volume", value: `${formatNumber(excavationCuYd, 2)} cubic yards` },
          { label: "Gravel Volume", value: `${formatNumber(gravelCuYd, 2)} cubic yards` },
          { label: "Gravel Weight", value: `${formatNumber(gravelTons, 2)} tons` },
          { label: "Gravel with 10% Extra", value: `${formatNumber(gravelTonsWithExtra, 2)} tons` },
          { label: `Perforated Pipe (${pipeSize}\")`, value: `${formatNumber(pipeFt)} ft (${formatNumber(pipePcs10ft)} pcs)` },
          { label: "Pipe Couplings", value: formatNumber(couplings) },
          { label: "Landscape Fabric", value: `${formatNumber(fabricSqFt, 0)} sq ft` },
        ];

        if (costPerTonGravel) {
          const gravelCost = gravelTonsWithExtra * costPerTonGravel;
          const pipeCost = pipePcs10ft * (pipeSize === "4" ? 12 : 20);
          const fabricCost = Math.ceil(fabricSqFt / 100) * 25;
          const couplingCost = couplings * 3;
          const totalCost = gravelCost + pipeCost + fabricCost + couplingCost;
          details.push({ label: "Gravel Cost", value: `$${formatNumber(gravelCost, 2)}` });
          details.push({ label: "Pipe & Fittings", value: `$${formatNumber(pipeCost + couplingCost, 2)}` });
          details.push({ label: "Fabric Cost", value: `$${formatNumber(fabricCost, 2)}` });
          details.push({ label: "Estimated Material Total", value: `$${formatNumber(totalCost, 2)}` });
          details.push({ label: "Cost per linear foot", value: `$${formatNumber(totalCost / length, 2)}` });
        }

        return {
          primary: { label: "Gravel Needed", value: `${formatNumber(gravelTonsWithExtra, 2)} tons` },
          details,
          note: "Use washed 3/4\" to 1.5\" drainage gravel (not pea gravel). Line trench with landscape fabric before adding gravel. Pipe should have holes facing down. Maintain 1% minimum slope (1\" per 8 feet). Includes 10% gravel buffer.",
        };
      },
    },
  ],
  relatedSlugs: ["gravel-calculator", "gutter-sizing-calculator", "landscape-fabric-calc-calculator"],
  faq: [
    { question: "What size gravel for a French drain?", answer: "Use washed 3/4-inch to 1.5-inch crushed stone or river rock. Avoid pea gravel (too small, clogs easily) and large stones (too many gaps). The gravel must allow water to flow while filtering sediment." },
    { question: "How deep should a French drain be?", answer: "A standard French drain should be 18-24 inches deep and 9-12 inches wide. The trench must slope at least 1 inch per 8 feet (1% grade) toward the discharge point." },
    { question: "Do I need landscape fabric for a French drain?", answer: "Yes, landscape fabric prevents soil and silt from clogging the gravel and pipe over time. Line the trench with fabric, add gravel and pipe, then fold the fabric over the top before backfilling." },
  ],
  formula: "Gravel Tons = (Trench Volume - Pipe Volume) / 27 x 2,700 lbs/yd3 / 2,000 x 1.10",
};
