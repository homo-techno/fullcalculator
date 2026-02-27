import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const seoTrafficValueCalculator: CalculatorDefinition = {
  slug: "seo-traffic-value",
  title: "SEO Organic Traffic Value Estimator",
  description:
    "Estimate the monetary value of organic search traffic by comparing what it would cost to acquire the same traffic through paid ads (PPC).",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "seo traffic value",
    "organic traffic value",
    "seo roi",
    "traffic monetization",
    "organic search value",
    "seo investment",
    "ppc equivalent",
  ],
  variants: [
    {
      slug: "seo-traffic-value",
      title: "SEO Traffic Value Calculator",
      description:
        "Calculate the equivalent ad spend value of your organic traffic.",
      fields: [
        {
          id: "monthlyOrganicVisits",
          label: "Monthly Organic Visits",
          type: "number",
          defaultValue: 50000,
        },
        {
          id: "industry",
          label: "Industry / Niche",
          type: "select",
          options: [
            { label: "Finance / Insurance ($5-$15 avg CPC)", value: "finance" },
            { label: "Legal ($8-$20 avg CPC)", value: "legal" },
            { label: "SaaS / Software ($3-$10 avg CPC)", value: "saas" },
            { label: "Healthcare ($2-$8 avg CPC)", value: "healthcare" },
            { label: "E-commerce ($0.50-$3 avg CPC)", value: "ecommerce" },
            { label: "Education ($1-$5 avg CPC)", value: "education" },
            { label: "Real Estate ($2-$8 avg CPC)", value: "realestate" },
            { label: "General / Blog ($0.30-$2 avg CPC)", value: "general" },
          ],
          defaultValue: "saas",
        },
        {
          id: "conversionRate",
          label: "Organic Conversion Rate (%)",
          type: "number",
          defaultValue: 2.5,
        },
        {
          id: "avgConversionValue",
          label: "Average Conversion Value ($)",
          type: "number",
          defaultValue: 100,
        },
        {
          id: "monthlySeoSpend",
          label: "Monthly SEO Investment ($)",
          type: "number",
          defaultValue: 3000,
        },
      ],
      calculate(inputs) {
        const monthlyOrganicVisits = parseFloat(
          inputs.monthlyOrganicVisits as string
        );
        const industry = inputs.industry as string;
        const conversionRate = parseFloat(inputs.conversionRate as string) / 100;
        const avgConversionValue = parseFloat(
          inputs.avgConversionValue as string
        );
        const monthlySeoSpend = parseFloat(inputs.monthlySeoSpend as string);

        const avgCpc: Record<string, number> = {
          finance: 8.5,
          legal: 12.0,
          saas: 5.5,
          healthcare: 4.0,
          ecommerce: 1.5,
          education: 2.5,
          realestate: 4.5,
          general: 0.8,
        };

        const cpc = avgCpc[industry] || 2.0;
        const trafficValue = monthlyOrganicVisits * cpc;
        const conversions = monthlyOrganicVisits * conversionRate;
        const conversionRevenue = conversions * avgConversionValue;
        const seoRoi =
          ((trafficValue - monthlySeoSpend) / monthlySeoSpend) * 100;
        const revenueRoi =
          ((conversionRevenue - monthlySeoSpend) / monthlySeoSpend) * 100;
        const costPerVisit = monthlySeoSpend / monthlyOrganicVisits;

        return {
          "Traffic PPC Equivalent Value": "$" + formatNumber(trafficValue),
          "Average CPC in Niche": "$" + formatNumber(cpc),
          "Monthly Conversions": formatNumber(Math.round(conversions)),
          "Conversion Revenue": "$" + formatNumber(conversionRevenue),
          "SEO Investment": "$" + formatNumber(monthlySeoSpend),
          "Traffic Value ROI": formatNumber(seoRoi) + "%",
          "Revenue ROI": formatNumber(revenueRoi) + "%",
          "Cost per Organic Visit": "$" + formatNumber(costPerVisit),
          "Annual Traffic Value": "$" + formatNumber(trafficValue * 12),
        };
      },
    },
    {
      slug: "seo-content-roi",
      title: "SEO Content ROI Calculator",
      description:
        "Calculate the ROI of investing in SEO content creation.",
      fields: [
        {
          id: "articlesPerMonth",
          label: "Articles Published per Month",
          type: "number",
          defaultValue: 8,
        },
        {
          id: "costPerArticle",
          label: "Cost per Article ($)",
          type: "number",
          defaultValue: 300,
        },
        {
          id: "avgTrafficPerArticle",
          label: "Avg Monthly Traffic per Article (at maturity)",
          type: "number",
          defaultValue: 500,
        },
        {
          id: "avgCpc",
          label: "Average CPC in Your Niche ($)",
          type: "number",
          defaultValue: 3,
        },
        {
          id: "monthsToMature",
          label: "Months for Articles to Rank",
          type: "number",
          defaultValue: 6,
        },
      ],
      calculate(inputs) {
        const articlesPerMonth = parseFloat(inputs.articlesPerMonth as string);
        const costPerArticle = parseFloat(inputs.costPerArticle as string);
        const avgTrafficPerArticle = parseFloat(
          inputs.avgTrafficPerArticle as string
        );
        const avgCpc = parseFloat(inputs.avgCpc as string);
        const monthsToMature = parseFloat(inputs.monthsToMature as string);

        const monthlyContentCost = articlesPerMonth * costPerArticle;
        const trafficPerArticle = avgTrafficPerArticle;
        const valuePerArticleMonthly = trafficPerArticle * avgCpc;

        // After 12 months: articles from first 6 months are producing
        const matureArticles = articlesPerMonth * (12 - monthsToMature);
        const monthlyTrafficAt12 = matureArticles * trafficPerArticle;
        const monthlyValueAt12 = monthlyTrafficAt12 * avgCpc;
        const totalInvestment12 = monthlyContentCost * 12;

        return {
          "Monthly Content Investment": "$" + formatNumber(monthlyContentCost),
          "Value per Article (monthly)": "$" + formatNumber(valuePerArticleMonthly),
          "Mature Articles at 12 Months": formatNumber(matureArticles),
          "Monthly Traffic at 12 Months": formatNumber(monthlyTrafficAt12),
          "Monthly Value at 12 Months": "$" + formatNumber(monthlyValueAt12),
          "12-Month Total Investment": "$" + formatNumber(totalInvestment12),
          "12-Month ROI":
            formatNumber(
              ((monthlyValueAt12 * 12 - totalInvestment12) / totalInvestment12) * 100
            ) + "%",
        };
      },
    },
  ],
  relatedSlugs: [
    "newsletter-revenue",
    "sponsorship-rate",
    "domain-value",
    "saas-metrics",
  ],
  faq: [
    {
      question: "How do you calculate the value of organic traffic?",
      answer:
        "Organic traffic value is calculated by multiplying monthly organic visits by the average cost-per-click (CPC) you would pay for equivalent traffic through paid ads. This represents what you would have to spend on PPC to get the same traffic volume.",
    },
    {
      question: "What is a good ROI for SEO investment?",
      answer:
        "A good SEO ROI is 500-1,000%+, meaning $5-$10 in traffic value for every $1 invested. SEO compounds over time as content ranks and accumulates. Most SEO investments take 6-12 months to show significant returns but continue generating value for years.",
    },
  ],
  formula:
    "Traffic Value = Monthly Organic Visits x Average CPC. SEO ROI = (Traffic Value - SEO Investment) / SEO Investment x 100. Conversion Revenue = Visits x Conversion Rate x Average Value.",
};
