import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hearingAidCostCalculator: CalculatorDefinition = {
  slug: "hearing-aid-cost-calculator",
  title: "Hearing Aid Cost Calculator",
  description:
    "Estimate hearing aid costs by technology level, type, and brand. Compare OTC vs prescription hearing aids and calculate long-term ownership costs.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "hearing aid cost",
    "hearing aid price",
    "hearing aid calculator",
    "otc hearing aid cost",
    "hearing aid comparison",
    "how much do hearing aids cost",
  ],
  variants: [
    {
      id: "prescription",
      name: "Prescription Hearing Aids",
      description: "Estimate cost for professional-fit hearing aids",
      fields: [
        {
          name: "techLevel",
          label: "Technology Level",
          type: "select",
          options: [
            { label: "Basic (essential features)", value: "basic" },
            { label: "Mid-range (good noise handling)", value: "mid" },
            { label: "Premium (best-in-class features)", value: "premium" },
          ],
          defaultValue: "mid",
        },
        {
          name: "style",
          label: "Style",
          type: "select",
          options: [
            { label: "Behind-the-ear (BTE)", value: "bte" },
            { label: "Receiver-in-canal (RIC)", value: "ric" },
            { label: "In-the-ear (ITE)", value: "ite" },
            { label: "Completely-in-canal (CIC)", value: "cic" },
            { label: "Invisible-in-canal (IIC)", value: "iic" },
          ],
          defaultValue: "ric",
        },
        {
          name: "quantity",
          label: "Number of Ears",
          type: "select",
          options: [
            { label: "One ear", value: "1" },
            { label: "Both ears (pair)", value: "2" },
          ],
          defaultValue: "2",
        },
        {
          name: "insuranceCoverage",
          label: "Insurance Coverage",
          type: "number",
          placeholder: "e.g. 1000",
          prefix: "$",
          min: 0,
          max: 5000,
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const tech = inputs.techLevel as string;
        const style = inputs.style as string;
        const quantity = parseFloat(inputs.quantity as string);
        const insurance = parseFloat(inputs.insuranceCoverage as string) || 0;

        const techCosts: Record<string, number> = { basic: 1200, mid: 2200, premium: 3500 };
        const styleMultipliers: Record<string, number> = {
          bte: 0.90, ric: 1.0, ite: 1.05, cic: 1.15, iic: 1.25,
        };

        const perUnit = (techCosts[tech] || 2200) * (styleMultipliers[style] || 1.0);
        const totalCost = perUnit * quantity;
        const outOfPocket = Math.max(0, totalCost - insurance);

        // Professional services typically included
        const servicesIncluded = "Hearing test, fitting, follow-up adjustments, warranty";
        const warrantyYears = tech === "premium" ? 3 : 2;
        const expectedLifespan = 5;
        const annualCost = outOfPocket / expectedLifespan;

        // Battery/maintenance costs
        const annualMaintenance = 100 * quantity; // Batteries, wax guards, etc.

        return {
          primary: { label: "Total Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Per Hearing Aid", value: `$${formatNumber(perUnit, 0)}` },
            { label: "Insurance Coverage", value: `$${formatNumber(insurance, 0)}` },
            { label: "Out-of-Pocket", value: `$${formatNumber(outOfPocket, 0)}` },
            { label: "Annual Cost (5-yr lifespan)", value: `$${formatNumber(annualCost + annualMaintenance, 0)}/yr` },
            { label: "Warranty", value: `${formatNumber(warrantyYears, 0)} years` },
            { label: "Included Services", value: servicesIncluded },
          ],
          note: "Prescription hearing aids typically include professional fitting, programming, and follow-up care. Prices vary significantly by provider and region. Many providers offer financing. Check if your state mandates insurance coverage.",
        };
      },
    },
    {
      id: "otc",
      name: "OTC vs Prescription",
      description: "Compare over-the-counter and prescription hearing aid costs",
      fields: [
        {
          name: "hearingLoss",
          label: "Hearing Loss Level",
          type: "select",
          options: [
            { label: "Mild (difficulty with soft speech)", value: "mild" },
            { label: "Moderate (difficulty with normal speech)", value: "moderate" },
            { label: "Severe (difficulty with loud speech)", value: "severe" },
          ],
          defaultValue: "mild",
        },
        {
          name: "budgetRange",
          label: "Budget Range (per pair)",
          type: "select",
          options: [
            { label: "Under $500", value: "low" },
            { label: "$500 - $1,500", value: "mid" },
            { label: "$1,500 - $3,000", value: "high" },
            { label: "$3,000+", value: "premium" },
          ],
          defaultValue: "mid",
        },
      ],
      calculate: (inputs) => {
        const hearingLoss = inputs.hearingLoss as string;
        const budget = inputs.budgetRange as string;

        const otcEligible = hearingLoss === "mild" || hearingLoss === "moderate";

        const otcCosts = { low: 200, mid: 800, high: 1400 };
        const rxCosts = { low: 2400, mid: 4400, high: 6000, premium: 7000 };

        const otcPairCost = otcEligible ? (budget === "premium" ? 1400 : otcCosts[budget as keyof typeof otcCosts] || 800) : 0;
        const rxPairCost = rxCosts[budget as keyof typeof rxCosts] || 4400;

        const fiveYearOtc = otcPairCost + 500; // No pro services
        const fiveYearRx = rxPairCost + 500; // Includes services
        const savings = rxPairCost - otcPairCost;

        return {
          primary: { label: "OTC Eligible", value: otcEligible ? "Yes" : "No -- prescription recommended" },
          details: [
            { label: "OTC Cost (pair)", value: otcEligible ? `$${formatNumber(otcPairCost, 0)}` : "N/A" },
            { label: "Prescription Cost (pair)", value: `$${formatNumber(rxPairCost, 0)}` },
            { label: "Potential Savings (OTC)", value: otcEligible ? `$${formatNumber(savings, 0)}` : "N/A" },
            { label: "5-Year Cost (OTC)", value: otcEligible ? `$${formatNumber(fiveYearOtc, 0)}` : "N/A" },
            { label: "5-Year Cost (Rx)", value: `$${formatNumber(fiveYearRx, 0)}` },
          ],
          note: "OTC hearing aids are FDA-regulated and suitable for perceived mild-to-moderate hearing loss in adults 18+. They do not require professional fitting. Severe hearing loss requires prescription hearing aids. A professional hearing test is recommended before purchasing any hearing aids.",
        };
      },
    },
  ],
  relatedSlugs: ["lasik-cost-calculator", "dental-implant-cost-calculator", "cpap-pressure-calculator"],
  faq: [
    {
      question: "How much do hearing aids cost on average?",
      answer:
        "Prescription hearing aids cost $1,000-$3,500 per ear ($2,000-$7,000 per pair), including professional services. OTC hearing aids range from $100-$1,500 per pair. Technology level, style, and included services are the biggest cost factors.",
    },
    {
      question: "Are OTC hearing aids worth it?",
      answer:
        "OTC hearing aids can be a good option for adults with perceived mild-to-moderate hearing loss who want an affordable entry point. Brands like Jabra, Sony, and Lexie offer quality OTC devices. However, they lack professional customization and are not suitable for severe hearing loss or children.",
    },
  ],
  formula:
    "Total Cost = Base Tech Cost x Style Multiplier x Quantity - Insurance | Annual Cost = Out-of-Pocket / Lifespan + Maintenance",
};
