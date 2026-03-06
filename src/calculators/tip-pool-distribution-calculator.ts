import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tipPoolDistributionCalculator: CalculatorDefinition = {
  slug: "tip-pool-distribution-calculator",
  title: "Tip Pool Distribution Calculator",
  description: "Distribute pooled tips fairly among restaurant staff based on hours worked, position, and customizable tip share percentages for each role.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["tip pool distribution","tip share calculator","restaurant tip split","server tip allocation"],
  variants: [{
    id: "standard",
    name: "Tip Pool Distribution",
    description: "Distribute pooled tips fairly among restaurant staff based on hours worked, position, and customizable tip share percentages for each role.",
    fields: [
      { name: "totalTips", label: "Total Tips to Distribute ($)", type: "number", min: 0, max: 100000, defaultValue: 1200 },
      { name: "serverHours", label: "Total Server Hours", type: "number", min: 0, max: 500, defaultValue: 40 },
      { name: "bartenderHours", label: "Total Bartender Hours", type: "number", min: 0, max: 200, defaultValue: 16 },
      { name: "bussersHours", label: "Total Busser Hours", type: "number", min: 0, max: 200, defaultValue: 20 },
      { name: "serverShare", label: "Server Tip Share (%)", type: "number", min: 0, max: 100, defaultValue: 60 },
      { name: "bartenderShare", label: "Bartender Tip Share (%)", type: "number", min: 0, max: 100, defaultValue: 25 },
      { name: "busserShare", label: "Busser Tip Share (%)", type: "number", min: 0, max: 100, defaultValue: 15 },
    ],
    calculate: (inputs) => {
    const total = inputs.totalTips as number;
    const sHours = inputs.serverHours as number;
    const bHours = inputs.bartenderHours as number;
    const buHours = inputs.bussersHours as number;
    const sShare = inputs.serverShare as number;
    const bShare = inputs.bartenderShare as number;
    const buShare = inputs.busserShare as number;
    const totalShare = sShare + bShare + buShare;
    const serverPool = totalShare > 0 ? total * (sShare / totalShare) : 0;
    const bartenderPool = totalShare > 0 ? total * (bShare / totalShare) : 0;
    const busserPool = totalShare > 0 ? total * (buShare / totalShare) : 0;
    const serverPerHour = sHours > 0 ? serverPool / sHours : 0;
    const bartenderPerHour = bHours > 0 ? bartenderPool / bHours : 0;
    const busserPerHour = buHours > 0 ? busserPool / buHours : 0;
    return {
      primary: { label: "Server Pool Total", value: "$" + formatNumber(Math.round(serverPool * 100) / 100) },
      details: [
        { label: "Server Tips Per Hour", value: "$" + formatNumber(Math.round(serverPerHour * 100) / 100) },
        { label: "Bartender Pool Total", value: "$" + formatNumber(Math.round(bartenderPool * 100) / 100) },
        { label: "Bartender Tips Per Hour", value: "$" + formatNumber(Math.round(bartenderPerHour * 100) / 100) },
        { label: "Busser Pool Total", value: "$" + formatNumber(Math.round(busserPool * 100) / 100) },
        { label: "Busser Tips Per Hour", value: "$" + formatNumber(Math.round(busserPerHour * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["restaurant-profit-margin-calculator","restaurant-labor-cost-percentage-calculator"],
  faq: [
    { question: "How does a tip pool work?", answer: "In a tip pool, all or a portion of tips collected by front-of-house staff are combined into a single pool and then distributed among eligible employees based on hours worked, position, or a point system." },
    { question: "Is tip pooling legal?", answer: "Tip pooling is legal in most U.S. states as long as employers do not keep any portion. Federal law prohibits managers and supervisors from participating. Some states have additional restrictions on which positions can be included." },
    { question: "What is a fair tip pool split?", answer: "A common split is 55 to 70 percent to servers, 15 to 25 percent to bartenders, and 10 to 20 percent to bussers and food runners. The exact percentages should reflect each role contribution to guest service." },
  ],
  formula: "Server Pool = Total Tips x (Server Share % / Total Share %)
Tips Per Hour = Role Pool Total / Role Total Hours",
};
