import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ventPipeSizeCalculator: CalculatorDefinition = {
  slug: "vent-pipe-size-calculator",
  title: "Vent Pipe Size Calculator",
  description: "Free vent pipe size calculator. Determine the correct vent pipe diameter based on fixture units, developed length, and plumbing code requirements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["vent pipe size calculator", "plumbing vent sizing", "DFU vent calculator", "vent stack size", "plumbing vent pipe"],
  variants: [
    {
      id: "vent-sizing",
      name: "Vent Pipe from Fixture Units",
      description: "Calculate vent pipe size based on DFU and length",
      fields: [
        { name: "dfu", label: "Total Drainage Fixture Units (DFU)", type: "number", placeholder: "e.g. 12" },
        { name: "developedLength", label: "Developed Length (ft)", type: "number", placeholder: "e.g. 40" },
        { name: "ventType", label: "Vent Type", type: "select", options: [
          { label: "Individual Vent", value: "individual" },
          { label: "Branch Vent", value: "branch" },
          { label: "Vent Stack", value: "stack" },
        ], defaultValue: "individual" },
      ],
      calculate: (inputs) => {
        const dfu = inputs.dfu as number;
        const developedLength = inputs.developedLength as number;
        const ventType = inputs.ventType as string;
        if (!dfu || !developedLength) return null;
        let ventSize = 1.25;
        if (dfu <= 1 && developedLength <= 45) ventSize = 1.25;
        else if (dfu <= 8 && developedLength <= 50) ventSize = 1.5;
        else if (dfu <= 24 && developedLength <= 60) ventSize = 2;
        else if (dfu <= 48 && developedLength <= 100) ventSize = 2.5;
        else if (dfu <= 84 && developedLength <= 200) ventSize = 3;
        else if (dfu <= 256 && developedLength <= 300) ventSize = 4;
        else ventSize = 6;
        if (ventType === "stack") ventSize = Math.max(ventSize, 2);
        const drainSize = dfu <= 1 ? 1.25 : dfu <= 3 ? 1.5 : dfu <= 6 ? 2 : dfu <= 12 ? 2.5 : dfu <= 32 ? 3 : 4;
        return {
          primary: { label: "Required Vent Pipe Size", value: `${formatNumber(ventSize, 2)}` + " inches" },
          details: [
            { label: "Fixture Units", value: `${formatNumber(dfu, 0)}` + " DFU" },
            { label: "Developed Length", value: `${formatNumber(developedLength, 0)}` + " ft" },
            { label: "Vent Type", value: ventType },
            { label: "Min Drain Size", value: `${formatNumber(drainSize, 2)}` + " in" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pipe-sizing-calculator", "drain-pipe-slope-calculator", "sewer-pipe-capacity-calculator"],
  faq: [
    { question: "What is a plumbing vent?", answer: "A plumbing vent allows air into the drain system to maintain proper atmospheric pressure, preventing siphoning of trap seals and allowing waste to flow by gravity." },
    { question: "How do I count fixture units?", answer: "Each plumbing fixture has a DFU value: toilet = 3-4 DFU, lavatory = 1 DFU, shower = 2 DFU, kitchen sink = 2 DFU, bathtub = 2 DFU, washing machine = 2 DFU." },
  ],
  formula: "Vent size determined by DFU count and developed length per UPC/IPC vent sizing tables",
};