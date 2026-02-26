import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dentalCostCalculator: CalculatorDefinition = {
  slug: "dental-cost-calculator",
  title: "Dental Procedure Cost Estimator",
  description:
    "Estimate dental procedure costs by type and region. Compare costs for common dental procedures including cleanings, fillings, crowns, implants, and more.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "dental cost calculator",
    "dental procedure cost",
    "dentist cost estimator",
    "dental implant cost",
    "root canal cost",
    "crown cost",
    "dental insurance",
  ],
  variants: [
    {
      id: "procedure-cost",
      name: "Procedure Cost Estimator",
      description: "Estimate cost for common dental procedures by type and region",
      fields: [
        {
          name: "procedure",
          label: "Dental Procedure",
          type: "select",
          options: [
            { label: "Routine Cleaning (prophylaxis)", value: "cleaning" },
            { label: "Deep Cleaning (scaling/root planing)", value: "deepCleaning" },
            { label: "Composite Filling (tooth-colored)", value: "filling" },
            { label: "Dental Crown (porcelain)", value: "crown" },
            { label: "Root Canal (molar)", value: "rootCanal" },
            { label: "Tooth Extraction (simple)", value: "extraction" },
            { label: "Wisdom Tooth Extraction (surgical)", value: "wisdom" },
            { label: "Dental Implant (single)", value: "implant" },
            { label: "Dental Bridge (3-unit)", value: "bridge" },
            { label: "Veneer (porcelain, per tooth)", value: "veneer" },
            { label: "Dentures (full set)", value: "dentures" },
            { label: "Invisalign / Clear Aligners", value: "invisalign" },
          ],
        },
        {
          name: "region",
          label: "US Region",
          type: "select",
          options: [
            { label: "Northeast (higher cost)", value: "northeast" },
            { label: "West Coast (higher cost)", value: "west" },
            { label: "Midwest (moderate cost)", value: "midwest" },
            { label: "Southeast (moderate cost)", value: "southeast" },
            { label: "Southwest (lower cost)", value: "southwest" },
          ],
        },
        {
          name: "insurance",
          label: "Dental Insurance",
          type: "select",
          options: [
            { label: "No Insurance", value: "none" },
            { label: "Basic PPO (covers 50-80%)", value: "ppo" },
            { label: "HMO/DHMO (set copay)", value: "hmo" },
            { label: "Discount Plan (20-40% off)", value: "discount" },
          ],
        },
      ],
      calculate: (inputs) => {
        const procedure = inputs.procedure as string;
        const region = inputs.region as string;
        const insurance = inputs.insurance as string;

        if (!procedure || !region || !insurance) return null;

        // National average costs (without insurance)
        const baseCosts: Record<string, { low: number; avg: number; high: number }> = {
          cleaning: { low: 75, avg: 125, high: 200 },
          deepCleaning: { low: 200, avg: 350, high: 600 },
          filling: { low: 150, avg: 250, high: 400 },
          crown: { low: 800, avg: 1200, high: 1800 },
          rootCanal: { low: 700, avg: 1100, high: 1600 },
          extraction: { low: 100, avg: 200, high: 350 },
          wisdom: { low: 300, avg: 500, high: 800 },
          implant: { low: 2500, avg: 4000, high: 6000 },
          bridge: { low: 1500, avg: 3000, high: 5000 },
          veneer: { low: 800, avg: 1500, high: 2500 },
          dentures: { low: 1000, avg: 2000, high: 4000 },
          invisalign: { low: 3000, avg: 5000, high: 8000 },
        };

        const cost = baseCosts[procedure];
        if (!cost) return null;

        // Regional adjustment
        const regionMultipliers: Record<string, number> = {
          northeast: 1.2,
          west: 1.15,
          midwest: 1.0,
          southeast: 0.95,
          southwest: 0.9,
        };
        const multiplier = regionMultipliers[region] || 1.0;

        const adjLow = cost.low * multiplier;
        const adjAvg = cost.avg * multiplier;
        const adjHigh = cost.high * multiplier;

        // Insurance adjustment
        let outOfPocket: number;
        let insuranceNote: string;
        const typicalCoverage: Record<string, Record<string, number>> = {
          cleaning: { ppo: 0.9, hmo: 0.95, discount: 0.3 },
          deepCleaning: { ppo: 0.8, hmo: 0.7, discount: 0.3 },
          filling: { ppo: 0.8, hmo: 0.7, discount: 0.3 },
          crown: { ppo: 0.5, hmo: 0.4, discount: 0.25 },
          rootCanal: { ppo: 0.5, hmo: 0.4, discount: 0.25 },
          extraction: { ppo: 0.8, hmo: 0.7, discount: 0.3 },
          wisdom: { ppo: 0.5, hmo: 0.4, discount: 0.25 },
          implant: { ppo: 0.3, hmo: 0.1, discount: 0.2 },
          bridge: { ppo: 0.5, hmo: 0.3, discount: 0.25 },
          veneer: { ppo: 0.0, hmo: 0.0, discount: 0.2 },
          dentures: { ppo: 0.5, hmo: 0.4, discount: 0.25 },
          invisalign: { ppo: 0.3, hmo: 0.1, discount: 0.15 },
        };

        if (insurance === "none") {
          outOfPocket = adjAvg;
          insuranceNote = "No insurance — full cost";
        } else {
          const coverage = typicalCoverage[procedure]?.[insurance] || 0;
          outOfPocket = adjAvg * (1 - coverage);
          insuranceNote = `Insurance covers ~${formatNumber(coverage * 100, 0)}% (${insurance.toUpperCase()})`;
        }

        const procedureNames: Record<string, string> = {
          cleaning: "Routine Cleaning",
          deepCleaning: "Deep Cleaning (Scaling/Root Planing)",
          filling: "Composite Filling",
          crown: "Porcelain Crown",
          rootCanal: "Root Canal (Molar)",
          extraction: "Simple Extraction",
          wisdom: "Surgical Wisdom Tooth Extraction",
          implant: "Single Dental Implant",
          bridge: "3-Unit Dental Bridge",
          veneer: "Porcelain Veneer (per tooth)",
          dentures: "Full Denture Set",
          invisalign: "Invisalign / Clear Aligners",
        };

        return {
          primary: { label: "Estimated Out-of-Pocket", value: `$${formatNumber(outOfPocket, 0)}` },
          details: [
            { label: "Procedure", value: procedureNames[procedure] || procedure },
            { label: "Cost Range (your region)", value: `$${formatNumber(adjLow, 0)} - $${formatNumber(adjHigh, 0)}` },
            { label: "Average Cost", value: `$${formatNumber(adjAvg, 0)}` },
            { label: "Insurance Coverage", value: insuranceNote },
            { label: "Estimated Out-of-Pocket", value: `$${formatNumber(outOfPocket, 0)}` },
          ],
          note: "These are estimated averages based on national data. Actual costs vary significantly by dentist, location, complexity, and materials used. Get a written treatment plan with costs before proceeding. Annual insurance maximums (typically $1000-2000) may affect coverage.",
        };
      },
    },
    {
      id: "treatment-plan",
      name: "Multi-Procedure Treatment Plan",
      description: "Estimate total cost for a treatment plan with multiple procedures",
      fields: [
        {
          name: "proc1Cost",
          label: "Procedure 1 Cost",
          type: "number",
          placeholder: "e.g. 1200",
          prefix: "$",
          min: 0,
          max: 50000,
        },
        {
          name: "proc2Cost",
          label: "Procedure 2 Cost",
          type: "number",
          placeholder: "e.g. 350",
          prefix: "$",
          min: 0,
          max: 50000,
        },
        {
          name: "proc3Cost",
          label: "Procedure 3 Cost (optional)",
          type: "number",
          placeholder: "e.g. 250",
          prefix: "$",
          min: 0,
          max: 50000,
        },
        {
          name: "annualMax",
          label: "Insurance Annual Maximum",
          type: "number",
          placeholder: "e.g. 1500",
          prefix: "$",
          min: 0,
          max: 10000,
          defaultValue: 1500,
        },
        {
          name: "coveragePercent",
          label: "Average Insurance Coverage",
          type: "number",
          placeholder: "e.g. 50",
          suffix: "%",
          min: 0,
          max: 100,
        },
      ],
      calculate: (inputs) => {
        const proc1 = parseFloat(inputs.proc1Cost as string) || 0;
        const proc2 = parseFloat(inputs.proc2Cost as string) || 0;
        const proc3 = parseFloat(inputs.proc3Cost as string) || 0;
        const annualMax = parseFloat(inputs.annualMax as string) || 1500;
        const coveragePercent = parseFloat(inputs.coveragePercent as string) || 0;

        const totalCost = proc1 + proc2 + proc3;
        if (totalCost === 0) return null;

        const insurancePays = Math.min(totalCost * (coveragePercent / 100), annualMax);
        const outOfPocket = totalCost - insurancePays;
        const monthlyPayment12 = outOfPocket / 12;
        const monthlyPayment24 = outOfPocket / 24;

        return {
          primary: { label: "Total Out-of-Pocket", value: `$${formatNumber(outOfPocket, 0)}` },
          details: [
            { label: "Total Treatment Cost", value: `$${formatNumber(totalCost, 0)}` },
            { label: "Insurance Pays", value: `$${formatNumber(insurancePays, 0)} (capped at $${formatNumber(annualMax, 0)} annual max)` },
            { label: "Your Cost", value: `$${formatNumber(outOfPocket, 0)}` },
            { label: "Payment Plan (12 months)", value: `$${formatNumber(monthlyPayment12, 0)}/month` },
            { label: "Payment Plan (24 months)", value: `$${formatNumber(monthlyPayment24, 0)}/month` },
          ],
          note: "Consider splitting treatment across two calendar years to maximize insurance benefits. Many dental offices offer payment plans or accept CareCredit. Ask about cash-pay discounts for uninsured patients.",
        };
      },
    },
  ],
  relatedSlugs: ["vision-acuity-calculator", "weight-watchers-calculator", "meal-calorie-calculator"],
  faq: [
    {
      question: "How much does a dental implant cost?",
      answer:
        "A single dental implant typically costs $2,500-$6,000 for the implant, abutment, and crown combined. Bone grafting, if needed, adds $300-$1,200. Insurance coverage for implants is limited (0-30%). Total out-of-pocket is often $3,000-$5,000 per tooth.",
    },
    {
      question: "Does dental insurance cover major procedures?",
      answer:
        "Most PPO dental insurance covers preventive care at 80-100%, basic procedures (fillings, extractions) at 50-80%, and major procedures (crowns, bridges, root canals) at 50%. Cosmetic procedures (veneers, whitening) are usually not covered. Annual maximums are typically $1,000-$2,000.",
    },
    {
      question: "How can I reduce dental costs?",
      answer:
        "Options include: dental schools (40-60% less), community health centers, dental discount plans, asking for cash-pay discounts, splitting treatment across insurance years, using an FSA/HSA, and seeking treatment at practices in lower-cost areas.",
    },
  ],
  formula:
    "Estimated Cost = Base National Average x Regional Multiplier | Out-of-Pocket = Adjusted Cost x (1 - Insurance Coverage Rate) | Coverage capped at annual maximum",
};
