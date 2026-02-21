import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const windowBlindCalculator: CalculatorDefinition = {
  slug: "window-blind-calculator",
  title: "Window Blind Calculator",
  description:
    "Free window blind calculator. Determine the right blind size for inside or outside mount installations.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["window blind", "blinds", "shades", "window covering", "mount"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "windowWidth",
          label: "Window Width (inches)",
          type: "number",
          placeholder: "e.g. 36",
        },
        {
          name: "windowHeight",
          label: "Window Height (inches)",
          type: "number",
          placeholder: "e.g. 48",
        },
        {
          name: "mountType",
          label: "Mount Type",
          type: "select",
          options: [
            { label: "Inside Mount", value: "inside" },
            { label: "Outside Mount", value: "outside" },
          ],
        },
      ],
      calculate: (inputs) => {
        const windowWidth = inputs.windowWidth as number;
        const windowHeight = inputs.windowHeight as number;
        const mountType = inputs.mountType as string;
        if (!windowWidth || !windowHeight || !mountType) return null;

        let blindWidth: number;
        let blindHeight: number;
        let notes: string;

        if (mountType === "inside") {
          // Inside mount: deduct 1/4" from width for clearance
          blindWidth = windowWidth - 0.25;
          blindHeight = windowHeight;
          notes = "Deducted 1/4\" from width for inside mount clearance.";
        } else {
          // Outside mount: add 3" each side for width, 3" top, 1" bottom
          blindWidth = windowWidth + 6;
          blindHeight = windowHeight + 4;
          notes = "Added 3\" each side for width overlap and 4\" for height (3\" top, 1\" bottom).";
        }

        return {
          primary: {
            label: "Blind Size to Order",
            value: formatNumber(blindWidth, 2) + '" W × ' + formatNumber(blindHeight, 2) + '" H',
          },
          details: [
            { label: "Window Opening", value: windowWidth + '" × ' + windowHeight + '"' },
            { label: "Mount Type", value: mountType === "inside" ? "Inside Mount" : "Outside Mount" },
            { label: "Blind Width", value: formatNumber(blindWidth, 2) + '"' },
            { label: "Blind Height", value: formatNumber(blindHeight, 2) + '"' },
            { label: "Notes", value: notes },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["curtain-calculator", "square-footage-calculator"],
  faq: [
    {
      question: "What is the difference between inside and outside mount?",
      answer:
        "Inside mount fits within the window frame for a clean look. Outside mount extends beyond the frame, covering more light and making windows appear larger.",
    },
    {
      question: "How much overlap for outside mount blinds?",
      answer:
        "Add 3 inches on each side of the window width and 3-4 inches above the opening for proper coverage and light blocking.",
    },
  ],
  formula:
    "Inside Mount: Width = Window Width − 0.25\". Outside Mount: Width = Window Width + 6\", Height = Window Height + 4\".",
};
