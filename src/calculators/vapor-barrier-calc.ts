import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vaporBarrierCalcCalculator: CalculatorDefinition = {
  slug: "vapor-barrier-calc-calculator",
  title: "Vapor Barrier Calculator",
  description: "Free vapor barrier calculator. Estimate how much polyethylene sheeting you need for crawl spaces, basements, concrete slabs, and walls.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["vapor barrier calculator", "moisture barrier calculator", "crawl space vapor barrier", "poly sheeting calculator", "moisture barrier for concrete"],
  variants: [
    {
      id: "calc",
      name: "Calculate Vapor Barrier Materials",
      description: "Estimate polyethylene sheeting and accessories",
      fields: [
        { name: "length", label: "Area Length (feet)", type: "number", placeholder: "e.g. 40" },
        { name: "width", label: "Area Width (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "application", label: "Application", type: "select", options: [{ label: "Crawl Space Floor", value: "crawl_floor" }, { label: "Crawl Space (Floor + Walls)", value: "crawl_all" }, { label: "Under Concrete Slab", value: "slab" }, { label: "Wall Interior", value: "wall" }], defaultValue: "crawl_floor" },
        { name: "thickness", label: "Poly Thickness", type: "select", options: [{ label: "6 mil (standard)", value: "6" }, { label: "10 mil (heavy duty)", value: "10" }, { label: "12 mil (reinforced)", value: "12" }, { label: "20 mil (crawl space encapsulation)", value: "20" }], defaultValue: "6" },
        { name: "costPerRoll", label: "Cost per Roll (optional)", type: "number", placeholder: "e.g. 60", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const application = (inputs.application as string) || "crawl_floor";
        const thickness = (inputs.thickness as string) || "6";
        const costPerRoll = inputs.costPerRoll as number;
        if (!length || !width) return null;

        const floorArea = length * width;
        let totalArea = floorArea;

        // Add wall area for crawl space encapsulation
        let wallArea = 0;
        if (application === "crawl_all") {
          const wallHeight = 3; // average crawl space wall height
          const perimeter = 2 * (length + width);
          wallArea = perimeter * wallHeight;
          totalArea = floorArea + wallArea;
        }

        // Add overlap: 12" overlap between sheets
        const overlapFactor = 1.15;
        const adjustedArea = totalArea * overlapFactor;

        // Standard roll sizes based on thickness
        let rollWidth = 0;
        let rollLength = 0;
        let rollSqFt = 0;
        if (thickness === "6") {
          rollWidth = 20;
          rollLength = 100;
          rollSqFt = 2000;
        } else if (thickness === "10") {
          rollWidth = 10;
          rollLength = 100;
          rollSqFt = 1000;
        } else if (thickness === "12") {
          rollWidth = 12;
          rollLength = 100;
          rollSqFt = 1200;
        } else {
          rollWidth = 12;
          rollLength = 60;
          rollSqFt = 720;
        }

        const rollsNeeded = Math.ceil(adjustedArea / rollSqFt);

        // Tape: seam tape for all overlaps
        const seamsLength = Math.ceil(totalArea / rollWidth) * 2;
        const tapeRolls = Math.ceil(seamsLength / 180);

        // Stakes/fasteners for crawl space
        const fasteners = application.startsWith("crawl") ? Math.ceil(totalArea / 10) : 0;

        const details: { label: string; value: string }[] = [
          { label: "Floor Area", value: `${formatNumber(floorArea)} sq ft` },
        ];

        if (wallArea > 0) {
          details.push({ label: "Wall Area", value: `${formatNumber(wallArea)} sq ft` });
        }

        details.push(
          { label: "Total Area", value: `${formatNumber(totalArea)} sq ft` },
          { label: "With 15% Overlap", value: `${formatNumber(adjustedArea, 0)} sq ft` },
          { label: "Poly Thickness", value: `${thickness} mil` },
          { label: "Roll Size", value: `${rollWidth}' x ${rollLength}' (${formatNumber(rollSqFt)} sq ft)` },
          { label: "Rolls Needed", value: formatNumber(rollsNeeded) },
          { label: "Seam Tape Rolls", value: formatNumber(tapeRolls) },
        );

        if (fasteners > 0) {
          details.push({ label: "Fasteners/Stakes", value: formatNumber(fasteners) });
        }

        if (costPerRoll) {
          const polyCost = rollsNeeded * costPerRoll;
          const tapeCost = tapeRolls * 12;
          const totalCost = polyCost + tapeCost;
          details.push({ label: "Poly Sheeting Cost", value: `$${formatNumber(polyCost, 2)}` });
          details.push({ label: "Tape Cost", value: `$${formatNumber(tapeCost, 2)}` });
          details.push({ label: "Estimated Total", value: `$${formatNumber(totalCost, 2)}` });
        }

        return {
          primary: { label: "Vapor Barrier Rolls", value: `${formatNumber(rollsNeeded)} rolls (${thickness} mil)` },
          details,
          note: "Overlap all seams by at least 12 inches and seal with manufacturer-approved tape. For crawl spaces, extend poly up walls and attach with fasteners. Under slabs, use minimum 10 mil poly.",
        };
      },
    },
  ],
  relatedSlugs: ["house-wrap-calc-calculator", "insulation-calculator", "concrete-calculator"],
  faq: [
    { question: "How thick should a vapor barrier be?", answer: "Use 6 mil poly for basic wall applications, 10 mil under concrete slabs, and 12-20 mil for crawl space encapsulation. Thicker barriers are more puncture-resistant and durable." },
    { question: "Do I need a vapor barrier in my crawl space?", answer: "Yes, building codes in most regions require a vapor barrier on exposed earth in crawl spaces. A minimum 6 mil polyethylene sheet reduces moisture, prevents mold, and improves indoor air quality." },
    { question: "How much overlap for vapor barrier seams?", answer: "Overlap vapor barrier seams by at least 12 inches. Seal all seams with vapor barrier tape or butyl tape. For crawl spaces, extend the barrier up foundation walls at least 6 inches." },
  ],
  formula: "Rolls = (Total Area x 1.15 overlap) / Roll Coverage (sq ft)",
};
