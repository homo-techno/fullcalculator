import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hraCalculator: CalculatorDefinition = {
  slug: "hra-calculator",
  title: "HRA Calculator",
  description:
    "Free HRA exemption calculator. Calculate House Rent Allowance tax exemption under Section 10(13A). Find out how much HRA is tax-free.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "HRA calculator",
    "HRA exemption calculator",
    "house rent allowance",
    "HRA tax exemption",
    "Section 10(13A)",
    "rent exemption calculator",
  ],
  variants: [
    {
      id: "basic",
      name: "HRA Exemption Calculator",
      description: "Calculate HRA tax exemption under Section 10(13A)",
      fields: [
        {
          name: "basicSalary",
          label: "Basic Salary (annual)",
          type: "number",
          placeholder: "e.g. 600000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "da",
          label: "Dearness Allowance (annual)",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "₹",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "hraReceived",
          label: "HRA Received (annual)",
          type: "number",
          placeholder: "e.g. 240000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "rentPaid",
          label: "Total Rent Paid (annual)",
          type: "number",
          placeholder: "e.g. 300000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "metro",
          label: "City Type",
          type: "select",
          options: [
            { label: "Metro (Delhi, Mumbai, Chennai, Kolkata)", value: "metro" },
            { label: "Non-Metro", value: "non-metro" },
          ],
          defaultValue: "metro",
        },
      ],
      calculate: (inputs) => {
        const basic = inputs.basicSalary as number;
        const da = (inputs.da as number) || 0;
        const hraReceived = inputs.hraReceived as number;
        const rentPaid = inputs.rentPaid as number;
        const metro = inputs.metro as string;
        if (!basic || !hraReceived || !rentPaid) return null;

        const salary = basic + da;
        const metroPercent = metro === "metro" ? 0.5 : 0.4;

        // HRA exemption = minimum of:
        // 1. Actual HRA received
        // 2. 50% (metro) or 40% (non-metro) of salary
        // 3. Rent paid - 10% of salary
        const option1 = hraReceived;
        const option2 = salary * metroPercent;
        const option3 = Math.max(0, rentPaid - salary * 0.1);

        const exemption = Math.min(option1, option2, option3);
        const taxableHRA = hraReceived - exemption;

        return {
          primary: { label: "HRA Exemption", value: `₹${formatNumber(exemption)}` },
          details: [
            { label: "Actual HRA received", value: `₹${formatNumber(option1)}` },
            {
              label: `${metro === "metro" ? "50%" : "40%"} of Basic + DA`,
              value: `₹${formatNumber(option2)}`,
            },
            { label: "Rent paid - 10% of salary", value: `₹${formatNumber(option3)}` },
            { label: "HRA exempted (minimum of above)", value: `₹${formatNumber(exemption)}` },
            { label: "Taxable HRA", value: `₹${formatNumber(taxableHRA)}` },
          ],
          note: "HRA exemption is the minimum of the three calculated amounts. Only available under the old tax regime.",
        };
      },
    },
    {
      id: "monthly",
      name: "Monthly HRA Details",
      description: "Calculate HRA exemption with monthly inputs",
      fields: [
        {
          name: "monthlyBasic",
          label: "Monthly Basic Salary",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "monthlyDA",
          label: "Monthly DA",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "₹",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "monthlyHRA",
          label: "Monthly HRA Received",
          type: "number",
          placeholder: "e.g. 20000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "monthlyRent",
          label: "Monthly Rent Paid",
          type: "number",
          placeholder: "e.g. 25000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "metro",
          label: "City Type",
          type: "select",
          options: [
            { label: "Metro (Delhi, Mumbai, Chennai, Kolkata)", value: "metro" },
            { label: "Non-Metro", value: "non-metro" },
          ],
          defaultValue: "metro",
        },
      ],
      calculate: (inputs) => {
        const monthlyBasic = inputs.monthlyBasic as number;
        const monthlyDA = (inputs.monthlyDA as number) || 0;
        const monthlyHRA = inputs.monthlyHRA as number;
        const monthlyRent = inputs.monthlyRent as number;
        const metro = inputs.metro as string;
        if (!monthlyBasic || !monthlyHRA || !monthlyRent) return null;

        const annualBasic = monthlyBasic * 12;
        const annualDA = monthlyDA * 12;
        const annualSalary = annualBasic + annualDA;
        const annualHRA = monthlyHRA * 12;
        const annualRent = monthlyRent * 12;
        const metroPercent = metro === "metro" ? 0.5 : 0.4;

        const option1 = annualHRA;
        const option2 = annualSalary * metroPercent;
        const option3 = Math.max(0, annualRent - annualSalary * 0.1);
        const exemption = Math.min(option1, option2, option3);
        const taxableHRA = annualHRA - exemption;
        const monthlyExemption = exemption / 12;

        return {
          primary: { label: "Monthly HRA Exemption", value: `₹${formatNumber(monthlyExemption)}` },
          details: [
            { label: "Annual HRA exemption", value: `₹${formatNumber(exemption)}` },
            { label: "Annual taxable HRA", value: `₹${formatNumber(taxableHRA)}` },
            { label: "Annual tax savings (30% slab)", value: `₹${formatNumber(exemption * 0.3)}` },
            { label: "Annual rent paid", value: `₹${formatNumber(annualRent)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["income-tax-india-calculator", "in-hand-salary-calculator", "tds-calculator"],
  faq: [
    {
      question: "How is HRA exemption calculated?",
      answer:
        "HRA exemption is the minimum of: (1) Actual HRA received, (2) 50% of salary (metro) or 40% (non-metro), (3) Rent paid minus 10% of salary. Salary here means Basic + DA.",
    },
    {
      question: "Can I claim HRA if I own a house?",
      answer:
        "Yes, you can claim HRA even if you own a house, as long as you are paying rent for another property where you live. However, you cannot claim HRA for rent paid to yourself or for a house you own and live in.",
    },
    {
      question: "Is HRA available under the new tax regime?",
      answer:
        "No, HRA exemption under Section 10(13A) is not available under the new tax regime. If you want to claim HRA, you need to opt for the old tax regime.",
    },
  ],
  formula: "HRA Exemption = min(HRA received, 50%/40% of salary, Rent - 10% of salary)",
};
