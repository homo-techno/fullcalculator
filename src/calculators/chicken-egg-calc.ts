import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chickenEggCalculator: CalculatorDefinition = {
  slug: "chicken-egg-calc",
  title: "Chicken Egg Production Calculator",
  description:
    "Free chicken egg production calculator. Estimate weekly and annual egg yields based on flock size, breed, and season. Includes feed cost analysis.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "chicken egg calculator",
    "egg production calculator",
    "backyard chicken eggs",
    "flock egg yield",
    "chicken breed eggs",
    "egg laying rate",
    "poultry calculator",
  ],
  variants: [
    {
      id: "egg-production",
      name: "Egg Production Estimator",
      description: "Estimate egg production by flock size and breed",
      fields: [
        {
          name: "hens",
          label: "Number of Hens",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "breed",
          label: "Chicken Breed",
          type: "select",
          options: [
            { label: "Rhode Island Red (260 eggs/yr)", value: "260" },
            { label: "Leghorn (280 eggs/yr)", value: "280" },
            { label: "Australorp (250 eggs/yr)", value: "250" },
            { label: "Plymouth Rock (200 eggs/yr)", value: "200" },
            { label: "Orpington (190 eggs/yr)", value: "190" },
            { label: "Sussex (250 eggs/yr)", value: "250" },
            { label: "Wyandotte (200 eggs/yr)", value: "200" },
            { label: "Ameraucana (200 eggs/yr)", value: "200" },
            { label: "Hybrid Layer (300 eggs/yr)", value: "300" },
          ],
          defaultValue: "260",
        },
        {
          name: "henAge",
          label: "Average Hen Age",
          type: "select",
          options: [
            { label: "Pullet (under 1 year)", value: "0.85" },
            { label: "1-2 years (peak)", value: "1.0" },
            { label: "2-3 years", value: "0.80" },
            { label: "3-4 years", value: "0.65" },
            { label: "4+ years", value: "0.50" },
          ],
          defaultValue: "1.0",
        },
        {
          name: "season",
          label: "Season (light factor)",
          type: "select",
          options: [
            { label: "Spring/Summer (peak)", value: "1.0" },
            { label: "Fall (declining)", value: "0.75" },
            { label: "Winter (low - no light)", value: "0.40" },
            { label: "Winter (supplemental light)", value: "0.70" },
            { label: "Year-round average", value: "0.75" },
          ],
          defaultValue: "0.75",
        },
      ],
      calculate: (inputs) => {
        const hens = parseFloat(inputs.hens as string);
        const breedRate = parseFloat(inputs.breed as string);
        const ageFactor = parseFloat(inputs.henAge as string);
        const seasonFactor = parseFloat(inputs.season as string);
        if (isNaN(hens) || isNaN(breedRate) || isNaN(ageFactor) || isNaN(seasonFactor)) return null;
        if (hens <= 0) return null;

        const annualPerHen = breedRate * ageFactor * seasonFactor;
        const weeklyPerHen = annualPerHen / 52;
        const dailyPerHen = annualPerHen / 365;

        const totalAnnual = annualPerHen * hens;
        const totalWeekly = weeklyPerHen * hens;
        const totalDaily = dailyPerHen * hens;
        const dozenPerWeek = totalWeekly / 12;

        return {
          primary: {
            label: "Weekly Egg Production",
            value: formatNumber(totalWeekly, 1),
            suffix: "eggs/week",
          },
          details: [
            { label: "Daily (total flock)", value: formatNumber(totalDaily, 1) + " eggs" },
            { label: "Dozens per Week", value: formatNumber(dozenPerWeek, 1) },
            { label: "Annual Production", value: formatNumber(totalAnnual, 0) + " eggs (" + formatNumber(totalAnnual / 12, 0) + " dozen)" },
            { label: "Per Hen (annual adj.)", value: formatNumber(annualPerHen, 0) + " eggs" },
            { label: "Lay Rate", value: formatNumber(dailyPerHen * 100, 0) + "%" },
          ],
        };
      },
    },
    {
      id: "feed-cost",
      name: "Feed Cost Analysis",
      description: "Calculate feed costs and egg cost per dozen",
      fields: [
        {
          name: "hens",
          label: "Number of Hens",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "feedCost",
          label: "Feed Cost per 50lb bag ($)",
          type: "number",
          placeholder: "e.g. 18",
          defaultValue: 18,
        },
        {
          name: "eggsPerYear",
          label: "Eggs per Hen per Year",
          type: "number",
          placeholder: "e.g. 250",
          defaultValue: 250,
        },
        {
          name: "storeEggPrice",
          label: "Store Egg Price per Dozen ($)",
          type: "number",
          placeholder: "e.g. 4.00",
          step: 0.01,
          defaultValue: 4,
        },
      ],
      calculate: (inputs) => {
        const hens = parseFloat(inputs.hens as string);
        const feedCostPer50 = parseFloat(inputs.feedCost as string);
        const eggsPerYear = parseFloat(inputs.eggsPerYear as string);
        const storePrice = parseFloat(inputs.storeEggPrice as string);
        if ([hens, feedCostPer50, eggsPerYear, storePrice].some((v) => isNaN(v) || v <= 0)) return null;

        // Average hen eats ~1/4 lb of feed per day
        const feedPerHenPerDay = 0.25; // lbs
        const annualFeedLbs = hens * feedPerHenPerDay * 365;
        const bagsPerYear = annualFeedLbs / 50;
        const annualFeedCost = bagsPerYear * feedCostPer50;

        const totalEggs = hens * eggsPerYear;
        const dozenPerYear = totalEggs / 12;
        const costPerDozen = annualFeedCost / dozenPerYear;
        const annualStoreCost = dozenPerYear * storePrice;
        const annualSavings = annualStoreCost - annualFeedCost;

        return {
          primary: {
            label: "Cost per Dozen (feed only)",
            value: formatNumber(costPerDozen, 2),
            suffix: "$/dozen",
          },
          details: [
            { label: "Annual Feed Cost", value: "$" + formatNumber(annualFeedCost, 2) },
            { label: "Feed Bags/Year", value: formatNumber(bagsPerYear, 1) + " (50 lb bags)" },
            { label: "Total Eggs/Year", value: formatNumber(totalEggs) + " (" + formatNumber(dozenPerYear, 0) + " dozen)" },
            { label: "Store Cost Equivalent", value: "$" + formatNumber(annualStoreCost, 2) + "/year" },
            { label: "Annual Savings vs Store", value: "$" + formatNumber(annualSavings, 2) },
          ],
          note: "Feed cost only. Does not include coop, bedding, veterinary care, or initial chick/hen cost.",
        };
      },
    },
  ],
  relatedSlugs: ["composting-worm-calc", "beehive-honey-calc", "greenhouse-ventilation"],
  faq: [
    {
      question: "How many eggs will my chickens lay per day?",
      answer:
        "A healthy hen at peak production (1-2 years old) lays about 5-6 eggs per week or roughly one egg every 25-27 hours. Production varies by breed: Leghorns produce about 280/year while heritage breeds may produce 150-200/year. Expect reduced output in winter.",
    },
    {
      question: "When do chickens stop laying eggs?",
      answer:
        "Chickens never fully stop but production declines each year. After peak at 1-2 years, expect 10-20% fewer eggs per year. A 4-year-old hen may produce only 50% of her peak output. Most backyard flocks remain economically productive for 3-4 years.",
    },
    {
      question: "How much does it cost to raise backyard chickens for eggs?",
      answer:
        "Feed alone costs about $1.50-3.00 per dozen eggs. Adding coop costs ($200-500 amortized), bedding, and health care, realistic costs are $3-6 per dozen in the first year, dropping to $2-4 in subsequent years. The value is in freshness, welfare, and enjoyment.",
    },
  ],
  formula:
    "Annual Eggs = Breed Rate x Age Factor x Season Factor x Hens | Feed Cost/Dozen = Annual Feed Cost / (Total Eggs / 12)",
};
