import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const closetOrganizerCostCalculator: CalculatorDefinition = {
  slug: "closet-organizer-cost-calculator",
  title: "Closet Organizer Cost Calculator",
  description: "Free closet organizer cost calculator. Estimate the cost of closet organization systems including shelving, drawers, and professional installation.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["closet organizer cost", "closet system cost", "closet organization price", "custom closet cost", "closet shelving cost"],
  variants: [
    {
      id: "closet",
      name: "Closet Organizer Cost",
      fields: [
        { name: "closetWidth", label: "Closet Width (feet)", type: "number", placeholder: "e.g. 6" },
        { name: "closetHeight", label: "Closet Height (feet)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "closetType", label: "Closet Type", type: "select", options: [
          { label: "Reach-in (standard)", value: "reachin" },
          { label: "Walk-in (small)", value: "walkin_sm" },
          { label: "Walk-in (large)", value: "walkin_lg" },
        ], defaultValue: "reachin" },
        { name: "systemType", label: "System Type", type: "select", options: [
          { label: "Wire shelving ($3-5/lin ft)", value: "wire" },
          { label: "Laminate/melamine ($10-20/lin ft)", value: "laminate" },
          { label: "Wood veneer ($20-40/lin ft)", value: "wood" },
          { label: "Custom built-in ($40-100/lin ft)", value: "custom" },
        ], defaultValue: "laminate" },
        { name: "installation", label: "Installation", type: "select", options: [
          { label: "DIY", value: "0" },
          { label: "Professional ($200-500)", value: "350" },
          { label: "Custom installer ($500-2000)", value: "1000" },
        ], defaultValue: "0" },
      ],
      calculate: (inputs) => {
        const closetWidth = inputs.closetWidth as number;
        const closetHeight = (inputs.closetHeight as number) || 8;
        const closetType = inputs.closetType as string;
        const systemType = inputs.systemType as string;
        const installCost = parseInt(inputs.installation as string) || 0;
        if (!closetWidth) return null;
        let linearFeet = closetWidth;
        if (closetType === "walkin_sm") linearFeet = closetWidth * 2.5;
        else if (closetType === "walkin_lg") linearFeet = closetWidth * 4;
        let costPerFt: number;
        let materialName: string;
        if (systemType === "wire") { costPerFt = 4; materialName = "Wire shelving"; }
        else if (systemType === "laminate") { costPerFt = 15; materialName = "Laminate/melamine"; }
        else if (systemType === "wood") { costPerFt = 30; materialName = "Wood veneer"; }
        else { costPerFt = 70; materialName = "Custom built-in"; }
        const materialCost = linearFeet * costPerFt * (closetHeight / 8);
        const hardware = materialCost * 0.1;
        const totalCost = materialCost + hardware + installCost;
        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Material", value: materialName },
            { label: "Linear feet of shelving", value: `${formatNumber(linearFeet, 1)} ft` },
            { label: "Material cost", value: `$${formatNumber(materialCost)}` },
            { label: "Hardware & accessories", value: `$${formatNumber(hardware)}` },
            { label: "Installation", value: installCost > 0 ? `$${formatNumber(installCost)}` : "DIY" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["storage-unit-size-calculator", "square-footage-calculator", "kitchen-cabinet-cost-calculator"],
  faq: [
    { question: "How much does a closet organizer cost?", answer: "Basic wire shelving: $50-$200. Laminate systems: $200-$1,000. Wood veneer: $500-$3,000. Custom built-ins: $1,500-$10,000+. Walk-in closets cost 2-4x more than reach-in closets. Professional installation adds $200-$2,000." },
  ],
  formula: "Total = (Linear Feet × Cost/Ft × Height Factor) + Hardware + Installation",
};
