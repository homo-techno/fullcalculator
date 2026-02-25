import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pensionVsLumpSumCalculator: CalculatorDefinition = {
  slug: "pension-vs-lump-sum-calculator",
  title: "Pension vs Lump Sum Calculator",
  description:
    "Compare taking a pension annuity vs a lump sum distribution. Calculate break-even points and determine which option maximizes your retirement income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pension", "lump sum", "pension buyout", "annuity vs lump sum", "retirement payout"],
  variants: [
    {
      id: "comparison",
      name: "Pension vs Lump Sum",
      fields: [
        { name: "monthlyPension", label: "Monthly Pension Amount ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "lumpSum", label: "Lump Sum Offer ($)", type: "number", placeholder: "e.g. 500000" },
        { name: "currentAge", label: "Current Age", type: "number", placeholder: "e.g. 62" },
        { name: "lifeExpectancy", label: "Life Expectancy", type: "number", placeholder: "e.g. 85" },
        { name: "investmentReturn", label: "Lump Sum Investment Return (%)", type: "number", placeholder: "e.g. 6" },
        { name: "inflationRate", label: "Inflation Rate (%)", type: "number", placeholder: "e.g. 3" },
        { name: "pensionCOLA", label: "Pension COLA (%)", type: "number", placeholder: "e.g. 0" },
      ],
      calculate: (inputs) => {
        const monthlyPension = inputs.monthlyPension as number;
        const lumpSum = inputs.lumpSum as number;
        const currentAge = inputs.currentAge as number;
        const lifeExpectancy = inputs.lifeExpectancy as number;
        const investmentReturn = (inputs.investmentReturn as number) / 100;
        const inflationRate = (inputs.inflationRate as number) / 100;
        const pensionCOLA = (inputs.pensionCOLA as number) / 100;

        if (!monthlyPension || !lumpSum || !currentAge || !lifeExpectancy) return null;

        const years = lifeExpectancy - currentAge;

        // Total pension payments
        let totalPension = 0;
        let pvPension = 0;
        for (let i = 0; i < years; i++) {
          const annualPension = monthlyPension * 12 * Math.pow(1 + pensionCOLA, i);
          totalPension += annualPension;
          pvPension += annualPension / Math.pow(1 + inflationRate, i);
        }

        // Lump sum growth with withdrawals matching pension
        let lumpBalance = lumpSum;
        let lumpSumLasts = years;
        const monthlyReturn = investmentReturn / 12;

        for (let month = 0; month < years * 12; month++) {
          const year = Math.floor(month / 12);
          const monthlyWithdrawal = monthlyPension * Math.pow(1 + pensionCOLA, year);
          lumpBalance = lumpBalance * (1 + monthlyReturn) - monthlyWithdrawal;
          if (lumpBalance <= 0) {
            lumpSumLasts = month / 12;
            break;
          }
        }

        const breakEvenYears = totalPension > 0 ? lumpSum / (monthlyPension * 12) : 0;
        const impliedReturn = years > 0 ? (Math.pow(totalPension / lumpSum, 1 / years) - 1) * 100 : 0;

        return {
          primary: { label: "Total Pension Payments", value: `$${formatNumber(totalPension, 0)}` },
          details: [
            { label: "Lump Sum Offered", value: `$${formatNumber(lumpSum, 0)}` },
            { label: "Pension Advantage", value: `$${formatNumber(totalPension - lumpSum, 0)}` },
            { label: "Simple Break-Even", value: `${formatNumber(breakEvenYears, 1)} years (age ${formatNumber(currentAge + breakEvenYears, 0)})` },
            { label: "Lump Sum Lasts (matching pension withdrawals)", value: `${formatNumber(lumpSumLasts, 1)} years` },
            { label: "Present Value of Pension", value: `$${formatNumber(pvPension, 0)}` },
            { label: "Remaining Lump Sum at Life Expectancy", value: lumpBalance > 0 ? `$${formatNumber(lumpBalance, 0)}` : "Depleted" },
          ],
        };
      },
    },
    {
      id: "survivorBenefit",
      name: "With Survivor Benefit",
      fields: [
        { name: "singleLifePension", label: "Single Life Monthly Pension ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "jointSurvivorPension", label: "Joint & Survivor Monthly Pension ($)", type: "number", placeholder: "e.g. 2400" },
        { name: "survivorPercent", label: "Survivor Benefit (%)", type: "number", placeholder: "e.g. 50" },
        { name: "lumpSum", label: "Lump Sum Offer ($)", type: "number", placeholder: "e.g. 500000" },
        { name: "retireeAge", label: "Retiree Age", type: "number", placeholder: "e.g. 65" },
        { name: "spouseAge", label: "Spouse Age", type: "number", placeholder: "e.g. 62" },
        { name: "retireeLifeExpectancy", label: "Retiree Life Expectancy", type: "number", placeholder: "e.g. 85" },
        { name: "spouseLifeExpectancy", label: "Spouse Life Expectancy", type: "number", placeholder: "e.g. 90" },
      ],
      calculate: (inputs) => {
        const singleLifePension = inputs.singleLifePension as number;
        const jointSurvivorPension = inputs.jointSurvivorPension as number;
        const survivorPercent = (inputs.survivorPercent as number) / 100;
        const lumpSum = inputs.lumpSum as number;
        const retireeAge = inputs.retireeAge as number;
        const retireeLifeExpectancy = inputs.retireeLifeExpectancy as number;
        const spouseLifeExpectancy = inputs.spouseLifeExpectancy as number;
        const spouseAge = inputs.spouseAge as number;

        if (!singleLifePension || !jointSurvivorPension || !lumpSum || !retireeAge) return null;

        const retireeYears = retireeLifeExpectancy - retireeAge;
        const spouseSurvivorYears = Math.max((spouseLifeExpectancy - spouseAge) - retireeYears, 0);

        const singleLifeTotal = singleLifePension * 12 * retireeYears;
        const jointTotal = jointSurvivorPension * 12 * retireeYears +
          jointSurvivorPension * survivorPercent * 12 * spouseSurvivorYears;

        const costOfSurvivor = singleLifeTotal - (jointSurvivorPension * 12 * retireeYears);
        const survivorBenefitValue = jointSurvivorPension * survivorPercent * 12 * spouseSurvivorYears;

        return {
          primary: { label: "Joint & Survivor Total Benefits", value: `$${formatNumber(jointTotal, 0)}` },
          details: [
            { label: "Single Life Total", value: `$${formatNumber(singleLifeTotal, 0)}` },
            { label: "Lump Sum", value: `$${formatNumber(lumpSum, 0)}` },
            { label: "Monthly Cost of Survivor Benefit", value: `$${formatNumber(singleLifePension - jointSurvivorPension, 2)}` },
            { label: "Survivor Benefit Total Value", value: `$${formatNumber(survivorBenefitValue, 0)}` },
            { label: "Annual Cost of Survivor Option", value: `$${formatNumber(costOfSurvivor / retireeYears, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pension-calculator", "annuity-payout-calculator", "retirement-income-calculator", "annuity-calculator"],
  faq: [
    { question: "Should I take the pension or lump sum?", answer: "It depends on your life expectancy, investment ability, need for flexibility, and desire to leave an inheritance. The pension provides guaranteed income for life, while the lump sum offers flexibility and potential inheritance value." },
    { question: "What is a break-even point?", answer: "The break-even point is the age at which total pension payments equal the lump sum amount. If you live beyond this age, the pension was the better financial choice. Before this age, the lump sum would have been better." },
  ],
  formula: "Break-Even = Lump Sum / Annual Pension; Total Pension = Monthly × 12 × Years × COLA adjustments",
};
