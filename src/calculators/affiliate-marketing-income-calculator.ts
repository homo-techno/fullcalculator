import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const affiliateMarketingIncomeCalculator: CalculatorDefinition = {
  slug: "affiliate-marketing-income-calculator",
  title: "Affiliate Marketing Income Calculator",
  description:
    "Calculate your affiliate marketing income from traffic, conversion rates, and commission rates. Project monthly and annual earnings from affiliate programs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "affiliate marketing income calculator",
    "affiliate commission calculator",
    "how much can I make with affiliate marketing",
    "affiliate revenue estimator",
    "passive income affiliate calculator",
  ],
  variants: [
    {
      id: "traffic",
      name: "Traffic-Based Projection",
      description: "Calculate affiliate income from your traffic and conversion data",
      fields: [
        {
          name: "monthlyVisitors",
          label: "Monthly Website/Blog Visitors",
          type: "number",
          placeholder: "e.g. 10000",
          suffix: "visitors",
        },
        {
          name: "clickThroughRate",
          label: "Affiliate Click-Through Rate",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "%",
          defaultValue: 3,
        },
        {
          name: "conversionRate",
          label: "Affiliate Conversion Rate",
          type: "number",
          placeholder: "e.g. 2",
          suffix: "%",
          defaultValue: 2,
        },
        {
          name: "avgOrderValue",
          label: "Average Order Value",
          type: "number",
          placeholder: "e.g. 80",
          prefix: "$",
          defaultValue: 80,
        },
        {
          name: "commissionRate",
          label: "Commission Rate",
          type: "select",
          options: [
            { label: "Amazon Associates (1–4%)", value: "3" },
            { label: "Physical products avg (5–10%)", value: "7" },
            { label: "Software/SaaS (15–30%)", value: "22" },
            { label: "Digital products (30–50%)", value: "40" },
            { label: "High-ticket programs (20–50%)", value: "35" },
            { label: "Custom rate", value: "custom" },
          ],
          defaultValue: "7",
        },
        {
          name: "customCommission",
          label: "Custom Commission % (if selected above)",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "%",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const visitors = parseFloat(inputs.monthlyVisitors as string) || 0;
        const ctr = parseFloat(inputs.clickThroughRate as string) / 100 || 0.03;
        const cvr = parseFloat(inputs.conversionRate as string) / 100 || 0.02;
        const aov = parseFloat(inputs.avgOrderValue as string) || 80;
        const commissionSelect = inputs.commissionRate as string;
        const customComm = parseFloat(inputs.customCommission as string) || 0;
        const commissionRate = commissionSelect === "custom" ? customComm / 100 : parseFloat(commissionSelect) / 100;

        const clicks = visitors * ctr;
        const conversions = clicks * cvr;
        const monthlyRevenue = conversions * aov;
        const monthlyCommission = monthlyRevenue * commissionRate;
        const annualCommission = monthlyCommission * 12;

        // Traffic needed for $1k/mo
        const visitorsFor1k = commissionRate > 0 && ctr > 0 && cvr > 0 && aov > 0
          ? 1000 / (ctr * cvr * aov * commissionRate)
          : 0;

        const epmv = visitors > 0 ? (monthlyCommission / visitors) * 1000 : 0; // earnings per 1k visitors

        return {
          primary: { label: "Monthly Affiliate Income", value: `$${formatNumber(monthlyCommission, 2)}` },
          details: [
            { label: "Monthly visitors", value: formatNumber(visitors, 0) },
            { label: "Affiliate clicks (CTR)", value: `${formatNumber(clicks, 0)} clicks` },
            { label: "Conversions", value: `${formatNumber(conversions, 1)} sales` },
            { label: "Affiliate revenue generated", value: `$${formatNumber(monthlyRevenue, 2)}` },
            { label: `Commission (${(commissionRate * 100).toFixed(0)}%)`, value: `$${formatNumber(monthlyCommission, 2)}/mo` },
            { label: "Annual affiliate income", value: `$${formatNumber(annualCommission, 0)}` },
            { label: "Earnings per 1,000 visitors (EPMV)", value: `$${formatNumber(epmv, 2)}` },
            { label: "Visitors needed for $1,000/mo", value: `${formatNumber(visitorsFor1k, 0)}` },
          ],
          note: "EPMV (earnings per 1,000 visitors) is your key efficiency metric. $5+ EPMV is good; $15+ is excellent. Increase by targeting buyer-intent keywords and promoting higher-commission programs.",
        };
      },
    },
  ],
  relatedSlugs: ["online-course-pricing-calculator", "content-creator-hourly-rate-calculator", "newsletter-sponsorship-calculator"],
  faq: [
    {
      question: "How much can I make with affiliate marketing?",
      answer:
        "Affiliate income varies enormously. Beginners with 1,000 monthly visitors might earn $50–$200/month. Sites with 50,000 visitors can earn $2,000–$15,000/month depending on niche and commission rates. Top affiliate sites earn $50,000–$500,000+/month. Niche selection matters most: finance and software affiliates earn 5–10x more than general retail.",
    },
    {
      question: "What is a good affiliate conversion rate?",
      answer:
        "Average affiliate conversion rates: 1–3% for most niches, 3–5% for high-intent review content, 5–10% for email subscribers. Your conversion rate is primarily influenced by content intent (review > comparison > informational) and how closely the product matches reader needs.",
    },
    {
      question: "Which affiliate programs pay the highest commissions?",
      answer:
        "Highest commission categories: SaaS/software (20–40% recurring), web hosting (50–200% one-time), online courses (30–50%), financial products ($50–$200 CPA), and VPN/security (30–50%). Amazon Associates pays 1–10% but converts well due to brand trust. Focus on recurring commissions for compounding income growth.",
    },
  ],
  formula: "Monthly Income = Visitors × CTR% × Conversion% × Avg Order Value × Commission%",
};
