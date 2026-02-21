import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fabricConverter: CalculatorDefinition = {
  slug: "fabric-converter",
  title: "Fabric Calculator",
  description: "Free fabric calculator. Calculate yards of fabric needed for your project based on dimensions, fabric width, and pattern repeat allowance.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fabric", "yards", "sewing", "pattern", "textile", "yardage", "calculator"],
  variants: [
    {
      id: "convert",
      name: "Calculate Fabric Needed",
      fields: [
        { name: "projectWidth", label: "Project Width (inches)", type: "number", placeholder: "e.g. 50" },
        { name: "projectLength", label: "Project Length (inches)", type: "number", placeholder: "e.g. 72" },
        { name: "fabricWidth", label: "Fabric Width", type: "select", options: [
          { label: "45 inches", value: "45" },
          { label: "60 inches", value: "60" },
        ]},
        { name: "patternRepeat", label: "Pattern Repeat (inches, 0 if none)", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const projectWidth = inputs.projectWidth as number;
        const projectLength = inputs.projectLength as number;
        const fabricWidthStr = (inputs.fabricWidth as string) || "45";
        const patternRepeat = (inputs.patternRepeat as number) || 0;
        if (!projectWidth || !projectLength) return null;
        const fabricWidth = parseInt(fabricWidthStr, 10);
        // Number of fabric widths needed to cover the project width
        const widthPanels = Math.ceil(projectWidth / fabricWidth);
        // Length per panel
        let lengthPerPanel = projectLength;
        // Add pattern repeat allowance
        if (patternRepeat > 0) {
          const repeatsNeeded = Math.ceil(projectLength / patternRepeat);
          lengthPerPanel = repeatsNeeded * patternRepeat;
        }
        // Add 2 inches seam allowance per panel
        const lengthWithSeam = lengthPerPanel + 2;
        // Total length in inches
        const totalLengthInches = widthPanels * lengthWithSeam;
        // Convert to yards (1 yard = 36 inches)
        const totalYards = totalLengthInches / 36;
        // Round up to nearest quarter yard
        const roundedYards = Math.ceil(totalYards * 4) / 4;
        const totalFeet = totalLengthInches / 12;
        return {
          primary: { label: "Fabric Needed", value: `${formatNumber(roundedYards, 2)} yards` },
          details: [
            { label: "Project Dimensions", value: `${formatNumber(projectWidth, 1)} × ${formatNumber(projectLength, 1)} inches` },
            { label: "Fabric Width", value: `${fabricWidth} inches` },
            { label: "Number of Panels", value: String(widthPanels) },
            { label: "Length per Panel", value: `${formatNumber(lengthWithSeam, 1)} inches (incl. seam)` },
            { label: "Pattern Repeat Allowance", value: patternRepeat > 0 ? `${formatNumber(patternRepeat, 1)} inches` : "None" },
            { label: "Total Length (inches)", value: formatNumber(totalLengthInches, 1) },
            { label: "Total Length (feet)", value: formatNumber(totalFeet, 2) },
            { label: "Exact Yards", value: formatNumber(totalYards, 4) },
            { label: "Rounded Up (to nearest ¼ yd)", value: formatNumber(roundedYards, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["print-size-calculator", "paper-size-converter"],
  faq: [
    { question: "What is a standard fabric width?", answer: "Common fabric widths are 45 inches (quilting cotton, lightweight fabrics) and 60 inches (apparel fabrics, knits). Upholstery fabric is often 54 inches." },
    { question: "What is pattern repeat?", answer: "Pattern repeat is the distance before a printed or woven pattern starts over. You need extra fabric to match patterns across panels." },
  ],
  formula: "Panels = ceil(project width / fabric width). Length/panel = project length + pattern repeat adjustment + 2\" seam. Total yards = (panels × length per panel) / 36.",
};
