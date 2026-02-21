import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const curtainCalculator: CalculatorDefinition = {
  slug: "curtain-calculator",
  title: "Curtain Calculator",
  description:
    "Free curtain calculator. Estimate fabric needed and number of panels for your windows.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["curtain", "drapes", "fabric", "window treatment", "panels"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "windowWidth",
          label: "Window Width (inches)",
          type: "number",
          placeholder: "e.g. 48",
        },
        {
          name: "windowHeight",
          label: "Window Height (inches)",
          type: "number",
          placeholder: "e.g. 60",
        },
      ],
      calculate: (inputs) => {
        const windowWidth = inputs.windowWidth as number;
        const windowHeight = inputs.windowHeight as number;
        if (!windowWidth || !windowHeight) return null;

        const fullnessMultiplier = 2;
        const hemAllowance = 6; // inches for top and bottom hems
        const fabricWidth = windowWidth * fullnessMultiplier;
        const fabricHeight = windowHeight + hemAllowance;

        // Standard panel width is about 50 inches
        const panelWidth = 50;
        const panelsNeeded = Math.ceil(fabricWidth / panelWidth);

        const totalFabricInches = fabricHeight * panelsNeeded;
        const totalFabricYards = totalFabricInches / 36;

        return {
          primary: {
            label: "Panels Needed",
            value: String(panelsNeeded),
          },
          details: [
            { label: "Fabric Width (2× fullness)", value: formatNumber(fabricWidth, 0) + " inches" },
            { label: "Fabric Height (+ 6\" hems)", value: formatNumber(fabricHeight, 0) + " inches" },
            { label: "Panel Width (standard)", value: "50 inches" },
            { label: "Total Fabric Needed", value: formatNumber(totalFabricYards, 1) + " yards" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["window-blind-calculator", "square-footage-calculator"],
  faq: [
    {
      question: "Why multiply window width by 2?",
      answer:
        "A 2× fullness multiplier gives curtains a full, gathered look when closed. Use 1.5× for a flatter look or 2.5× for extra fullness.",
    },
    {
      question: "How much extra fabric for hems?",
      answer:
        "Add about 6 inches total for top and bottom hems. Some styles may need more for rod pockets or headers.",
    },
  ],
  formula:
    "Fabric Width = Window Width × 2. Fabric Height = Window Height + 6\". Panels = Fabric Width ÷ 50.",
};
