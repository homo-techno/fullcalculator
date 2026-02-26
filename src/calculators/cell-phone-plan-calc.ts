import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cellPhonePlanCalculator: CalculatorDefinition = {
  slug: "cell-phone-plan-calculator",
  title: "Cell Phone Plan Comparison Calculator",
  description:
    "Free cell phone plan comparison calculator. Compare monthly costs of different phone plans including data, device payments, and family plan savings.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "cell phone plan calculator",
    "phone plan comparison",
    "mobile plan cost",
    "phone bill calculator",
    "family plan savings",
  ],
  variants: [
    {
      id: "single-plan",
      name: "Single Plan Cost",
      description: "Calculate total monthly cost for a single phone line",
      fields: [
        {
          name: "basePlan",
          label: "Base Plan Cost (monthly)",
          type: "number",
          placeholder: "e.g. 70",
          prefix: "$",
          min: 10,
          max: 150,
          step: 5,
          defaultValue: 70,
        },
        {
          name: "devicePayment",
          label: "Monthly Device Payment",
          type: "number",
          placeholder: "e.g. 30",
          prefix: "$",
          min: 0,
          max: 80,
          step: 1,
          defaultValue: 30,
        },
        {
          name: "insurance",
          label: "Device Insurance/Protection",
          type: "number",
          placeholder: "e.g. 15",
          prefix: "$",
          min: 0,
          max: 25,
          step: 1,
          defaultValue: 15,
        },
        {
          name: "taxes",
          label: "Estimated Tax Rate",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "%",
          min: 0,
          max: 30,
          step: 1,
          defaultValue: 15,
        },
      ],
      calculate: (inputs) => {
        const base = parseFloat(inputs.basePlan as string);
        const device = parseFloat(inputs.devicePayment as string);
        const insurance = parseFloat(inputs.insurance as string);
        const taxRate = parseFloat(inputs.taxes as string);
        if (!base) return null;

        const subtotal = base + (device || 0) + (insurance || 0);
        const taxes = subtotal * ((taxRate || 0) / 100);
        const totalMonthly = subtotal + taxes;
        const totalYearly = totalMonthly * 12;
        const deviceTotal = (device || 0) * 24; // typical 24-month payment

        return {
          primary: { label: "Total Monthly Cost", value: `$${formatNumber(totalMonthly)}` },
          details: [
            { label: "Base Plan", value: `$${formatNumber(base)}` },
            { label: "Device Payment", value: `$${formatNumber(device || 0)}` },
            { label: "Insurance", value: `$${formatNumber(insurance || 0)}` },
            { label: "Taxes & Fees", value: `$${formatNumber(taxes)}` },
            { label: "Yearly Cost", value: `$${formatNumber(totalYearly)}` },
            { label: "Device Total (24 mo)", value: `$${formatNumber(deviceTotal)}` },
          ],
        };
      },
    },
    {
      id: "family-plan",
      name: "Family Plan Comparison",
      description: "Compare individual vs family plan costs",
      fields: [
        {
          name: "numLines",
          label: "Number of Lines",
          type: "number",
          placeholder: "e.g. 4",
          min: 2,
          max: 8,
          step: 1,
          defaultValue: 4,
        },
        {
          name: "individualCost",
          label: "Individual Plan Cost per Line",
          type: "number",
          placeholder: "e.g. 75",
          prefix: "$",
          min: 20,
          max: 150,
          step: 5,
          defaultValue: 75,
        },
        {
          name: "familyFirstLine",
          label: "Family Plan First Line Cost",
          type: "number",
          placeholder: "e.g. 75",
          prefix: "$",
          min: 20,
          max: 150,
          step: 5,
          defaultValue: 75,
        },
        {
          name: "familyAdditionalLine",
          label: "Family Plan Additional Line Cost",
          type: "number",
          placeholder: "e.g. 30",
          prefix: "$",
          min: 10,
          max: 100,
          step: 5,
          defaultValue: 30,
        },
      ],
      calculate: (inputs) => {
        const lines = parseFloat(inputs.numLines as string);
        const indCost = parseFloat(inputs.individualCost as string);
        const famFirst = parseFloat(inputs.familyFirstLine as string);
        const famAdd = parseFloat(inputs.familyAdditionalLine as string);
        if (!lines || !indCost || !famFirst || !famAdd) return null;

        const individualTotal = lines * indCost;
        const familyTotal = famFirst + (lines - 1) * famAdd;
        const monthlySavings = individualTotal - familyTotal;
        const yearlySavings = monthlySavings * 12;
        const familyPerLine = familyTotal / lines;

        return {
          primary: { label: "Family Plan Saves", value: `$${formatNumber(monthlySavings)}/mo` },
          details: [
            { label: "Individual Plans Total", value: `$${formatNumber(individualTotal)}/mo` },
            { label: "Family Plan Total", value: `$${formatNumber(familyTotal)}/mo` },
            { label: "Family Per-Line Cost", value: `$${formatNumber(familyPerLine)}/mo` },
            { label: "Yearly Savings", value: `$${formatNumber(yearlySavings)}` },
            { label: "Number of Lines", value: formatNumber(lines, 0) },
          ],
          note: monthlySavings > 0
            ? "Family plans are typically 25-40% cheaper per line than individual plans."
            : "In this scenario, individual plans may be more cost-effective. Consider MVNO options too.",
        };
      },
    },
    {
      id: "prepaid-vs-postpaid",
      name: "Prepaid vs Postpaid",
      description: "Compare prepaid (MVNO) vs postpaid major carrier",
      fields: [
        {
          name: "postpaidCost",
          label: "Postpaid Plan Monthly Cost",
          type: "number",
          placeholder: "e.g. 85",
          prefix: "$",
          min: 20,
          max: 200,
          step: 5,
          defaultValue: 85,
        },
        {
          name: "prepaidCost",
          label: "Prepaid/MVNO Monthly Cost",
          type: "number",
          placeholder: "e.g. 35",
          prefix: "$",
          min: 10,
          max: 100,
          step: 5,
          defaultValue: 35,
        },
        {
          name: "years",
          label: "Comparison Period",
          type: "select",
          options: [
            { label: "1 year", value: "1" },
            { label: "2 years", value: "2" },
            { label: "3 years", value: "3" },
            { label: "5 years", value: "5" },
          ],
          defaultValue: "2",
        },
      ],
      calculate: (inputs) => {
        const postpaid = parseFloat(inputs.postpaidCost as string);
        const prepaid = parseFloat(inputs.prepaidCost as string);
        const years = parseFloat(inputs.years as string);
        if (!postpaid || !prepaid || !years) return null;

        const postpaidTotal = postpaid * 12 * years;
        const prepaidTotal = prepaid * 12 * years;
        const totalSavings = postpaidTotal - prepaidTotal;
        const monthlySavings = postpaid - prepaid;

        return {
          primary: { label: `${years}-Year Savings`, value: `$${formatNumber(totalSavings)}` },
          details: [
            { label: "Monthly Savings", value: `$${formatNumber(monthlySavings)}` },
            { label: "Postpaid Total", value: `$${formatNumber(postpaidTotal)}` },
            { label: "Prepaid Total", value: `$${formatNumber(prepaidTotal)}` },
            { label: "Savings per Year", value: `$${formatNumber(totalSavings / years)}` },
          ],
          note: "Prepaid/MVNO plans often use the same networks as major carriers. Trade-offs may include limited international roaming and phone financing options.",
        };
      },
    },
  ],
  relatedSlugs: ["streaming-cost-compare-calculator", "subscription-audit-calculator"],
  faq: [
    {
      question: "How can I lower my cell phone bill?",
      answer:
        "Consider switching to an MVNO (Mobile Virtual Network Operator) like Mint Mobile, Visible, or Cricket which use major carrier networks at lower prices. Family plans, autopay discounts, and bringing your own device also save money.",
    },
    {
      question: "What is the average cell phone bill?",
      answer:
        "The average US cell phone bill is $75-$100 per month for a single line with a major carrier. This includes the plan, device payment, insurance, and taxes. Budget carriers and MVNOs can reduce this to $25-$45 per month.",
    },
  ],
  formula:
    "Total Monthly = Base Plan + Device Payment + Insurance + Taxes | Family Savings = (Individual x Lines) - (First Line + Additional x (Lines - 1))",
};
