import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gigVsW2Calculator: CalculatorDefinition = {
  slug: "gig-vs-w2-calculator",
  title: "Gig Work vs W-2 Job Calculator",
  description:
    "Compare true take-home pay between gig/freelance work and a traditional W-2 job. Account for SE taxes, benefits, and hidden costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "gig vs W-2 calculator",
    "freelance vs salary comparison",
    "self-employed vs employee income",
    "gig work take-home pay",
    "contractor vs employee calculator",
  ],
  variants: [
    {
      id: "compare",
      name: "Gig vs W-2 Comparison",
      description: "Compare net income between gig and traditional employment",
      fields: [
        {
          name: "gigAnnualGross",
          label: "Annual Gig / Freelance Revenue",
          type: "number",
          placeholder: "e.g. 60000",
          prefix: "$",
        },
        {
          name: "gigExpenses",
          label: "Annual Gig Business Expenses",
          type: "number",
          placeholder: "e.g. 10000",
          prefix: "$",
          defaultValue: 8000,
        },
        {
          name: "w2Salary",
          label: "Equivalent W-2 Salary",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
        },
        {
          name: "employerBenefits",
          label: "Annual Employer Benefits Value",
          type: "select",
          options: [
            { label: "No benefits (contract/small co.)", value: "0" },
            { label: "Basic ($5,000 — health only)", value: "5000" },
            { label: "Standard ($12,000 — health + 401k match)", value: "12000" },
            { label: "Full ($20,000 — health + dental + 401k)", value: "20000" },
          ],
          defaultValue: "12000",
        },
        {
          name: "gigHealthInsurance",
          label: "Monthly Health Insurance (self-paid)",
          type: "number",
          placeholder: "e.g. 400",
          prefix: "$",
          defaultValue: 400,
        },
      ],
      calculate: (inputs) => {
        const gigGross = parseFloat(inputs.gigAnnualGross as string) || 0;
        const gigExpenses = parseFloat(inputs.gigExpenses as string) || 0;
        const w2Salary = parseFloat(inputs.w2Salary as string) || 0;
        const benefits = parseFloat(inputs.employerBenefits as string) || 12000;
        const healthMonthly = parseFloat(inputs.gigHealthInsurance as string) || 400;

        // GIG side
        const gigNet = gigGross - gigExpenses;
        const seTax = gigNet > 0 ? gigNet * 0.9235 * 0.153 : 0;
        const seDeduction = seTax / 2;
        const gigHealthAnnual = healthMonthly * 12;
        const gigTaxableIncome = Math.max(0, gigNet - seDeduction - gigHealthAnnual - 14600);
        let gigIncomeTax = 0;
        if (gigTaxableIncome > 100525) gigIncomeTax = 17168 + (gigTaxableIncome - 100525) * 0.24;
        else if (gigTaxableIncome > 47150) gigIncomeTax = 5147 + (gigTaxableIncome - 47150) * 0.22;
        else if (gigTaxableIncome > 23200) gigIncomeTax = 1160 + (gigTaxableIncome - 23200) * 0.12;
        else if (gigTaxableIncome > 11600) gigIncomeTax = (gigTaxableIncome - 11600) * 0.10;
        const gigTakeHome = gigNet - seTax - gigIncomeTax - gigHealthAnnual;

        // W-2 side
        const fica = w2Salary * 0.0765; // employee FICA
        const w2TaxableIncome = Math.max(0, w2Salary - 14600);
        let w2IncomeTax = 0;
        if (w2TaxableIncome > 100525) w2IncomeTax = 17168 + (w2TaxableIncome - 100525) * 0.24;
        else if (w2TaxableIncome > 47150) w2IncomeTax = 5147 + (w2TaxableIncome - 47150) * 0.22;
        else if (w2TaxableIncome > 23200) w2IncomeTax = 1160 + (w2TaxableIncome - 23200) * 0.12;
        else if (w2TaxableIncome > 11600) w2IncomeTax = (w2TaxableIncome - 11600) * 0.10;
        const w2TakeHome = w2Salary - fica - w2IncomeTax;
        const w2TotalValue = w2TakeHome + benefits;

        const difference = gigTakeHome - w2TakeHome;
        const breakEvenGig = w2Salary + benefits + gigHealthAnnual + (gigExpenses * 0.7);

        return {
          primary: { label: "Gig Take-Home Advantage", value: difference >= 0 ? `+$${formatNumber(difference, 0)}/yr` : `-$${formatNumber(Math.abs(difference), 0)}/yr` },
          details: [
            { label: "Gig net (after expenses)", value: `$${formatNumber(gigNet, 0)}` },
            { label: "SE tax (15.3%)", value: `-$${formatNumber(seTax, 0)}` },
            { label: "Gig health insurance", value: `-$${formatNumber(gigHealthAnnual, 0)}` },
            { label: "Gig income tax", value: `-$${formatNumber(gigIncomeTax, 0)}` },
            { label: "Gig annual take-home", value: `$${formatNumber(gigTakeHome, 0)}` },
            { label: "W-2 take-home", value: `$${formatNumber(w2TakeHome, 0)}` },
            { label: "W-2 benefits value", value: `+$${formatNumber(benefits, 0)}` },
            { label: "W-2 total compensation value", value: `$${formatNumber(w2TotalValue, 0)}` },
            { label: "Break-even gig revenue needed", value: `$${formatNumber(breakEvenGig, 0)}` },
          ],
          note: difference >= 0
            ? `Gig work pays $${formatNumber(difference, 0)} more after expenses and taxes. Consider W-2 benefits (${formatNumber(benefits, 0)}) for true comparison.`
            : `W-2 pays $${formatNumber(Math.abs(difference), 0)} more after all costs. Need $${formatNumber(breakEvenGig, 0)} gig revenue to break even.`,
        };
      },
    },
  ],
  relatedSlugs: ["gig-worker-quarterly-tax-calculator", "gig-worker-hourly-rate-calculator", "freelancer-vs-employee-calculator"],
  faq: [
    {
      question: "Do gig workers pay more taxes than W-2 employees?",
      answer:
        "Yes. Gig workers pay 15.3% self-employment tax vs 7.65% employee FICA. On $50,000 net income, that's ~$3,825 extra vs a W-2 worker. However, gig workers can deduct business expenses that W-2 employees cannot, partially offsetting the difference.",
    },
    {
      question: "What is the gig work premium?",
      answer:
        "To equal a W-2 salary with benefits, gig workers typically need to earn 30–40% more in gross revenue. A $60,000 salary with $12,000 benefits requires roughly $85,000+ in gig revenue to match after SE taxes, health insurance, and no paid time off.",
    },
    {
      question: "What hidden costs do W-2 employees have that gig workers don't?",
      answer:
        "W-2 workers often overlook commuting costs ($2,000–$5,000/yr), professional clothing, and mandatory schedules. Gig workers gain flexibility but lose: paid vacation (worth $3,000–$5,000), employer retirement match, paid sick days, and unemployment insurance eligibility.",
    },
  ],
  formula: "Gig Take-Home = Revenue − Expenses − SE Tax − Health Insurance − Income Tax",
};
