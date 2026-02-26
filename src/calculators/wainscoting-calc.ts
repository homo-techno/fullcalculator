import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wainscotingCalculator: CalculatorDefinition = {
  slug: "wainscoting-calc",
  title: "Wainscoting Material Calculator",
  description:
    "Free online wainscoting calculator. Estimate panels, rails, stiles, and trim needed for your wainscoting project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "wainscoting",
    "panel",
    "trim",
    "wall",
    "chair rail",
    "baseboard",
    "moulding",
  ],
  variants: [
    {
      id: "raised-panel",
      name: "Raised Panel Wainscoting",
      description: "Calculate materials for raised panel wainscoting",
      fields: [
        {
          name: "wallLength",
          label: "Total Wall Length",
          type: "number",
          placeholder: "e.g. 40",
          suffix: "ft",
        },
        {
          name: "wainscotHeight",
          label: "Wainscoting Height",
          type: "number",
          placeholder: "e.g. 36",
          suffix: "in",
        },
        {
          name: "panelWidth",
          label: "Panel Width",
          type: "number",
          placeholder: "e.g. 16",
          suffix: "in",
        },
        {
          name: "stileWidth",
          label: "Stile Width",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "in",
        },
        {
          name: "numDoors",
          label: "Number of Doors/Windows to Subtract",
          type: "number",
          placeholder: "e.g. 2",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const wallLength = parseFloat(inputs.wallLength as string) || 0;
        const wainscotHeight = parseFloat(inputs.wainscotHeight as string) || 36;
        const panelWidth = parseFloat(inputs.panelWidth as string) || 16;
        const stileWidth = parseFloat(inputs.stileWidth as string) || 3;
        const numDoors = parseFloat(inputs.numDoors as string) || 0;

        if (wallLength <= 0) return null;

        const wallLengthIn = wallLength * 12;
        // Subtract ~36 in per door/window opening
        const effectiveLengthIn = wallLengthIn - numDoors * 36;
        const panelRepeat = panelWidth + stileWidth; // one panel + one stile
        const numPanels = Math.ceil(effectiveLengthIn / panelRepeat);
        const numStiles = numPanels + 1; // one stile between each panel + ends
        const chairRailFt = wallLength;
        const baseboardFt = wallLength;
        const capRailFt = wallLength;
        const heightFt = wainscotHeight / 12;
        const totalAreaSqFt = wallLength * heightFt;

        // MDF/plywood sheets (4x8) for panel backing
        const sheetsNeeded = Math.ceil(totalAreaSqFt / 32);

        return {
          primary: {
            label: "Panels Needed",
            value: formatNumber(numPanels) + " panels",
          },
          details: [
            { label: "Stiles needed", value: formatNumber(numStiles) },
            { label: "Chair rail", value: formatNumber(chairRailFt) + " ft" },
            { label: "Baseboard trim", value: formatNumber(baseboardFt) + " ft" },
            { label: "Cap rail", value: formatNumber(capRailFt) + " ft" },
            { label: "Backer sheets (4x8)", value: formatNumber(sheetsNeeded) },
            { label: "Total wall area covered", value: formatNumber(totalAreaSqFt) + " sq ft" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["shiplap-calc", "board-batten-calc", "plywood-calc"],
  faq: [
    {
      question: "What is the standard height for wainscoting?",
      answer:
        "Standard wainscoting height is 32-36 inches (about one-third of a standard 8-foot wall). In rooms with higher ceilings, wainscoting can go up to 48 inches or higher.",
    },
    {
      question: "How do I plan panel spacing for wainscoting?",
      answer:
        "Divide the wall length by your desired panel width plus stile width to get the number of panels. Adjust panel width slightly to achieve even spacing. Each panel section includes one panel and one stile.",
    },
  ],
  formula:
    "Panels = ceil((WallLength × 12 - Doors × 36) / (PanelWidth + StileWidth)); Stiles = Panels + 1",
};
