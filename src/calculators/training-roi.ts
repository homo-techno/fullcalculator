import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const trainingRoiCalculator: CalculatorDefinition = {
  slug: "training-roi-calculator",
  title: "Training ROI Calculator",
  description: "Free training ROI calculator. Measure return on investment for employee training programs by comparing training costs to productivity gains and revenue impact.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["training roi calculator", "training return on investment", "learning roi", "employee development roi", "training cost benefit"],
  variants: [
    {
      id: "roi",
      name: "Training Program ROI",
      description: "Calculate ROI of a training program",
      fields: [
        { name: "trainingCost", label: "Total Training Cost", type: "number", placeholder: "e.g. 15000", prefix: "$" },
        { name: "participants", label: "Number of Participants", type: "number", placeholder: "e.g. 20" },
        { name: "hoursPerPerson", label: "Training Hours per Person", type: "number", placeholder: "e.g. 16", suffix: "hours" },
        { name: "avgHourlyRate", label: "Avg Hourly Rate of Participants", type: "number", placeholder: "e.g. 40", prefix: "$" },
        { name: "productivityGainPct", label: "Estimated Productivity Gain", type: "number", placeholder: "e.g. 10", suffix: "%" },
        { name: "measurementMonths", label: "Benefit Measurement Period", type: "number", placeholder: "e.g. 12", suffix: "months", defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const cost = inputs.trainingCost as number;
        const participants = inputs.participants as number;
        const hours = inputs.hoursPerPerson as number;
        const rate = inputs.avgHourlyRate as number;
        const gainPct = inputs.productivityGainPct as number;
        const months = (inputs.measurementMonths as number) || 12;
        if (!cost || !participants || !hours || !rate || !gainPct) return null;

        const opportunityCost = participants * hours * rate;
        const totalInvestment = cost + opportunityCost;
        const monthlyHoursPerPerson = 160;
        const monthlyGainPerPerson = monthlyHoursPerPerson * rate * (gainPct / 100);
        const totalBenefit = monthlyGainPerPerson * participants * months;
        const netBenefit = totalBenefit - totalInvestment;
        const roi = (netBenefit / totalInvestment) * 100;
        const costPerParticipant = totalInvestment / participants;
        const paybackMonths = totalInvestment / (monthlyGainPerPerson * participants);

        return {
          primary: { label: "Training ROI", value: formatNumber(roi, 1), suffix: "%" },
          details: [
            { label: "Total investment", value: `$${formatNumber(totalInvestment)}` },
            { label: "Direct training cost", value: `$${formatNumber(cost)}` },
            { label: "Opportunity cost (lost work time)", value: `$${formatNumber(opportunityCost)}` },
            { label: "Total benefit over period", value: `$${formatNumber(totalBenefit)}` },
            { label: "Net benefit", value: `$${formatNumber(netBenefit)}` },
            { label: "Cost per participant", value: `$${formatNumber(costPerParticipant)}` },
            { label: "Payback period", value: `${formatNumber(paybackMonths, 1)} months` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["roi-calculator", "hiring-cost-calculator", "turnover-cost-calculator"],
  faq: [
    { question: "How do I measure training ROI?", answer: "Training ROI = ((Benefits - Costs) / Costs) x 100. Benefits include increased productivity, reduced errors, lower turnover, and faster task completion. Costs include program fees, materials, facilitator time, and the opportunity cost of employees away from work." },
    { question: "What is a good training ROI?", answer: "Any positive ROI means the training paid for itself. According to ATD (Association for Talent Development), companies that invest in comprehensive training see 218% higher income per employee. An ROI of 100%+ is considered excellent for training programs." },
  ],
  formula: "Training ROI = ((Total Benefits - Total Investment) / Total Investment) x 100 | Investment = Training Cost + Opportunity Cost",
};
