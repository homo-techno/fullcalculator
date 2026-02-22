import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const drawerSlideCalculator: CalculatorDefinition = {
  slug: "drawer-slide-calculator",
  title: "Drawer Slide Length Calculator",
  description: "Free drawer slide length calculator. Determine the correct slide length and drawer box dimensions for your cabinet opening.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["drawer slide calculator", "drawer slide length", "drawer box dimensions", "cabinet drawer calculator", "slide mounting"],
  variants: [
    {
      id: "side-mount",
      name: "Side Mount Drawer Slides",
      description: "Calculate drawer dimensions for side-mount slides",
      fields: [
        { name: "cabinetDepth", label: "Cabinet Interior Depth (inches)", type: "number", placeholder: "e.g. 22" },
        { name: "openingWidth", label: "Cabinet Opening Width (inches)", type: "number", placeholder: "e.g. 15" },
        { name: "openingHeight", label: "Cabinet Opening Height (inches)", type: "number", placeholder: "e.g. 6" },
        {
          name: "slideType",
          label: "Slide Type",
          type: "select",
          options: [
            { label: "Side Mount (1/2 inch clearance each side)", value: "0.5" },
            { label: "Center Mount", value: "0" },
            { label: "Under Mount (3/8 inch clearance each side)", value: "0.375" },
          ],
        },
        {
          name: "extension",
          label: "Extension Type",
          type: "select",
          options: [
            { label: "3/4 Extension", value: "0.75" },
            { label: "Full Extension", value: "1.0" },
            { label: "Over-Travel", value: "1.1" },
          ],
        },
      ],
      calculate: (inputs) => {
        const cabinetDepth = inputs.cabinetDepth as number;
        const openingWidth = inputs.openingWidth as number;
        const openingHeight = inputs.openingHeight as number;
        const sideGap = parseFloat(inputs.slideType as string);
        const extensionFactor = parseFloat(inputs.extension as string);
        if (!cabinetDepth || !openingWidth || !openingHeight) return null;
        const drawerWidth = openingWidth - (2 * sideGap);
        const drawerHeight = openingHeight - 0.5;
        const slideLength = Math.floor(cabinetDepth / 2) * 2;
        const drawerDepth = slideLength - 1;
        const maxExtension = slideLength * extensionFactor;
        const availableSlideLengths = [10, 12, 14, 16, 18, 20, 22, 24, 28];
        const bestSlide = availableSlideLengths.reduce((prev, curr) =>
          Math.abs(curr - cabinetDepth) < Math.abs(prev - cabinetDepth) && curr <= cabinetDepth ? curr : prev
        );
        return {
          primary: { label: "Recommended Slide Length", value: `${formatNumber(bestSlide, 0)} inches` },
          details: [
            { label: "Drawer Box Width", value: `${formatNumber(drawerWidth, 3)} inches` },
            { label: "Drawer Box Height", value: `${formatNumber(drawerHeight, 3)} inches` },
            { label: "Drawer Box Depth", value: `${formatNumber(drawerDepth, 0)} inches` },
            { label: "Side Clearance (each)", value: `${formatNumber(sideGap, 3)} inches` },
            { label: "Max Extension", value: `${formatNumber(maxExtension, 1)} inches` },
            { label: "Cabinet Depth", value: `${formatNumber(cabinetDepth, 1)} inches` },
            { label: "Opening Width", value: `${formatNumber(openingWidth, 1)} inches` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cabinet-door-size-calculator", "shelf-sag-calculator", "cutting-diagram-calculator"],
  faq: [
    { question: "How do I measure for drawer slides?", answer: "Measure the interior depth of the cabinet from the face frame (or front edge) to the back wall. Choose a slide length equal to or slightly shorter than this depth." },
    { question: "How much clearance do side mount slides need?", answer: "Most side-mount slides require 1/2 inch clearance on each side, so the drawer box should be 1 inch narrower than the opening width." },
  ],
  formula: "Drawer Width = Opening Width - 2 x Side Clearance | Slide Length <= Cabinet Depth (nearest even inch)",
};
