import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const studSpacingCalculator: CalculatorDefinition = {
  slug: "stud-spacing-calculator",
  title: "Stud Spacing Calculator",
  description: "Free stud spacing calculator. Calculate how many wall studs you need based on wall length, spacing (16\" or 24\" on center), and openings.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["stud spacing calculator", "stud calculator", "how many studs do I need", "wall framing calculator", "16 on center calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Studs Needed",
      description: "Calculate number of wall studs for your framing project",
      fields: [
        { name: "wallLength", label: "Wall Length (ft)", type: "number", placeholder: "e.g. 20" },
        { name: "spacing", label: "Stud Spacing", type: "select", options: [
          { label: "16\" on center (standard)", value: "16" },
          { label: "24\" on center", value: "24" },
        ], defaultValue: "16" },
        { name: "windows", label: "Number of Windows", type: "number", placeholder: "e.g. 1", defaultValue: 0 },
        { name: "doors", label: "Number of Doors", type: "number", placeholder: "e.g. 1", defaultValue: 0 },
        { name: "corners", label: "Number of Corners", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
      ],
      calculate: (inputs) => {
        const wallLength = inputs.wallLength as number;
        const spacing = parseInt(inputs.spacing as string) || 16;
        const windows = (inputs.windows as number) || 0;
        const doors = (inputs.doors as number) || 0;
        const corners = (inputs.corners as number) || 2;
        if (!wallLength) return null;

        const wallLengthInches = wallLength * 12;
        // Main studs: wall length / spacing + 1
        const mainStuds = Math.ceil(wallLengthInches / spacing) + 1;
        // Corner studs: 2 extra per corner for proper nailing
        const cornerStuds = corners * 2;
        // Window studs: 2 jack studs + 2 king studs + 1 header + 2 cripples (typical)
        const windowStuds = windows * 7;
        // Door studs: 2 jack studs + 2 king studs
        const doorStuds = doors * 4;
        // Top and bottom plates: 2 plates top + 1 bottom (in linear feet)
        const plateCount = 3; // top double plate + bottom plate
        const plateLengthFt = plateCount * wallLength;

        const totalStuds = mainStuds + cornerStuds + windowStuds + doorStuds;

        return {
          primary: { label: "Total Studs Needed", value: `${totalStuds} studs` },
          details: [
            { label: "Wall length", value: `${wallLength} ft` },
            { label: "Spacing", value: `${spacing}" on center` },
            { label: "Regular studs", value: `${mainStuds}` },
            { label: "Corner studs", value: `${cornerStuds} (${corners} corners x 2)` },
            { label: "Window framing studs", value: `${windowStuds} (${windows} windows)` },
            { label: "Door framing studs", value: `${doorStuds} (${doors} doors)` },
            { label: "Plates needed", value: `${formatNumber(plateLengthFt)} linear ft (3 plates)` },
          ],
          note: "Includes king studs, jack studs, and cripples for openings. Standard walls use 16\" OC spacing. Non-load-bearing walls can use 24\" OC. Plates are typically double top plate and single bottom plate.",
        };
      },
    },
  ],
  relatedSlugs: ["lumber-calculator", "drywall-calculator", "beam-size-calculator"],
  faq: [
    { question: "How many studs do I need for a wall?", answer: "For a wall at 16\" on center: divide the wall length in inches by 16 and add 1. Then add extra studs for corners (2 per corner), windows (7 per window for king, jack, header, and cripple studs), and doors (4 per door)." },
    { question: "What is 16 on center?", answer: "16\" on center (16\" OC) means the center of each stud is 16 inches apart from the center of the next stud. This is the standard spacing for load-bearing walls and most residential construction." },
    { question: "When can I use 24 on center?", answer: "24\" on center spacing is acceptable for non-load-bearing interior partition walls. Some building codes allow 24\" OC for exterior walls with certain engineering requirements. Always check local building codes." },
  ],
  formula: "Studs = (Wall Length in inches / Spacing) + 1 + Corner Studs + Opening Studs",
};
