import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inkCoverageCalculator: CalculatorDefinition = {
  slug: "ink-coverage-calculator",
  title: "Ink & Toner Coverage Calculator",
  description: "Free ink and toner coverage calculator. Estimate ink/toner usage, cost per page, and cartridge life based on coverage percentage and print volume.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ink coverage calculator", "toner coverage calculator", "cost per page", "printer ink calculator", "cartridge yield calculator"],
  variants: [
    {
      id: "yield",
      name: "Cartridge Yield",
      description: "Estimate how many pages from a cartridge",
      fields: [
        { name: "ratedYield", label: "Rated Page Yield (pages)", type: "number", placeholder: "e.g. 2500" },
        { name: "ratedCoverage", label: "Rated Coverage %", type: "select", options: [
          { label: "5% (industry standard)", value: "5" },
          { label: "7%", value: "7" },
          { label: "10%", value: "10" },
        ], defaultValue: "5" },
        { name: "actualCoverage", label: "Your Actual Coverage %", type: "select", options: [
          { label: "5% (mostly text)", value: "5" },
          { label: "10% (text with some graphics)", value: "10" },
          { label: "15% (text-heavy with images)", value: "15" },
          { label: "20% (mixed text and images)", value: "20" },
          { label: "30% (image-heavy documents)", value: "30" },
          { label: "50% (photos/graphics)", value: "50" },
          { label: "80% (near full coverage)", value: "80" },
          { label: "100% (full page coverage)", value: "100" },
        ], defaultValue: "15" },
        { name: "cartridgeCost", label: "Cartridge Cost ($)", type: "number", placeholder: "e.g. 35", prefix: "$" },
      ],
      calculate: (inputs) => {
        const ratedYield = inputs.ratedYield as number;
        const ratedCov = parseInt(inputs.ratedCoverage as string) || 5;
        const actualCov = parseInt(inputs.actualCoverage as string) || 15;
        const cost = inputs.cartridgeCost as number;
        if (!ratedYield) return null;

        const actualYield = Math.round(ratedYield * (ratedCov / actualCov));
        const details = [
          { label: "Rated yield", value: `${formatNumber(ratedYield)} pages at ${ratedCov}%` },
          { label: "Estimated actual yield", value: `${formatNumber(actualYield)} pages at ${actualCov}%` },
          { label: "Coverage ratio", value: `${formatNumber(actualCov / ratedCov, 1)}x the rated coverage` },
          { label: "Yield reduction", value: `${formatNumber((1 - actualYield / ratedYield) * 100, 0)}% fewer pages` },
        ];

        if (cost) {
          const costPerPage = cost / actualYield;
          details.push(
            { label: "Cost per page", value: `$${formatNumber(costPerPage, 4)}` },
            { label: "Cost per 100 pages", value: `$${formatNumber(costPerPage * 100, 2)}` },
          );
        }

        return {
          primary: { label: "Actual Page Yield", value: `~${formatNumber(actualYield)} pages` },
          details,
          note: "Manufacturer ratings assume 5% coverage (a few lines of text). Real-world coverage is typically 10-20% for mixed documents.",
        };
      },
    },
    {
      id: "monthly",
      name: "Monthly Print Cost",
      description: "Calculate monthly printing costs",
      fields: [
        { name: "pagesPerMonth", label: "Pages per Month", type: "number", placeholder: "e.g. 500" },
        { name: "coverage", label: "Average Coverage %", type: "select", options: [
          { label: "5% (text only)", value: "5" },
          { label: "10% (mostly text)", value: "10" },
          { label: "15% (text + some images)", value: "15" },
          { label: "20% (mixed)", value: "20" },
          { label: "30% (image heavy)", value: "30" },
        ], defaultValue: "15" },
        { name: "cartridgeYield", label: "Cartridge Rated Yield", type: "number", placeholder: "e.g. 2500", defaultValue: 2500 },
        { name: "cartridgeCost", label: "Cartridge Cost ($)", type: "number", placeholder: "e.g. 35", prefix: "$" },
        { name: "paperCostPer500", label: "Paper Cost per 500 Sheets ($)", type: "number", placeholder: "e.g. 8", prefix: "$", defaultValue: 8 },
      ],
      calculate: (inputs) => {
        const pages = inputs.pagesPerMonth as number;
        const coverage = parseInt(inputs.coverage as string) || 15;
        const ratedYield = (inputs.cartridgeYield as number) || 2500;
        const cartCost = inputs.cartridgeCost as number;
        const paperCost = (inputs.paperCostPer500 as number) || 0;
        if (!pages || !cartCost) return null;

        const actualYield = ratedYield * (5 / coverage);
        const cartridgesPerMonth = pages / actualYield;
        const inkCostPerMonth = cartridgesPerMonth * cartCost;
        const paperCostPerMonth = (pages / 500) * paperCost;
        const totalPerMonth = inkCostPerMonth + paperCostPerMonth;

        return {
          primary: { label: "Monthly Cost", value: `$${formatNumber(totalPerMonth, 2)}` },
          details: [
            { label: "Ink/toner cost", value: `$${formatNumber(inkCostPerMonth, 2)}/month` },
            { label: "Paper cost", value: `$${formatNumber(paperCostPerMonth, 2)}/month` },
            { label: "Total monthly", value: `$${formatNumber(totalPerMonth, 2)}` },
            { label: "Annual cost", value: `$${formatNumber(totalPerMonth * 12, 2)}` },
            { label: "Cost per page", value: `$${formatNumber(totalPerMonth / pages, 4)}` },
            { label: "Cartridge life", value: `${formatNumber(actualYield / pages, 1)} months` },
            { label: "Cartridges per year", value: formatNumber(cartridgesPerMonth * 12, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["printing-cost-calculator", "paper-weight-calculator", "photo-print-size-calculator"],
  faq: [
    { question: "What does 5% coverage mean?", answer: "5% coverage means 5% of the page area is covered with ink/toner. This is the industry standard for rating cartridge yields and roughly equals a page with a few paragraphs of text and no images." },
    { question: "What is typical ink coverage for documents?", answer: "Text-only documents: 5-7%. Text with some graphics: 10-15%. Mixed documents with images: 15-25%. Photo prints: 50-100%. Most office printing averages 10-15%." },
    { question: "Why do I run out of ink faster than rated?", answer: "Manufacturer yields assume only 5% coverage. If you print documents with images, logos, or graphics, your actual coverage may be 15-30%, meaning cartridges last 2-6x fewer pages than rated." },
  ],
  formula: "Actual Yield = Rated Yield × (Rated Coverage / Actual Coverage) | Cost per Page = Cartridge Cost / Actual Yield",
};
