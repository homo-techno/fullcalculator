import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const funeralCostCalculator: CalculatorDefinition = {
  slug: "funeral-cost-calculator",
  title: "Funeral Cost Estimator",
  description:
    "Estimate funeral costs by service type. Compare traditional burial, cremation, and green burial expenses including casket, venue, and memorial services.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "funeral cost",
    "burial cost",
    "cremation cost",
    "funeral planning",
    "memorial service",
  ],
  variants: [
    {
      id: "byType",
      name: "By Service Type",
      description: "Estimate costs based on the type of funeral service",
      fields: [
        { name: "serviceType", label: "Service Type", type: "select", options: [
          { label: "Traditional Burial", value: "traditional" },
          { label: "Cremation with Service", value: "cremationService" },
          { label: "Direct Cremation", value: "directCremation" },
          { label: "Green/Natural Burial", value: "green" },
          { label: "Direct Burial (no service)", value: "directBurial" },
        ], defaultValue: "traditional" },
        { name: "casketUrn", label: "Casket or Urn ($)", type: "number", placeholder: "e.g. 2500" },
        { name: "cemeteryPlot", label: "Cemetery Plot ($)", type: "number", placeholder: "e.g. 1500" },
        { name: "headstone", label: "Headstone/Marker ($)", type: "number", placeholder: "e.g. 1500" },
        { name: "flowers", label: "Flowers ($)", type: "number", placeholder: "e.g. 500", defaultValue: 500 },
        { name: "numAttendees", label: "Expected Attendees", type: "number", placeholder: "e.g. 100", defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const serviceType = inputs.serviceType as string;
        const flowers = parseFloat(inputs.flowers as string) || 0;
        const numAttendees = parseFloat(inputs.numAttendees as string) || 100;

        const baseCosts: Record<string, { funeral: number; embalming: number; casket: number; plot: number; headstone: number }> = {
          traditional: { funeral: 2500, embalming: 800, casket: 2500, plot: 1500, headstone: 1500 },
          cremationService: { funeral: 2000, embalming: 0, casket: 200, plot: 0, headstone: 0 },
          directCremation: { funeral: 800, embalming: 0, casket: 0, plot: 0, headstone: 0 },
          green: { funeral: 1500, embalming: 0, casket: 500, plot: 1000, headstone: 300 },
          directBurial: { funeral: 1200, embalming: 0, casket: 1000, plot: 1500, headstone: 500 },
        };

        const base = baseCosts[serviceType] || baseCosts.traditional;
        const casketUrn = parseFloat(inputs.casketUrn as string) || base.casket;
        const cemeteryPlot = parseFloat(inputs.cemeteryPlot as string) || base.plot;
        const headstone = parseFloat(inputs.headstone as string) || base.headstone;

        const receptionCost = numAttendees * 15;
        const obituary = 300;
        const totalCost = base.funeral + base.embalming + casketUrn + cemeteryPlot + headstone + flowers + receptionCost + obituary;

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost, 2)}` },
          details: [
            { label: "Funeral Home Services", value: `$${formatNumber(base.funeral, 2)}` },
            { label: "Embalming", value: `$${formatNumber(base.embalming, 2)}` },
            { label: "Casket/Urn", value: `$${formatNumber(casketUrn, 2)}` },
            { label: "Cemetery Plot", value: `$${formatNumber(cemeteryPlot, 2)}` },
            { label: "Headstone/Marker", value: `$${formatNumber(headstone, 2)}` },
            { label: "Flowers", value: `$${formatNumber(flowers, 2)}` },
            { label: "Reception (~$15/person)", value: `$${formatNumber(receptionCost, 2)}` },
            { label: "Obituary", value: `$${formatNumber(obituary, 2)}` },
          ],
        };
      },
    },
    {
      id: "comparison",
      name: "Cost Comparison",
      description: "Compare costs across different funeral types side by side",
      fields: [
        { name: "region", label: "Region", type: "select", options: [
          { label: "Low cost area", value: "low" },
          { label: "Average cost area", value: "avg" },
          { label: "High cost area (metro)", value: "high" },
        ], defaultValue: "avg" },
        { name: "numAttendees", label: "Expected Attendees", type: "number", placeholder: "e.g. 100", defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const region = inputs.region as string;
        const numAttendees = parseFloat(inputs.numAttendees as string) || 100;

        const regionMultiplier: Record<string, number> = { low: 0.75, avg: 1.0, high: 1.4 };
        const m = regionMultiplier[region] || 1;
        const reception = numAttendees * 15 * m;

        const traditional = (8800 * m) + reception;
        const cremationService = (3000 * m) + reception;
        const directCremation = 1000 * m;
        const greenBurial = (3500 * m) + reception;
        const directBurial = (4200 * m);

        return {
          primary: { label: "Traditional Burial Estimate", value: `$${formatNumber(traditional, 2)}` },
          details: [
            { label: "Traditional Burial", value: `$${formatNumber(traditional, 2)}` },
            { label: "Cremation with Service", value: `$${formatNumber(cremationService, 2)}` },
            { label: "Direct Cremation", value: `$${formatNumber(directCremation, 2)}` },
            { label: "Green/Natural Burial", value: `$${formatNumber(greenBurial, 2)}` },
            { label: "Direct Burial (no service)", value: `$${formatNumber(directBurial, 2)}` },
            { label: "Savings: Cremation vs Traditional", value: `$${formatNumber(traditional - cremationService, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["budget-calculator", "life-insurance-calculator", "estate-tax-calculator"],
  faq: [
    {
      question: "How much does a funeral cost on average?",
      answer:
        "The national median cost of a funeral with burial is about $7,800-$9,000 (not including cemetery costs). With a cemetery plot, headstone, and reception, total costs typically reach $10,000-$15,000. Cremation costs $2,000-$5,000.",
    },
    {
      question: "What is the cheapest type of funeral?",
      answer:
        "Direct cremation is the most affordable option at $800-$2,000, with no viewing, service, or embalming. Direct burial without a service runs $1,500-$4,000. These options skip the funeral home ceremony.",
    },
    {
      question: "Does life insurance cover funeral costs?",
      answer:
        "Yes, life insurance payouts can cover funeral costs, but the beneficiary receives the money after the death, which may take weeks. Pre-need funeral insurance or a payable-on-death bank account can provide faster access to funds.",
    },
  ],
  formula:
    "Total Cost = Funeral Home Fee + Embalming + Casket/Urn + Cemetery Plot + Headstone + Flowers + (Attendees × Reception Cost) + Obituary",
};
