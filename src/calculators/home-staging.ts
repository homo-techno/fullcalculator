import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeStagingCalculator: CalculatorDefinition = {
  slug: "home-staging-calculator",
  title: "Home Staging Cost Calculator",
  description:
    "Free home staging cost calculator. Estimate home staging costs, potential return on investment, and compare DIY vs professional staging options.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "home staging cost",
    "staging calculator",
    "home staging roi",
    "staging cost estimate",
    "home staging budget",
  ],
  variants: [
    {
      id: "professional",
      name: "Professional Staging Cost",
      description: "Estimate professional home staging costs and ROI",
      fields: [
        {
          name: "homeValue",
          label: "Home Listing Price",
          type: "number",
          placeholder: "e.g. 400000",
          prefix: "$",
          min: 0,
        },
        {
          name: "homeSize",
          label: "Home Size",
          type: "select",
          options: [
            { label: "Under 1,500 sq ft", value: "small" },
            { label: "1,500-2,500 sq ft", value: "medium" },
            { label: "2,500-3,500 sq ft", value: "large" },
            { label: "Over 3,500 sq ft", value: "xlarge" },
          ],
          defaultValue: "medium",
        },
        {
          name: "stagingLevel",
          label: "Staging Level",
          type: "select",
          options: [
            { label: "Consultation only", value: "consultation" },
            { label: "Partial staging (key rooms)", value: "partial" },
            { label: "Full staging", value: "full" },
            { label: "Luxury staging", value: "luxury" },
          ],
          defaultValue: "partial",
        },
        {
          name: "months",
          label: "Months on Market (expected)",
          type: "select",
          options: [
            { label: "1 month", value: "1" },
            { label: "2 months", value: "2" },
            { label: "3 months", value: "3" },
            { label: "4+ months", value: "4" },
          ],
          defaultValue: "2",
        },
      ],
      calculate: (inputs) => {
        const homeValue = inputs.homeValue as number;
        const size = inputs.homeSize as string;
        const level = inputs.stagingLevel as string;
        const months = parseInt(inputs.months as string) || 2;
        if (!homeValue) return null;

        const sizeMultiplier = size === "small" ? 0.7 : size === "medium" ? 1 : size === "large" ? 1.4 : 1.8;
        let baseCost = 0;
        let monthlyRental = 0;
        if (level === "consultation") {
          baseCost = 300 * sizeMultiplier;
          monthlyRental = 0;
        } else if (level === "partial") {
          baseCost = 1500 * sizeMultiplier;
          monthlyRental = 500 * sizeMultiplier;
        } else if (level === "full") {
          baseCost = 2500 * sizeMultiplier;
          monthlyRental = 800 * sizeMultiplier;
        } else {
          baseCost = 5000 * sizeMultiplier;
          monthlyRental = 1500 * sizeMultiplier;
        }

        const totalCost = baseCost + (monthlyRental * months);
        const expectedBoost = homeValue * 0.05;
        const roi = ((expectedBoost - totalCost) / totalCost) * 100;

        return {
          primary: {
            label: "Estimated Staging Cost",
            value: `$${formatNumber(totalCost)}`,
          },
          details: [
            { label: "Initial setup cost", value: `$${formatNumber(baseCost)}` },
            { label: "Monthly furniture rental", value: `$${formatNumber(monthlyRental)}` },
            { label: "Expected price boost (avg 5%)", value: `$${formatNumber(expectedBoost)}` },
            { label: "Staging ROI", value: `${formatNumber(roi)}%` },
            { label: "Cost as % of home value", value: `${formatNumber((totalCost / homeValue) * 100)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["real-estate-commission-calculator", "home-appreciation-rate-calculator", "mortgage-calculator"],
  faq: [
    {
      question: "How much does home staging cost?",
      answer:
        "Professional home staging typically costs $1,500-$5,000+ for initial setup plus $500-$1,500/month for furniture rental. Consultation-only services run $200-$500. Costs vary by home size, staging level, and local market rates.",
    },
    {
      question: "Is home staging worth the cost?",
      answer:
        "Studies show staged homes sell for 5-15% more and spend 73% less time on market compared to non-staged homes. The typical return on staging investment is 5-15x the cost, making it one of the best pre-sale investments.",
    },
    {
      question: "What rooms should I stage?",
      answer:
        "Focus on high-impact rooms: living room, kitchen, and master bedroom. These three rooms have the greatest influence on buyers. If budget allows, add the dining room and bathrooms. Always stage the room visible from the front door.",
    },
  ],
  formula: "Total Cost = Setup Fee + (Monthly Rental x Months on Market)",
};
