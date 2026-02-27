import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const solarTaxCreditCalculator: CalculatorDefinition = {
  slug: "solar-tax-credit-calculator",
  title: "Solar Tax Credit Calculator",
  description:
    "Calculate your federal 30% Investment Tax Credit (ITC) and state solar incentives. See how much you can save on a solar installation with available tax credits and rebates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "solar tax credit",
    "solar itc",
    "federal solar credit",
    "30 percent solar credit",
    "solar incentives",
    "ira solar credit",
  ],
  variants: [
    {
      id: "residential",
      name: "Residential Solar Credit",
      description: "Federal ITC + state incentives for home solar",
      fields: [
        { name: "systemCost", label: "Total Solar System Cost ($)", type: "number", placeholder: "e.g. 25000" },
        { name: "batteryCost", label: "Battery Storage Cost ($)", type: "number", placeholder: "e.g. 10000" },
        {
          name: "installYear",
          label: "Installation Year",
          type: "select",
          options: [
            { label: "2022-2032 (30% ITC)", value: "30" },
            { label: "2033 (26% ITC)", value: "26" },
            { label: "2034 (22% ITC)", value: "22" },
          ],
          defaultValue: "30",
        },
        { name: "stateCredit", label: "State Tax Credit ($)", type: "number", placeholder: "e.g. 2000" },
        { name: "utilityRebate", label: "Utility Rebate ($)", type: "number", placeholder: "e.g. 1000" },
        { name: "srecValue", label: "SREC First-Year Value ($)", type: "number", placeholder: "e.g. 300" },
        { name: "federalTaxLiability", label: "Federal Tax Liability ($)", type: "number", placeholder: "e.g. 10000" },
      ],
      calculate: (inputs) => {
        const systemCost = parseFloat(inputs.systemCost as string);
        const batteryCost = parseFloat(inputs.batteryCost as string) || 0;
        const itcRate = parseFloat(inputs.installYear as string);
        const stateCredit = parseFloat(inputs.stateCredit as string) || 0;
        const utilityRebate = parseFloat(inputs.utilityRebate as string) || 0;
        const srecValue = parseFloat(inputs.srecValue as string) || 0;
        const federalTaxLiability = parseFloat(inputs.federalTaxLiability as string);

        if (!systemCost || !federalTaxLiability) return null;

        const totalEligible = systemCost + batteryCost;
        const federalItc = totalEligible * (itcRate / 100);
        const usableItc = Math.min(federalItc, federalTaxLiability);
        const carryForward = federalItc - usableItc;
        const totalIncentives = usableItc + stateCredit + utilityRebate;
        const netCost = totalEligible - totalIncentives;
        const firstYearTotal = totalIncentives + srecValue;
        const effectiveDiscount = (totalIncentives / totalEligible) * 100;

        return {
          primary: {
            label: "Total First-Year Incentives",
            value: `$${formatNumber(firstYearTotal, 2)}`,
          },
          details: [
            { label: "Eligible Cost (Solar + Battery)", value: `$${formatNumber(totalEligible, 2)}` },
            { label: `Federal ITC (${itcRate}%)`, value: `$${formatNumber(federalItc, 2)}` },
            { label: "Usable This Year", value: `$${formatNumber(usableItc, 2)}` },
            ...(carryForward > 0 ? [{ label: "Carry Forward to Next Year", value: `$${formatNumber(carryForward, 2)}` }] : []),
            { label: "State Tax Credit", value: `$${formatNumber(stateCredit, 2)}` },
            { label: "Utility Rebate", value: `$${formatNumber(utilityRebate, 2)}` },
            { label: "SREC Income (Year 1)", value: `$${formatNumber(srecValue, 2)}` },
            { label: "Net System Cost", value: `$${formatNumber(netCost, 2)}` },
            { label: "Effective Discount", value: `${formatNumber(effectiveDiscount, 1)}%` },
          ],
          note: carryForward > 0
            ? `Your tax liability is less than the ITC. $${formatNumber(carryForward, 2)} can be carried forward to next tax year.`
            : "The federal ITC is a tax credit (not a deduction), directly reducing your tax bill dollar-for-dollar.",
        };
      },
    },
    {
      id: "costPerWatt",
      name: "Cost Per Watt After Credits",
      fields: [
        { name: "systemCost", label: "System Cost ($)", type: "number", placeholder: "e.g. 25000" },
        { name: "systemSizeW", label: "System Size (watts)", type: "number", placeholder: "e.g. 8000" },
        { name: "totalIncentives", label: "Total Incentives ($)", type: "number", placeholder: "e.g. 9000" },
      ],
      calculate: (inputs) => {
        const systemCost = parseFloat(inputs.systemCost as string);
        const systemSizeW = parseFloat(inputs.systemSizeW as string);
        const totalIncentives = parseFloat(inputs.totalIncentives as string) || 0;

        if (!systemCost || !systemSizeW) return null;

        const grossCpw = systemCost / systemSizeW;
        const netCost = systemCost - totalIncentives;
        const netCpw = netCost / systemSizeW;

        return {
          primary: { label: "Net Cost Per Watt", value: `$${formatNumber(netCpw, 2)}` },
          details: [
            { label: "Gross Cost Per Watt", value: `$${formatNumber(grossCpw, 2)}` },
            { label: "Total Incentives", value: `$${formatNumber(totalIncentives, 2)}` },
            { label: "Net System Cost", value: `$${formatNumber(netCost, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["solar-payback-period-calculator", "home-solar-loan-calculator", "solar-battery-payback-calculator"],
  faq: [
    {
      question: "What qualifies for the federal solar tax credit?",
      answer:
        "The federal ITC covers solar panels, inverters, racking, wiring, battery storage, and installation labor. The system must be installed at your primary or secondary US residence. Rental properties don't qualify for the residential credit but may qualify for the commercial ITC.",
    },
    {
      question: "Can I claim the solar tax credit on battery storage?",
      answer:
        "Yes! Under the Inflation Reduction Act, standalone battery storage qualifies for the 30% ITC even without solar panels. Previously, batteries had to be charged primarily by solar to qualify. This makes adding a home battery more financially attractive.",
    },
    {
      question: "What happens if I can't use all of my solar tax credit in one year?",
      answer:
        "The federal solar ITC can be carried forward to future tax years. If your tax liability is less than the credit amount, the unused portion can offset taxes in subsequent years. Consult a tax professional for specific carry-forward rules.",
    },
  ],
  formula:
    "Federal ITC = (Solar Cost + Battery Cost) × ITC Rate; Total Incentives = Federal ITC + State Credit + Utility Rebate; Net Cost = Total System Cost − Total Incentives",
};
