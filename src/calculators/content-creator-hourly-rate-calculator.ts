import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const contentCreatorHourlyRateCalculator: CalculatorDefinition = {
  slug: "content-creator-hourly-rate-calculator",
  title: "Content Creator True Hourly Rate Calculator",
  description:
    "Calculate your real hourly earnings as a content creator after accounting for all hours worked, equipment costs, and platform fees.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "content creator hourly rate",
    "YouTuber true earnings per hour",
    "creator economy income per hour",
    "content creation real wage",
    "influencer hourly rate calculator",
  ],
  variants: [
    {
      id: "true-rate",
      name: "True Hourly Rate",
      description: "Calculate real earnings per hour worked",
      fields: [
        {
          name: "monthlyRevenue",
          label: "Monthly Gross Revenue",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
        },
        {
          name: "hoursFilming",
          label: "Hours Filming per Month",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "hrs",
        },
        {
          name: "hoursEditing",
          label: "Hours Editing per Month",
          type: "number",
          placeholder: "e.g. 40",
          suffix: "hrs",
        },
        {
          name: "hoursAdmin",
          label: "Hours Admin / Email / Comms",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "hrs",
          defaultValue: 10,
        },
        {
          name: "monthlyExpenses",
          label: "Monthly Business Expenses",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          defaultValue: 300,
        },
      ],
      calculate: (inputs) => {
        const revenue = parseFloat(inputs.monthlyRevenue as string) || 0;
        const filming = parseFloat(inputs.hoursFilming as string) || 0;
        const editing = parseFloat(inputs.hoursEditing as string) || 0;
        const admin = parseFloat(inputs.hoursAdmin as string) || 0;
        const expenses = parseFloat(inputs.monthlyExpenses as string) || 0;

        const totalHours = filming + editing + admin;
        const netRevenue = revenue - expenses;
        const trueHourlyRate = totalHours > 0 ? netRevenue / totalHours : 0;
        const annualRevenue = netRevenue * 12;

        return {
          primary: { label: "True Hourly Rate", value: `$${formatNumber(trueHourlyRate, 2)}/hr` },
          details: [
            { label: "Gross monthly revenue", value: `$${formatNumber(revenue, 2)}` },
            { label: "Monthly expenses", value: `-$${formatNumber(expenses, 2)}` },
            { label: "Net monthly income", value: `$${formatNumber(netRevenue, 2)}` },
            { label: "Total hours worked", value: `${formatNumber(totalHours)} hrs/month` },
            { label: "True hourly rate", value: `$${formatNumber(trueHourlyRate, 2)}/hr` },
            { label: "Annual net income", value: `$${formatNumber(annualRevenue, 2)}` },
          ],
          note: "Don't forget to set aside 25–30% for self-employment taxes. Your true hourly rate should ideally exceed your market salary equivalent.",
        };
      },
    },
  ],
  relatedSlugs: ["youtube-rpm-calculator", "online-course-pricing-calculator", "membership-site-revenue-calculator"],
  faq: [
    {
      question: "Is content creation worth it financially?",
      answer:
        "Most creators earn less than minimum wage in their first 1–2 years. After building an audience, top creators earn $50–$500/hr effectively. The median full-time creator earns $50,000–$80,000/year after 3–5 years of consistent work.",
    },
    {
      question: "What expenses do content creators have?",
      answer:
        "Typical expenses: camera equipment ($500–$5,000), editing software ($30–$100/mo), thumbnail/design tools ($15–$50/mo), music licensing ($15–$30/mo), hosting/storage ($10–$50/mo), and potentially contractors for editing ($20–$50/hr).",
    },
    {
      question: "How many hours a week do successful YouTubers work?",
      answer:
        "Most successful solo YouTubers work 40–80 hours per week. A single 10-minute YouTube video takes 8–20 hours to produce (filming, editing, thumbnails, SEO). Building a team is critical to scaling beyond one video per week.",
    },
  ],
  formula: "True Hourly Rate = (Monthly Revenue − Expenses) ÷ Total Hours Worked",
};
