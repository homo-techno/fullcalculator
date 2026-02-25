import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const syntheticTurfCalculator: CalculatorDefinition = {
  slug: "synthetic-turf-calculator",
  title: "Artificial Turf Calculator",
  description: "Free artificial turf calculator. Estimate how much synthetic grass, infill, base material, seam tape, and edging you need for your turf installation project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["artificial turf calculator", "synthetic grass calculator", "fake grass calculator", "how much artificial turf do I need", "turf installation calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Artificial Turf Materials",
      description: "Estimate turf, infill, and base materials",
      fields: [
        { name: "length", label: "Area Length (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "width", label: "Area Width (feet)", type: "number", placeholder: "e.g. 15" },
        { name: "turfRollWidth", label: "Turf Roll Width", type: "select", options: [{ label: "12 feet wide", value: "12" }, { label: "15 feet wide", value: "15" }], defaultValue: "15" },
        { name: "infillType", label: "Infill Type", type: "select", options: [{ label: "Silica Sand", value: "silica" }, { label: "Crumb Rubber", value: "rubber" }, { label: "Zeolite (pet-friendly)", value: "zeolite" }, { label: "None (low-pile turf)", value: "none" }], defaultValue: "silica" },
        { name: "costPerSqFt", label: "Turf Cost per sq ft (optional)", type: "number", placeholder: "e.g. 3.50", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const turfRollWidth = parseFloat((inputs.turfRollWidth as string) || "15");
        const infillType = (inputs.infillType as string) || "silica";
        const costPerSqFt = inputs.costPerSqFt as number;
        if (!length || !width) return null;

        const areaSqFt = length * width;

        // Calculate turf panels needed (turf comes in rolls, one direction only)
        const panelsNeeded = Math.ceil(width / turfRollWidth);
        const turfLinearFt = panelsNeeded * length;
        const turfSqFt = turfLinearFt * turfRollWidth;
        const wastePercent = ((turfSqFt - areaSqFt) / areaSqFt) * 100;

        // Seam tape: length of each seam between panels
        const seams = panelsNeeded > 1 ? panelsNeeded - 1 : 0;
        const seamTapeFt = seams * length;
        const seamGlue = Math.ceil(seamTapeFt / 50); // 1 tube per 50 linear feet

        // Infill: approximately 1-2 lbs per sq ft
        let infillLbsPerSqFt = 0;
        let infillLabel = "";
        if (infillType === "silica") {
          infillLbsPerSqFt = 1.5;
          infillLabel = "Silica Sand";
        } else if (infillType === "rubber") {
          infillLbsPerSqFt = 1.0;
          infillLabel = "Crumb Rubber";
        } else if (infillType === "zeolite") {
          infillLbsPerSqFt = 1.5;
          infillLabel = "Zeolite";
        } else {
          infillLbsPerSqFt = 0;
          infillLabel = "None";
        }

        const infillLbs = areaSqFt * infillLbsPerSqFt;
        const infillBags50lb = Math.ceil(infillLbs / 50);

        // Base materials: 3" of crushed rock base
        const baseCuFt = areaSqFt * (3 / 12);
        const baseTons = (baseCuFt / 27) * 2700 / 2000;

        // Landscape staples: every 6" along edges, every 12" on seams
        const perimeterFt = 2 * (length + width);
        const edgeStaples = Math.ceil(perimeterFt * 2); // every 6"
        const seamStaples = Math.ceil(seamTapeFt * 1); // every 12"
        const totalStaples = edgeStaples + seamStaples;

        // Perimeter nailer board
        const nailerBoardFt = perimeterFt;

        const details: { label: string; value: string }[] = [
          { label: "Area", value: `${formatNumber(areaSqFt)} sq ft` },
          { label: "Turf Roll Width", value: `${turfRollWidth} feet` },
          { label: "Panels Needed", value: formatNumber(panelsNeeded) },
          { label: "Turf to Order", value: `${formatNumber(turfSqFt)} sq ft (${formatNumber(turfLinearFt)} linear ft)` },
          { label: "Material Waste", value: `${formatNumber(wastePercent, 1)}%` },
          { label: "Seam Tape", value: seamTapeFt > 0 ? `${formatNumber(seamTapeFt)} ft` : "Not needed" },
          { label: "Seam Glue Tubes", value: formatNumber(seamGlue) },
          { label: "Infill Type", value: infillLabel },
        ];

        if (infillLbs > 0) {
          details.push({ label: "Infill Amount", value: `${formatNumber(infillLbs, 0)} lbs (${formatNumber(infillBags50lb)} bags)` });
        }

        details.push(
          { label: "Crushed Rock Base (3\")", value: `${formatNumber(baseTons, 2)} tons` },
          { label: "Landscape Staples", value: formatNumber(totalStaples) },
          { label: "Perimeter Nailer Board", value: `${formatNumber(nailerBoardFt)} linear feet` },
        );

        if (costPerSqFt) {
          const turfCost = turfSqFt * costPerSqFt;
          const infillCost = infillBags50lb * (infillType === "zeolite" ? 30 : infillType === "rubber" ? 15 : 8);
          const baseCost = baseTons * 35;
          const accessoryCost = seamGlue * 20 + Math.ceil(seamTapeFt / 25) * 30 + totalStaples * 0.15 + nailerBoardFt * 1;
          const totalCost = turfCost + infillCost + baseCost + accessoryCost;
          details.push({ label: "Turf Cost", value: `$${formatNumber(turfCost, 2)}` });
          details.push({ label: "Infill & Base Cost", value: `$${formatNumber(infillCost + baseCost, 2)}` });
          details.push({ label: "Accessories", value: `$${formatNumber(accessoryCost, 2)}` });
          details.push({ label: "Estimated Total", value: `$${formatNumber(totalCost, 2)}` });
          details.push({ label: "Total per sq ft", value: `$${formatNumber(totalCost / areaSqFt, 2)}` });
        }

        return {
          primary: { label: "Artificial Turf Needed", value: `${formatNumber(turfSqFt)} sq ft` },
          details,
          note: "Turf must be installed with all grain running in the same direction. Seams should run parallel to the primary viewing direction. Infill helps blades stand upright and provides ballast. Includes 3\" crushed rock base.",
        };
      },
    },
  ],
  relatedSlugs: ["landscape-fabric-calc-calculator", "gravel-calculator", "playground-surface-calculator"],
  faq: [
    { question: "How much does artificial turf cost?", answer: "Artificial turf costs $2-$8 per square foot for materials depending on quality and pile height. Professional installation adds $4-$12 per square foot. Total installed cost ranges from $6-$20 per square foot." },
    { question: "What base goes under artificial turf?", answer: "Install 3-4 inches of crushed rock (3/4\" minus or decomposed granite) as a base, compacted to 95%. This provides drainage and a stable surface. Do not use regular dirt or sand as a base." },
    { question: "Does artificial turf need infill?", answer: "Most turf benefits from infill (silica sand, crumb rubber, or zeolite at 1-2 lbs per sq ft). Infill supports blade memory, provides cushion, adds weight, and improves drainage. Some short-pile products skip infill." },
  ],
  formula: "Turf sq ft = Panels (Width / Roll Width, rounded up) x Length x Roll Width",
};
