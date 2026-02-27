import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const appRevenueCalculator: CalculatorDefinition = {
  slug: "app-revenue",
  title: "Mobile App Revenue Estimator",
  description:
    "Estimate mobile app revenue from downloads, in-app purchases, subscriptions, and advertising based on platform, category, and engagement metrics.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "app revenue",
    "mobile app income",
    "app store earnings",
    "in-app purchase revenue",
    "app monetization",
    "ios app revenue",
    "android app revenue",
  ],
  variants: [
    {
      slug: "app-revenue",
      title: "Mobile App Revenue Calculator",
      description:
        "Calculate estimated app revenue from multiple monetization channels.",
      fields: [
        {
          id: "monthlyDownloads",
          label: "Monthly Downloads",
          type: "number",
          defaultValue: 10000,
        },
        {
          id: "monthlyActiveUsers",
          label: "Monthly Active Users (MAU)",
          type: "number",
          defaultValue: 25000,
        },
        {
          id: "platform",
          label: "Platform",
          type: "select",
          options: [
            { label: "iOS (Apple 30% / 15% cut)", value: "ios" },
            { label: "Android (Google 30% / 15% cut)", value: "android" },
            { label: "Both Platforms", value: "both" },
          ],
          defaultValue: "both",
        },
        {
          id: "monetizationModel",
          label: "Primary Monetization",
          type: "select",
          options: [
            { label: "Subscription", value: "subscription" },
            { label: "In-App Purchases", value: "iap" },
            { label: "Ads (AdMob/similar)", value: "ads" },
            { label: "Paid Download", value: "paid" },
            { label: "Freemium (Sub + Ads)", value: "freemium" },
          ],
          defaultValue: "freemium",
        },
        {
          id: "appPrice",
          label: "App Price / Subscription Price ($)",
          type: "number",
          defaultValue: 4.99,
        },
        {
          id: "conversionRate",
          label: "Conversion Rate to Paid (%)",
          type: "number",
          defaultValue: 3,
        },
        {
          id: "dailyActivePercent",
          label: "DAU/MAU Ratio (%)",
          type: "number",
          defaultValue: 25,
        },
      ],
      calculate(inputs) {
        const monthlyDownloads = parseFloat(inputs.monthlyDownloads as string);
        const monthlyActiveUsers = parseFloat(inputs.monthlyActiveUsers as string);
        const platform = inputs.platform as string;
        const monetizationModel = inputs.monetizationModel as string;
        const appPrice = parseFloat(inputs.appPrice as string);
        const conversionRate = parseFloat(inputs.conversionRate as string) / 100;
        const dailyActivePercent = parseFloat(inputs.dailyActivePercent as string) / 100;

        // Store takes 30% (15% for small business program)
        const storeCut = platform === "both" ? 0.225 : 0.3; // blended for both
        const dailyActiveUsers = monthlyActiveUsers * dailyActivePercent;

        let subscriptionRevenue = 0;
        let iapRevenue = 0;
        let adRevenue = 0;
        let paidRevenue = 0;

        if (monetizationModel === "subscription" || monetizationModel === "freemium") {
          const subscribers = monthlyActiveUsers * conversionRate;
          subscriptionRevenue = subscribers * appPrice * (1 - storeCut);
        }

        if (monetizationModel === "iap") {
          // Average IAP revenue per user ~$0.10-$0.50
          const payingUsers = monthlyActiveUsers * conversionRate;
          const avgPurchase = appPrice;
          iapRevenue = payingUsers * avgPurchase * (1 - storeCut);
        }

        if (monetizationModel === "ads" || monetizationModel === "freemium") {
          // eCPM $1-$10 depending on geo/format, avg ~$3
          const eCpm = 3;
          const adImpressions = dailyActiveUsers * 5 * 30; // 5 ads/day
          adRevenue = (adImpressions / 1000) * eCpm;
        }

        if (monetizationModel === "paid") {
          paidRevenue = monthlyDownloads * appPrice * (1 - storeCut);
        }

        const totalMonthly = subscriptionRevenue + iapRevenue + adRevenue + paidRevenue;
        const arpu = totalMonthly / monthlyActiveUsers;

        return {
          "Subscription Revenue": "$" + formatNumber(subscriptionRevenue),
          "In-App Purchase Revenue": "$" + formatNumber(iapRevenue),
          "Ad Revenue": "$" + formatNumber(adRevenue),
          "Paid Download Revenue": "$" + formatNumber(paidRevenue),
          "Total Monthly Revenue": "$" + formatNumber(totalMonthly),
          "Annual Revenue": "$" + formatNumber(totalMonthly * 12),
          ARPU: "$" + formatNumber(arpu),
          "Daily Active Users": formatNumber(Math.round(dailyActiveUsers)),
        };
      },
    },
  ],
  relatedSlugs: [
    "saas-metrics",
    "course-pricing",
    "startup-runway",
    "seo-traffic-value",
  ],
  faq: [
    {
      question: "How much do mobile apps make on average?",
      answer:
        "The median mobile app earns under $500/month. However, top apps earn millions. Key metrics are ARPU (Average Revenue per User) and retention. Subscription apps typically earn $0.10-$2.00 ARPU, while games with in-app purchases can achieve $1-$5+ ARPU among paying users.",
    },
    {
      question: "What percentage does Apple and Google take from app sales?",
      answer:
        "Both Apple and Google take a 30% commission on app sales and in-app purchases. Developers earning under $1M annually qualify for reduced rates (15% on Apple, 15% on Google). Subscriptions also get a reduced 15% rate after the first year of a subscriber.",
    },
    {
      question: "What is the best app monetization strategy?",
      answer:
        "Subscription models produce the most predictable and highest-value revenue. Freemium (ads for free users + subscription for premium) maximizes total revenue. In-app purchases work best for games. Paid downloads work for utility apps with strong value propositions.",
    },
  ],
  formula:
    "Subscription Revenue = MAU x Conversion Rate x Price x (1 - Store Cut). Ad Revenue = DAU x Ads/Day x 30 Days / 1,000 x eCPM. ARPU = Total Revenue / MAU.",
};
