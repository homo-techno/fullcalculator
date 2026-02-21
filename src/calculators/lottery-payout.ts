import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lotteryPayoutCalculator: CalculatorDefinition = {
  slug: "lottery-payout-calculator",
  title: "Lottery Payout Calculator",
  description:
    "Free lottery payout calculator. Compare lump sum vs annuity payouts after taxes for lottery winnings like Powerball and Mega Millions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "lottery payout calculator",
    "lump sum vs annuity",
    "lottery tax calculator",
    "Powerball payout",
    "Mega Millions payout",
    "lottery winnings after tax",
  ],
  variants: [
    {
      id: "lump-vs-annuity",
      name: "Lump Sum vs Annuity",
      description: "Compare lump sum vs annuity payout options for lottery winnings",
      fields: [
        {
          name: "jackpot",
          label: "Advertised Jackpot ($)",
          type: "number",
          placeholder: "e.g. 500000000",
          prefix: "$",
          min: 1000,
        },
        {
          name: "lumpSumPercent",
          label: "Lump Sum Percentage",
          type: "number",
          placeholder: "e.g. 60",
          suffix: "%",
          min: 40,
          max: 80,
          defaultValue: 60,
        },
        {
          name: "federalTax",
          label: "Federal Tax Rate (%)",
          type: "select",
          options: [
            { label: "24% (standard withholding)", value: "24" },
            { label: "37% (top marginal rate)", value: "37" },
          ],
          defaultValue: "37",
        },
        {
          name: "stateTax",
          label: "State Tax Rate (%)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
          max: 15,
          step: 0.1,
          defaultValue: 5,
        },
        {
          name: "annuityYears",
          label: "Annuity Period (years)",
          type: "number",
          placeholder: "e.g. 30",
          defaultValue: 30,
          min: 10,
          max: 40,
        },
        {
          name: "investmentReturn",
          label: "Investment Return Rate (% if lump sum invested)",
          type: "number",
          placeholder: "e.g. 7",
          min: 0,
          max: 15,
          step: 0.5,
          defaultValue: 7,
        },
      ],
      calculate: (inputs) => {
        const jackpot = inputs.jackpot as number;
        const lumpPct = ((inputs.lumpSumPercent as number) || 60) / 100;
        const fedTax = parseFloat(inputs.federalTax as string) / 100;
        const stateTax = ((inputs.stateTax as number) || 0) / 100;
        const annuityYears = (inputs.annuityYears as number) || 30;
        const investReturn = ((inputs.investmentReturn as number) || 7) / 100;

        if (!jackpot || jackpot <= 0) return null;

        const totalTaxRate = fedTax + stateTax;

        // Lump sum option
        const lumpSumGross = jackpot * lumpPct;
        const lumpSumTaxes = lumpSumGross * totalTaxRate;
        const lumpSumNet = lumpSumGross - lumpSumTaxes;

        // Annuity option (payments increase ~5% per year for Powerball/MegaMillions)
        const annualGrowth = 0.05;
        let totalAnnuityGross = 0;
        let totalAnnuityNet = 0;
        const firstPayment = jackpot / ((Math.pow(1 + annualGrowth, annuityYears) - 1) / annualGrowth);
        for (let i = 0; i < annuityYears; i++) {
          const payment = firstPayment * Math.pow(1 + annualGrowth, i);
          const netPayment = payment * (1 - totalTaxRate);
          totalAnnuityGross += payment;
          totalAnnuityNet += netPayment;
        }

        const annualAnnuityNet = totalAnnuityNet / annuityYears;

        // Lump sum invested over annuity period
        const lumpInvested = lumpSumNet * Math.pow(1 + investReturn, annuityYears);

        const betterOption = lumpInvested > totalAnnuityNet ? "Lump Sum (invested)" : "Annuity";

        return {
          primary: { label: "Lump Sum After Tax", value: "$" + formatNumber(lumpSumNet, 0) },
          details: [
            { label: "Advertised Jackpot", value: "$" + formatNumber(jackpot, 0) },
            { label: "Lump Sum (gross)", value: "$" + formatNumber(lumpSumGross, 0) },
            { label: "Total Tax Rate", value: formatNumber(totalTaxRate * 100, 1) + "%" },
            { label: "Lump Sum Taxes", value: "$" + formatNumber(lumpSumTaxes, 0) },
            { label: "Lump Sum (net)", value: "$" + formatNumber(lumpSumNet, 0) },
            { label: "Annuity Total (net, " + annuityYears + " yrs)", value: "$" + formatNumber(totalAnnuityNet, 0) },
            { label: "Annuity Avg Annual (net)", value: "$" + formatNumber(annualAnnuityNet, 0) + "/yr" },
            { label: "Lump Sum Invested (" + annuityYears + " yrs @ " + formatNumber(investReturn * 100, 0) + "%)", value: "$" + formatNumber(lumpInvested, 0) },
            { label: "Better Financial Option", value: betterOption },
          ],
          note: "This is an estimate. Actual tax withholding and rates vary by state. Consult a financial advisor for large winnings.",
        };
      },
    },
    {
      id: "after-tax",
      name: "Quick After-Tax Winnings",
      description: "Quickly see what you take home after taxes on any prize amount",
      fields: [
        {
          name: "winnings",
          label: "Prize Amount ($)",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          min: 1,
        },
        {
          name: "federalTax",
          label: "Federal Tax Rate (%)",
          type: "select",
          options: [
            { label: "0% (under $600)", value: "0" },
            { label: "24% (standard withholding)", value: "24" },
            { label: "32%", value: "32" },
            { label: "37% (top rate)", value: "37" },
          ],
          defaultValue: "24",
        },
        {
          name: "stateTax",
          label: "State Tax (%)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
          max: 15,
          step: 0.1,
          defaultValue: 5,
        },
      ],
      calculate: (inputs) => {
        const winnings = inputs.winnings as number;
        const fedRate = parseFloat(inputs.federalTax as string) / 100;
        const stateRate = ((inputs.stateTax as number) || 0) / 100;
        if (!winnings || winnings <= 0) return null;

        const fedTax = winnings * fedRate;
        const stateTaxAmt = winnings * stateRate;
        const totalTax = fedTax + stateTaxAmt;
        const afterTax = winnings - totalTax;

        return {
          primary: { label: "After-Tax Winnings", value: "$" + formatNumber(afterTax, 0) },
          details: [
            { label: "Gross Winnings", value: "$" + formatNumber(winnings, 0) },
            { label: "Federal Tax", value: "$" + formatNumber(fedTax, 0) + ` (${formatNumber(fedRate * 100, 0)}%)` },
            { label: "State Tax", value: "$" + formatNumber(stateTaxAmt, 0) + ` (${formatNumber(stateRate * 100, 1)}%)` },
            { label: "Total Taxes", value: "$" + formatNumber(totalTax, 0) },
            { label: "Effective Take-Home", value: formatNumber((afterTax / winnings) * 100, 1) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["lottery-odds-calculator", "sports-betting-odds-calculator", "tax-calculator"],
  faq: [
    {
      question: "Should I take the lump sum or annuity?",
      answer:
        "It depends on your financial discipline and investment skill. The lump sum is typically about 60% of the advertised jackpot. If invested wisely, it can grow to more than the annuity total. However, the annuity provides guaranteed income and protects against overspending.",
    },
    {
      question: "How much tax do you pay on lottery winnings?",
      answer:
        "Federal tax on lottery winnings over $5,000 is withheld at 24%, but the top marginal rate of 37% applies to most large jackpots. State taxes range from 0% (states with no income tax) to over 10%. You may owe additional federal tax when filing.",
    },
    {
      question: "What states have no lottery tax?",
      answer:
        "States with no state income tax on lottery winnings include: Florida, Texas, Tennessee, South Dakota, Wyoming, Washington, New Hampshire, and Alaska. California and Delaware do not tax lottery winnings specifically.",
    },
  ],
  formula:
    "Lump Sum = Jackpot x Lump% | After Tax = Gross - (Gross x (Federal% + State%)) | Annuity Payment(n) = Base x 1.05^n | Invested Lump = Net x (1 + return)^years",
};
