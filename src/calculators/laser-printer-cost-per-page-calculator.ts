import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const laserPrinterCostPerPageCalculator: CalculatorDefinition = {
  slug: "laser-printer-cost-per-page-calculator",
  title: "Laser Printer Cost Per Page Calculator",
  description: "Calculate the true cost per page of your laser printer including toner, drum, and maintenance costs to compare printing expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["laser printer cost per page","toner cost calculator","printing cost","laser vs inkjet cost","printer running cost"],
  variants: [{
    id: "standard",
    name: "Laser Printer Cost Per Page",
    description: "Calculate the true cost per page of your laser printer including toner, drum, and maintenance costs to compare printing expenses.",
    fields: [
      { name: "tonerCost", label: "Toner Cartridge Cost ($)", type: "number", min: 10, max: 500, defaultValue: 65 },
      { name: "tonerYield", label: "Toner Page Yield", type: "number", min: 500, max: 30000, defaultValue: 3000 },
      { name: "drumCost", label: "Drum Unit Cost ($)", type: "number", min: 0, max: 300, defaultValue: 45 },
      { name: "drumYield", label: "Drum Page Yield", type: "number", min: 5000, max: 100000, defaultValue: 12000 },
      { name: "pagesPerMonth", label: "Pages Printed Per Month", type: "number", min: 10, max: 10000, defaultValue: 500 },
      { name: "paperCost", label: "Paper Cost Per Ream ($)", type: "number", min: 3, max: 30, defaultValue: 6 },
    ],
    calculate: (inputs) => {
    const tonerCost = inputs.tonerCost as number;
    const tonerYield = inputs.tonerYield as number;
    const drumCost = inputs.drumCost as number;
    const drumYield = inputs.drumYield as number;
    const pagesPerMonth = inputs.pagesPerMonth as number;
    const paperCostReam = inputs.paperCost as number;
    const tonerPerPage = tonerCost / tonerYield;
    const drumPerPage = drumCost / drumYield;
    const paperPerPage = paperCostReam / 500;
    const totalPerPage = tonerPerPage + drumPerPage + paperPerPage;
    const monthlyCost = totalPerPage * pagesPerMonth;
    const annualCost = monthlyCost * 12;
    const tonerMonths = tonerYield / pagesPerMonth;
    return {
      primary: { label: "Cost Per Page", value: "$" + formatNumber(Math.round(totalPerPage * 10000) / 10000) },
      details: [
        { label: "Toner Cost Per Page", value: "$" + formatNumber(Math.round(tonerPerPage * 10000) / 10000) },
        { label: "Monthly Printing Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        { label: "Annual Printing Cost", value: "$" + formatNumber(Math.round(annualCost * 100) / 100) },
        { label: "Toner Lasts (Months)", value: formatNumber(Math.round(tonerMonths * 10) / 10) }
      ]
    };
  },
  }],
  relatedSlugs: ["printer-ink-cost-calculator","3d-printer-filament-cost-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Cost Per Page = (Toner Cost / Yield) + (Drum Cost / Yield) + (Paper Cost / 500); Monthly Cost = Cost Per Page x Pages Per Month; Annual Cost = Monthly Cost x 12",
};
