import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const railroadTieCalcCalculator: CalculatorDefinition = {
  slug: "railroad-tie-calc-calculator",
  title: "Railroad Tie Calculator",
  description: "Free railroad tie calculator. Estimate how many railroad ties or landscape timbers you need for retaining walls, garden borders, raised beds, and steps.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["railroad tie calculator", "landscape timber calculator", "how many railroad ties", "retaining wall timber calculator", "railroad tie retaining wall"],
  variants: [
    {
      id: "calc",
      name: "Calculate Railroad Ties Needed",
      description: "Estimate railroad ties for walls, borders, and raised beds",
      fields: [
        { name: "projectType", label: "Project Type", type: "select", options: [{ label: "Retaining Wall", value: "wall" }, { label: "Raised Garden Bed", value: "bed" }, { label: "Border/Edging (single row)", value: "border" }, { label: "Steps/Stairs", value: "steps" }], defaultValue: "wall" },
        { name: "length", label: "Total Length (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "height", label: "Height / Courses (for walls)", type: "number", placeholder: "e.g. 3", defaultValue: 1 },
        { name: "timberType", label: "Timber Type", type: "select", options: [{ label: "Standard Railroad Tie (7\" x 9\" x 8.5')", value: "rr" }, { label: "Landscape Timber (4\" x 6\" x 8')", value: "lt" }], defaultValue: "rr" },
        { name: "costPerTie", label: "Cost per Tie/Timber (optional)", type: "number", placeholder: "e.g. 25", prefix: "$" },
      ],
      calculate: (inputs) => {
        const projectType = (inputs.projectType as string) || "wall";
        const length = inputs.length as number;
        const height = (inputs.height as number) || 1;
        const timberType = (inputs.timberType as string) || "rr";
        const costPerTie = inputs.costPerTie as number;
        if (!length) return null;

        const tieLength = timberType === "rr" ? 8.5 : 8;
        const tieHeight = timberType === "rr" ? 7 : 4;
        const tieDepth = timberType === "rr" ? 9 : 6;
        const tieLabel = timberType === "rr" ? "Railroad Tie" : "Landscape Timber";

        let courses = 1;
        let totalLengthNeeded = length;

        if (projectType === "wall") {
          courses = height;
          totalLengthNeeded = length * courses;
        } else if (projectType === "bed") {
          // Raised bed: 2 lengths + 2 widths for each course
          // We'll treat "length" as perimeter for simplicity
          courses = height;
          totalLengthNeeded = length * courses;
        } else if (projectType === "border") {
          courses = 1;
          totalLengthNeeded = length;
        } else if (projectType === "steps") {
          courses = height;
          totalLengthNeeded = length * courses;
        }

        const tiesNeeded = Math.ceil(totalLengthNeeded / tieLength);
        const tiesWithWaste = Math.ceil(tiesNeeded * 1.10);

        // Rebar: 2 pieces per tie for stacking
        const rebarPieces = courses > 1 ? tiesNeeded * 2 : 0;

        // Spikes: 2 per tie connection (12" galvanized)
        const spikes = courses > 1 ? tiesNeeded * 2 : 0;

        // Gravel backfill for retaining walls
        const gravelTons = projectType === "wall" ? (length * height * 1 * 95) / 2000 : 0;

        const details: { label: string; value: string }[] = [
          { label: "Project Type", value: projectType.charAt(0).toUpperCase() + projectType.slice(1) },
          { label: "Timber Type", value: `${tieLabel} (${tieHeight}\" x ${tieDepth}\" x ${tieLength}')` },
          { label: "Total Length", value: `${formatNumber(length)} feet` },
          { label: "Courses", value: formatNumber(courses) },
          { label: "Ties Needed (exact)", value: formatNumber(tiesNeeded) },
          { label: "Ties with 10% Extra", value: formatNumber(tiesWithWaste) },
        ];

        if (rebarPieces > 0) {
          details.push({ label: "Rebar Pins (24\")", value: formatNumber(rebarPieces) });
          details.push({ label: "Landscape Spikes (12\")", value: formatNumber(spikes) });
        }

        if (gravelTons > 0) {
          details.push({ label: "Gravel Backfill", value: `${formatNumber(gravelTons, 2)} tons` });
        }

        if (costPerTie) {
          const tieCost = tiesWithWaste * costPerTie;
          const hardwareCost = rebarPieces * 3 + spikes * 1.5;
          const totalCost = tieCost + hardwareCost;
          details.push({ label: "Tie/Timber Cost", value: `$${formatNumber(tieCost, 2)}` });
          if (hardwareCost > 0) {
            details.push({ label: "Hardware Cost", value: `$${formatNumber(hardwareCost, 2)}` });
          }
          details.push({ label: "Estimated Total", value: `$${formatNumber(totalCost, 2)}` });
        }

        return {
          primary: { label: `${tieLabel}s Needed`, value: `${formatNumber(tiesWithWaste)} ties` },
          details,
          note: "Stacked courses should be staggered like bricks and pinned with 24\" rebar driven through pre-drilled holes. Retaining walls over 3 courses may need deadman anchors. Includes 10% extra.",
        };
      },
    },
  ],
  relatedSlugs: ["stone-wall-calculator", "cinder-block-wall-calculator", "landscape-border-calculator"],
  faq: [
    { question: "How long is a standard railroad tie?", answer: "A standard railroad tie is 8.5 feet long, 7 inches tall, and 9 inches wide. Landscape timbers are typically 8 feet long, 4 inches tall, and 6 inches wide. Both can be cut with a chainsaw." },
    { question: "How many courses of railroad ties can I stack?", answer: "For a DIY retaining wall, limit railroad tie walls to 3-4 courses (about 2-3 feet). Higher walls require engineering, deadman anchors, and proper drainage. Check local building codes." },
    { question: "Are railroad ties safe for garden use?", answer: "Traditional creosote-treated railroad ties are not recommended for vegetable gardens due to chemical leaching. Use untreated landscape timbers or cedar for raised garden beds where food will be grown." },
  ],
  formula: "Ties = Total Length (ft) x Number of Courses / Tie Length (ft) x 1.10 waste factor",
};
