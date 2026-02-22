import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gratuityCalculator: CalculatorDefinition = {
  slug: "gratuity-calculator",
  title: "Gratuity Calculator",
  description:
    "Free gratuity calculator. Calculate gratuity amount based on the Payment of Gratuity Act, 1972. Works for government, private sector, and contract employees.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "gratuity calculator",
    "gratuity calculation",
    "gratuity amount",
    "gratuity formula India",
    "employee gratuity",
    "gratuity act",
  ],
  variants: [
    {
      id: "covered",
      name: "Covered Under Gratuity Act",
      description: "For employees covered under the Payment of Gratuity Act (most organizations with 10+ employees)",
      fields: [
        {
          name: "lastSalary",
          label: "Last Drawn Basic + DA (monthly)",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "years",
          label: "Years of Service",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "years",
          min: 5,
          max: 50,
        },
      ],
      calculate: (inputs) => {
        const lastSalary = inputs.lastSalary as number;
        const years = inputs.years as number;
        if (!lastSalary || !years) return null;

        // Gratuity = (Last salary × 15 × Years of service) / 26
        const gratuity = (lastSalary * 15 * years) / 26;
        const maxGratuity = 2000000; // ₹20 lakh tax-free limit
        const taxableGratuity = Math.max(0, gratuity - maxGratuity);

        return {
          primary: { label: "Gratuity Amount", value: `₹${formatNumber(gratuity)}` },
          details: [
            { label: "Last drawn salary (Basic + DA)", value: `₹${formatNumber(lastSalary)}` },
            { label: "Years of service", value: `${years} years` },
            { label: "Tax-free limit", value: `₹${formatNumber(maxGratuity)}` },
            {
              label: "Taxable gratuity (above ₹20 lakh)",
              value: `₹${formatNumber(taxableGratuity)}`,
            },
          ],
          note: "Minimum 5 years of continuous service required. Gratuity up to ₹20 lakh is tax-free for employees covered under the Act.",
        };
      },
    },
    {
      id: "not-covered",
      name: "Not Covered Under Gratuity Act",
      description: "For employees not covered under the Payment of Gratuity Act",
      fields: [
        {
          name: "lastSalary",
          label: "Last Drawn Basic + DA (monthly)",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "years",
          label: "Years of Service",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "years",
          min: 5,
          max: 50,
        },
      ],
      calculate: (inputs) => {
        const lastSalary = inputs.lastSalary as number;
        const years = inputs.years as number;
        if (!lastSalary || !years) return null;

        // Gratuity = (Last salary × 15 × Years of service) / 30
        const gratuity = (lastSalary * 15 * years) / 30;
        const halfMonthSalary = lastSalary / 2;

        return {
          primary: { label: "Gratuity Amount", value: `₹${formatNumber(gratuity)}` },
          details: [
            { label: "Last drawn salary (Basic + DA)", value: `₹${formatNumber(lastSalary)}` },
            { label: "Years of service", value: `${years} years` },
            { label: "Half-month salary per year", value: `₹${formatNumber(halfMonthSalary)}` },
          ],
          note: "For employees not covered under the Act, gratuity = half month's salary for each completed year of service. Tax exemption limits may differ.",
        };
      },
    },
  ],
  relatedSlugs: ["in-hand-salary-calculator", "epf-calculator", "retirement-calculator"],
  faq: [
    {
      question: "What is gratuity?",
      answer:
        "Gratuity is a lump sum payment made by an employer to an employee as a token of appreciation for services rendered. Under the Payment of Gratuity Act, 1972, it is mandatory for organizations with 10 or more employees.",
    },
    {
      question: "How is gratuity calculated?",
      answer:
        "For employees covered under the Gratuity Act: Gratuity = (Last drawn salary × 15 × Years of service) / 26. Here, 15 represents 15 days' wages and 26 represents working days in a month. For non-covered employees, the denominator is 30.",
    },
    {
      question: "What is the minimum service for gratuity?",
      answer:
        "An employee must complete a minimum of 5 years of continuous service to be eligible for gratuity. However, in case of death or disability, the 5-year condition is waived.",
    },
  ],
  formula: "Gratuity = (Last Salary × 15 × Years of Service) / 26",
};
