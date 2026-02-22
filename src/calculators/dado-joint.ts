import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dadoJointCalculator: CalculatorDefinition = {
  slug: "dado-joint-calculator",
  title: "Dado Joint Calculator",
  description: "Free dado joint calculator. Calculate dado width, depth, and router bit passes needed for shelving and cabinet construction.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dado joint calculator", "dado width calculator", "groove joint", "rabbet calculator", "shelf dado calculator"],
  variants: [
    {
      id: "standard-dado",
      name: "Standard Dado Joint",
      description: "Calculate dado dimensions for shelving",
      fields: [
        { name: "shelfThickness", label: "Shelf Material Thickness (inches)", type: "number", placeholder: "e.g. 0.75" },
        { name: "sideThickness", label: "Side Panel Thickness (inches)", type: "number", placeholder: "e.g. 0.75" },
        {
          name: "dadoType",
          label: "Dado Type",
          type: "select",
          options: [
            { label: "Through Dado", value: "through" },
            { label: "Stopped (Blind) Dado", value: "stopped" },
            { label: "Rabbet", value: "rabbet" },
          ],
        },
        {
          name: "routerBit",
          label: "Router Bit Diameter",
          type: "select",
          options: [
            { label: "1/4 inch", value: "0.25" },
            { label: "3/8 inch", value: "0.375" },
            { label: "1/2 inch", value: "0.5" },
            { label: "3/4 inch", value: "0.75" },
          ],
        },
        { name: "panelWidth", label: "Side Panel Width (inches)", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const shelfThickness = inputs.shelfThickness as number;
        const sideThickness = inputs.sideThickness as number;
        const dadoType = inputs.dadoType as string;
        const routerBitDia = parseFloat(inputs.routerBit as string);
        const panelWidth = inputs.panelWidth as number;
        if (!shelfThickness || !sideThickness || !routerBitDia) return null;
        const dadoWidth = shelfThickness;
        const dadoDepth = sideThickness / 3;
        const numPasses = Math.ceil(dadoWidth / routerBitDia);
        const actualWidth = numPasses * routerBitDia;
        const widthDiff = actualWidth - dadoWidth;
        const stoppedLength = dadoType === "stopped" && panelWidth ? panelWidth - 1 : panelWidth || 0;
        const notchSize = dadoType === "stopped" ? 1 : 0;
        const remainingThickness = sideThickness - dadoDepth;
        const glueArea = panelWidth ? dadoWidth * (panelWidth || 12) : dadoWidth * 12;
        return {
          primary: { label: "Dado Width", value: `${formatNumber(dadoWidth, 3)} inches` },
          details: [
            { label: "Dado Depth", value: `${formatNumber(dadoDepth, 3)} inches` },
            { label: "Router Passes Needed", value: formatNumber(numPasses, 0) },
            { label: "Router Bit Diameter", value: `${formatNumber(routerBitDia, 3)} inches` },
            { label: "Width After Passes", value: `${formatNumber(actualWidth, 3)} inches` },
            { label: "Width Difference", value: `${formatNumber(widthDiff, 4)} inches` },
            { label: "Remaining Panel Thickness", value: `${formatNumber(remainingThickness, 3)} inches` },
            { label: "Dado Type", value: dadoType === "through" ? "Through" : dadoType === "stopped" ? "Stopped (Blind)" : "Rabbet" },
            { label: "Stopped Length", value: dadoType === "stopped" ? `${formatNumber(stoppedLength, 1)} inches` : "N/A" },
            { label: "Notch Size", value: dadoType === "stopped" ? `${formatNumber(notchSize, 1)} inches` : "N/A" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dovetail-joint-calculator", "tenon-size-calculator", "router-bit-speed-calculator"],
  faq: [
    { question: "How deep should a dado be?", answer: "A dado should typically be 1/3 the thickness of the material it is cut into. For 3/4 inch plywood, the dado should be about 1/4 inch deep." },
    { question: "Why is plywood not exactly 3/4 inch?", answer: "Modern plywood is often slightly undersized (23/32 inch). Use a router with a straight bit and guide for a perfect-fitting dado rather than a 3/4 inch dado blade." },
  ],
  formula: "Dado Width = Shelf Thickness | Dado Depth = Panel Thickness / 3 | Passes = ceil(Width / Bit Diameter)",
};
