import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const subscriptionAuditCalculator: CalculatorDefinition = {
  slug: "subscription-audit-calculator",
  title: "Subscription Audit & Savings Calculator",
  description:
    "Free subscription audit calculator. Add up all your recurring subscriptions to see total monthly and yearly costs, then identify potential savings.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "subscription audit",
    "subscription calculator",
    "recurring expenses",
    "subscription tracker",
    "monthly subscriptions total",
  ],
  variants: [
    {
      id: "audit",
      name: "Subscription Audit",
      description: "Calculate total cost of all your subscriptions",
      fields: [
        {
          name: "streaming",
          label: "Streaming Services (total monthly)",
          type: "number",
          placeholder: "e.g. 55",
          prefix: "$",
          min: 0,
          max: 300,
          step: 1,
          defaultValue: 55,
        },
        {
          name: "music",
          label: "Music/Podcasts (monthly)",
          type: "number",
          placeholder: "e.g. 11",
          prefix: "$",
          min: 0,
          max: 50,
          step: 1,
          defaultValue: 11,
        },
        {
          name: "cloud",
          label: "Cloud Storage/Software (monthly)",
          type: "number",
          placeholder: "e.g. 15",
          prefix: "$",
          min: 0,
          max: 100,
          step: 1,
          defaultValue: 15,
        },
        {
          name: "gaming",
          label: "Gaming Services (monthly)",
          type: "number",
          placeholder: "e.g. 15",
          prefix: "$",
          min: 0,
          max: 100,
          step: 1,
          defaultValue: 15,
        },
        {
          name: "news",
          label: "News/Magazines (monthly)",
          type: "number",
          placeholder: "e.g. 10",
          prefix: "$",
          min: 0,
          max: 100,
          step: 1,
          defaultValue: 10,
        },
        {
          name: "fitness",
          label: "Fitness/Wellness Apps (monthly)",
          type: "number",
          placeholder: "e.g. 15",
          prefix: "$",
          min: 0,
          max: 100,
          step: 1,
          defaultValue: 15,
        },
        {
          name: "other",
          label: "Other Subscriptions (monthly)",
          type: "number",
          placeholder: "e.g. 20",
          prefix: "$",
          min: 0,
          max: 500,
          step: 1,
          defaultValue: 20,
        },
      ],
      calculate: (inputs) => {
        const streaming = parseFloat(inputs.streaming as string) || 0;
        const music = parseFloat(inputs.music as string) || 0;
        const cloud = parseFloat(inputs.cloud as string) || 0;
        const gaming = parseFloat(inputs.gaming as string) || 0;
        const news = parseFloat(inputs.news as string) || 0;
        const fitness = parseFloat(inputs.fitness as string) || 0;
        const other = parseFloat(inputs.other as string) || 0;

        const totalMonthly = streaming + music + cloud + gaming + news + fitness + other;
        if (totalMonthly === 0) return null;

        const totalYearly = totalMonthly * 12;
        const totalDaily = totalMonthly / 30;

        // If invested at 7% for 10 years
        const invested10yr = totalYearly * ((Math.pow(1.07, 10) - 1) / 0.07);

        // Find biggest category
        const categories = [
          { name: "Streaming", val: streaming },
          { name: "Music/Podcasts", val: music },
          { name: "Cloud/Software", val: cloud },
          { name: "Gaming", val: gaming },
          { name: "News/Magazines", val: news },
          { name: "Fitness/Wellness", val: fitness },
          { name: "Other", val: other },
        ].sort((a, b) => b.val - a.val);

        const biggest = categories[0];

        return {
          primary: { label: "Total Monthly Subscriptions", value: `$${formatNumber(totalMonthly)}` },
          details: [
            { label: "Yearly Total", value: `$${formatNumber(totalYearly)}` },
            { label: "Daily Cost", value: `$${formatNumber(totalDaily)}` },
            { label: "Biggest Category", value: `${biggest.name}: $${formatNumber(biggest.val)}/mo` },
            { label: "If Invested (10yr @ 7%)", value: `$${formatNumber(invested10yr)}` },
            { label: "Streaming", value: `$${formatNumber(streaming)}/mo` },
            { label: "Gaming", value: `$${formatNumber(gaming)}/mo` },
          ],
        };
      },
    },
    {
      id: "savings",
      name: "Cut & Save",
      description: "See how much you save by cutting subscriptions",
      fields: [
        {
          name: "currentTotal",
          label: "Current Monthly Total",
          type: "number",
          placeholder: "e.g. 140",
          prefix: "$",
          min: 10,
          max: 1000,
          step: 5,
          defaultValue: 140,
        },
        {
          name: "targetTotal",
          label: "Target Monthly Total",
          type: "number",
          placeholder: "e.g. 60",
          prefix: "$",
          min: 0,
          max: 500,
          step: 5,
          defaultValue: 60,
        },
        {
          name: "investSavings",
          label: "Invest the Savings?",
          type: "select",
          options: [
            { label: "Yes - invest at 7%", value: "yes" },
            { label: "No - just save", value: "no" },
          ],
          defaultValue: "yes",
        },
      ],
      calculate: (inputs) => {
        const current = parseFloat(inputs.currentTotal as string);
        const target = parseFloat(inputs.targetTotal as string);
        const invest = inputs.investSavings as string;
        if (!current || isNaN(target)) return null;

        const monthlySavings = current - target;
        const yearlySavings = monthlySavings * 12;
        const percentCut = (monthlySavings / current) * 100;

        let fiveYear: number;
        let tenYear: number;
        let twentyYear: number;

        if (invest === "yes") {
          const r = 0.07 / 12;
          fiveYear = monthlySavings * ((Math.pow(1 + r, 60) - 1) / r);
          tenYear = monthlySavings * ((Math.pow(1 + r, 120) - 1) / r);
          twentyYear = monthlySavings * ((Math.pow(1 + r, 240) - 1) / r);
        } else {
          fiveYear = monthlySavings * 60;
          tenYear = monthlySavings * 120;
          twentyYear = monthlySavings * 240;
        }

        return {
          primary: { label: "Monthly Savings", value: `$${formatNumber(monthlySavings)}` },
          details: [
            { label: "Yearly Savings", value: `$${formatNumber(yearlySavings)}` },
            { label: "Percent Reduction", value: `${formatNumber(percentCut, 0)}%` },
            { label: "5-Year Value", value: `$${formatNumber(fiveYear)}` },
            { label: "10-Year Value", value: `$${formatNumber(tenYear)}` },
            { label: "20-Year Value", value: `$${formatNumber(twentyYear)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["streaming-cost-compare-calculator", "latte-factor-calculator"],
  faq: [
    {
      question: "How much does the average person spend on subscriptions?",
      answer:
        "Studies show the average American spends $200-$300 per month on subscriptions, often underestimating by 2-3x. This includes streaming, software, gaming, fitness apps, food delivery, and more.",
    },
    {
      question: "How do I audit my subscriptions?",
      answer:
        "Review your bank and credit card statements for the last 3 months. Look for recurring charges. Many people discover they are paying for services they no longer use. Cancel anything you have not used in the past month.",
    },
  ],
  formula:
    "Monthly Total = Sum of All Subscriptions | Yearly Cost = Monthly x 12 | Investment Value = Monthly Savings x ((1 + r)^n - 1) / r",
};
