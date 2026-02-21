import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const curtainFabricCalculator: CalculatorDefinition = {
  slug: "curtain-fabric-calculator",
  title: "Curtain Fabric Calculator",
  description: "Free curtain fabric calculator. Calculate how much fabric you need for curtains and drapes based on window measurements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["curtain fabric calculator", "curtain yardage calculator", "how much fabric for curtains", "drape fabric calculator", "curtain measurement"],
  variants: [
    {
      id: "standard-curtain",
      name: "Standard Curtain Panels",
      description: "Calculate fabric for standard curtain panels",
      fields: [
        { name: "windowWidth", label: "Window/Rod Width", type: "number", placeholder: "e.g. 60", suffix: "in", step: 1 },
        { name: "curtainLength", label: "Curtain Length (rod to desired end)", type: "number", placeholder: "e.g. 84", suffix: "in", step: 1 },
        { name: "fullness", label: "Fullness / Gathering", type: "select", options: [
          { label: "Flat / minimal (1.5x width)", value: "1.5" },
          { label: "Standard fullness (2x width)", value: "2" },
          { label: "Luxurious fullness (2.5x width)", value: "2.5" },
          { label: "Sheer curtains (3x width)", value: "3" },
        ], defaultValue: "2" },
        { name: "headerStyle", label: "Header / Hanging Style", type: "select", options: [
          { label: "Rod pocket", value: "pocket" },
          { label: "Tab top", value: "tab" },
          { label: "Grommet / eyelet", value: "grommet" },
          { label: "Pinch pleat", value: "pleat" },
        ], defaultValue: "pocket" },
        { name: "hemAllowance", label: "Hem Allowance", type: "select", options: [
          { label: "Standard (4 in top + 4 in bottom)", value: "8" },
          { label: "Generous (6 in top + 6 in bottom)", value: "12" },
        ], defaultValue: "8" },
        { name: "fabricWidth", label: "Fabric Width", type: "select", options: [
          { label: "45 inches (115 cm)", value: "45" },
          { label: "54 inches (137 cm)", value: "54" },
          { label: "60 inches (150 cm)", value: "60" },
          { label: "108 inches (274 cm) — wide width", value: "108" },
        ], defaultValue: "54" },
      ],
      calculate: (inputs) => {
        const windowWidth = inputs.windowWidth as number;
        const curtainLength = inputs.curtainLength as number;
        const fullness = parseFloat(inputs.fullness as string);
        const headerStyle = inputs.headerStyle as string;
        const hemAllowance = parseInt(inputs.hemAllowance as string);
        const fabricWidth = parseInt(inputs.fabricWidth as string);
        if (!windowWidth || !curtainLength) return null;

        // Total width needed (both panels combined)
        const totalWidthNeeded = windowWidth * fullness;

        // Number of fabric widths needed
        const usableFabricWidth = fabricWidth - 4; // side hems
        const panelsOfFabric = Math.ceil(totalWidthNeeded / usableFabricWidth);

        // Cut length per panel
        const cutLength = curtainLength + hemAllowance;

        // Total yardage
        const totalInches = panelsOfFabric * cutLength;
        const totalYards = totalInches / 36;
        const roundedYards = Math.ceil(totalYards * 4) / 4;

        // Lining (if desired)
        const liningYards = Math.ceil((panelsOfFabric * (curtainLength + 4)) / 36 * 4) / 4;

        return {
          primary: { label: "Fabric Needed", value: formatNumber(roundedYards, 2), suffix: "yards" },
          details: [
            { label: "In Meters", value: formatNumber(roundedYards * 0.9144, 2) },
            { label: "Total Width (gathered)", value: `${formatNumber(totalWidthNeeded, 0)} inches` },
            { label: "Fabric Widths/Panels", value: `${panelsOfFabric} panels` },
            { label: "Cut Length Each", value: `${cutLength} inches` },
            { label: "Header Style", value: headerStyle.charAt(0).toUpperCase() + headerStyle.slice(1) },
            { label: "Lining (if needed)", value: `~${formatNumber(liningYards, 2)} yards` },
          ],
          note: "For patterned fabric, add one pattern repeat per panel for matching. Mount curtain rods 4-6 inches above the window frame for a taller look.",
        };
      },
    },
    {
      id: "multiple-windows",
      name: "Multiple Windows",
      description: "Calculate fabric for multiple windows of the same size",
      fields: [
        { name: "windowWidth", label: "Each Window/Rod Width", type: "number", placeholder: "e.g. 48", suffix: "in", step: 1 },
        { name: "curtainLength", label: "Curtain Length", type: "number", placeholder: "e.g. 84", suffix: "in", step: 1 },
        { name: "numWindows", label: "Number of Windows", type: "number", placeholder: "e.g. 3", min: 1, max: 20, defaultValue: 2 },
        { name: "fullness", label: "Fullness", type: "select", options: [
          { label: "Standard (2x width)", value: "2" },
          { label: "Full (2.5x width)", value: "2.5" },
        ], defaultValue: "2" },
        { name: "fabricWidth", label: "Fabric Width", type: "select", options: [
          { label: "54 inches", value: "54" },
          { label: "60 inches", value: "60" },
        ], defaultValue: "54" },
      ],
      calculate: (inputs) => {
        const windowWidth = inputs.windowWidth as number;
        const curtainLength = inputs.curtainLength as number;
        const numWindows = inputs.numWindows as number;
        const fullness = parseFloat(inputs.fullness as string);
        const fabricWidth = parseInt(inputs.fabricWidth as string);
        if (!windowWidth || !curtainLength || !numWindows) return null;

        const widthPerWindow = windowWidth * fullness;
        const usableFabricWidth = fabricWidth - 4;
        const panelsPerWindow = Math.ceil(widthPerWindow / usableFabricWidth);
        const totalPanels = panelsPerWindow * numWindows;

        const cutLength = curtainLength + 8; // standard hem allowance
        const totalInches = totalPanels * cutLength;
        const totalYards = Math.ceil((totalInches / 36) * 4) / 4;

        return {
          primary: { label: "Total Fabric", value: formatNumber(totalYards, 2), suffix: "yards" },
          details: [
            { label: "In Meters", value: formatNumber(totalYards * 0.9144, 2) },
            { label: "Windows", value: `${numWindows}` },
            { label: "Panels Per Window", value: `${panelsPerWindow}` },
            { label: "Total Panels", value: `${totalPanels}` },
            { label: "Fabric Per Window", value: `${formatNumber(totalYards / numWindows, 2)} yards` },
          ],
          note: "Buy all fabric from the same bolt/dye lot for consistent color across windows.",
        };
      },
    },
  ],
  relatedSlugs: ["fabric-yardage-calculator", "tablecloth-size-calculator", "pillow-size-calculator"],
  faq: [
    { question: "How do I calculate fabric for curtains?", answer: "Multiply your window width by the fullness factor (usually 2x for standard gathering). Divide by usable fabric width to get the number of panels. Multiply panels by the cut length (finished length + hems). Convert total inches to yards." },
    { question: "What is curtain fullness?", answer: "Fullness is how much wider the fabric is than the window for gathering/pleating. 1.5x is flat/minimal, 2x is standard, 2.5x is luxurious, 3x is typical for sheers. Most curtains look best at 2-2.5x fullness." },
    { question: "How long should curtains be?", answer: "Sill length: to the window sill. Below sill: 4 inches below. Floor length: 1/2 inch above the floor. Puddle: 2-6 inches on the floor. Floor length is the most popular for living rooms and bedrooms." },
  ],
  formula: "Total fabric width = Window width × Fullness factor | Panels needed = Total width / Usable fabric width | Yardage = (Panels × Cut length) / 36",
};
