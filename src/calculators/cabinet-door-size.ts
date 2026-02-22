import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cabinetDoorSizeCalculator: CalculatorDefinition = {
  slug: "cabinet-door-size-calculator",
  title: "Cabinet Door Size Calculator",
  description: "Free cabinet door size calculator. Calculate door dimensions based on opening size, overlay type, and hinge requirements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cabinet door size calculator", "door overlay calculator", "cabinet door dimensions", "hinge overlay calculator", "cabinet door fitting"],
  variants: [
    {
      id: "overlay-door",
      name: "Overlay Door Size",
      description: "Calculate door size for overlay cabinet doors",
      fields: [
        { name: "openingWidth", label: "Opening Width (inches)", type: "number", placeholder: "e.g. 15" },
        { name: "openingHeight", label: "Opening Height (inches)", type: "number", placeholder: "e.g. 30" },
        {
          name: "overlayType",
          label: "Overlay Type",
          type: "select",
          options: [
            { label: "Full Overlay (covers frame)", value: "full" },
            { label: "Half Overlay (1/2 inch reveal)", value: "half" },
            { label: "Inset (flush with frame)", value: "inset" },
          ],
        },
        { name: "frameWidth", label: "Face Frame Width (inches)", type: "number", placeholder: "e.g. 1.5" },
        { name: "gap", label: "Gap Between Doors (inches)", type: "number", placeholder: "e.g. 0.125" },
        {
          name: "numDoors",
          label: "Number of Doors per Opening",
          type: "select",
          options: [
            { label: "Single Door", value: "1" },
            { label: "Double Doors (pair)", value: "2" },
          ],
        },
      ],
      calculate: (inputs) => {
        const openingWidth = inputs.openingWidth as number;
        const openingHeight = inputs.openingHeight as number;
        const overlayType = inputs.overlayType as string;
        const frameWidth = inputs.frameWidth as number;
        const gap = inputs.gap as number;
        const numDoors = parseInt(inputs.numDoors as string);
        if (!openingWidth || !openingHeight || !frameWidth) return null;
        const gapSize = gap || 0.125;
        let doorWidth: number;
        let doorHeight: number;
        let overlayAmount: number;
        if (overlayType === "full") {
          overlayAmount = frameWidth - 0.125;
          doorHeight = openingHeight + 2 * overlayAmount;
          if (numDoors === 1) {
            doorWidth = openingWidth + 2 * overlayAmount;
          } else {
            doorWidth = (openingWidth + 2 * overlayAmount - gapSize) / 2;
          }
        } else if (overlayType === "half") {
          overlayAmount = frameWidth / 2;
          doorHeight = openingHeight + 2 * overlayAmount;
          if (numDoors === 1) {
            doorWidth = openingWidth + 2 * overlayAmount;
          } else {
            doorWidth = (openingWidth + 2 * overlayAmount - gapSize) / 2;
          }
        } else {
          overlayAmount = 0;
          doorHeight = openingHeight - 2 * gapSize;
          if (numDoors === 1) {
            doorWidth = openingWidth - 2 * gapSize;
          } else {
            doorWidth = (openingWidth - 3 * gapSize) / 2;
          }
        }
        const hingeBoringDistance = 3;
        return {
          primary: { label: "Door Width", value: `${formatNumber(doorWidth, 3)} inches` },
          details: [
            { label: "Door Height", value: `${formatNumber(doorHeight, 3)} inches` },
            { label: "Overlay Amount", value: `${formatNumber(overlayAmount, 3)} inches` },
            { label: "Gap Between Doors", value: `${formatNumber(gapSize, 3)} inches` },
            { label: "Number of Doors", value: formatNumber(numDoors, 0) },
            { label: "Opening Width", value: `${formatNumber(openingWidth, 2)} inches` },
            { label: "Opening Height", value: `${formatNumber(openingHeight, 2)} inches` },
            { label: "Face Frame Width", value: `${formatNumber(frameWidth, 2)} inches` },
            { label: "Hinge Boring (from edge)", value: `${formatNumber(hingeBoringDistance, 1)} inches` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["drawer-slide-calculator", "shelf-sag-calculator", "cutting-diagram-calculator"],
  faq: [
    { question: "What is full overlay?", answer: "Full overlay doors cover most of the face frame, leaving only about 1/8 inch of frame visible between doors. This creates a modern, clean look with maximum storage access." },
    { question: "What gap should I leave between doors?", answer: "Standard gap between doors is 1/8 inch (3mm). This allows doors to open and close without rubbing. Inset doors also need a 1/8 inch gap around all edges." },
  ],
  formula: "Full Overlay: Door = Opening + 2 x (Frame - 1/8) | Half Overlay: Door = Opening + Frame | Inset: Door = Opening - 2 x Gap",
};
