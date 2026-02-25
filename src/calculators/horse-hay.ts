import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const horseHayCalculator: CalculatorDefinition = {
  slug: "horse-hay-calculator",
  title: "Horse Hay Calculator",
  description:
    "Free horse hay calculator. Estimate daily and annual hay requirements for your horses based on body weight, workload, hay type, and pasture access.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "horse hay calculator",
    "horse feed calculator",
    "how much hay horse",
    "horse forage needs",
    "equine nutrition calculator",
  ],
  variants: [
    {
      id: "hay-requirements",
      name: "Horse Hay Requirements",
      description: "Calculate daily and annual hay needs for your horses",
      fields: [
        {
          name: "horseWeight",
          label: "Horse Body Weight",
          type: "number",
          placeholder: "e.g. 1000",
          suffix: "lbs",
          min: 300,
          max: 2500,
        },
        {
          name: "numberOfHorses",
          label: "Number of Horses",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 20,
        },
        {
          name: "workload",
          label: "Workload / Activity",
          type: "select",
          options: [
            { label: "Light (trail riding, leisure)", value: "light" },
            { label: "Moderate (regular riding/training)", value: "moderate" },
            { label: "Heavy (competition, hard work)", value: "heavy" },
            { label: "Maintenance (idle/retired)", value: "maintenance" },
          ],
          defaultValue: "light",
        },
        {
          name: "hayType",
          label: "Hay Type",
          type: "select",
          options: [
            { label: "Grass Hay (timothy, orchard)", value: "grass" },
            { label: "Alfalfa (legume)", value: "alfalfa" },
            { label: "Mixed Grass/Alfalfa", value: "mixed" },
          ],
          defaultValue: "grass",
        },
        {
          name: "pastureAccess",
          label: "Pasture Access",
          type: "select",
          options: [
            { label: "No pasture (stall/dry lot)", value: "none" },
            { label: "Limited pasture (few hours)", value: "limited" },
            { label: "Full pasture (turnout all day)", value: "full" },
          ],
          defaultValue: "limited",
        },
        {
          name: "season",
          label: "Season",
          type: "select",
          options: [
            { label: "Spring/Summer (growing season)", value: "growing" },
            { label: "Fall/Winter (no pasture growth)", value: "dormant" },
          ],
          defaultValue: "growing",
        },
      ],
      calculate: (inputs) => {
        const horseWeight = inputs.horseWeight as number;
        const numberOfHorses = inputs.numberOfHorses as number;
        const workload = inputs.workload as string;
        const hayType = inputs.hayType as string;
        const pastureAccess = inputs.pastureAccess as string;
        const season = inputs.season as string;
        if (!horseWeight || !numberOfHorses) return null;

        // Base forage: 1.5-2.5% of body weight per day
        let foragePercent: number;
        switch (workload) {
          case "heavy": foragePercent = 2.5; break;
          case "moderate": foragePercent = 2.2; break;
          case "light": foragePercent = 2.0; break;
          case "maintenance": foragePercent = 1.5; break;
          default: foragePercent = 2.0;
        }

        const totalForagePerDay = (horseWeight * foragePercent) / 100;

        // Pasture adjustment
        let pastureContribution = 0; // lbs of forage from pasture
        if (pastureAccess === "full" && season === "growing") {
          pastureContribution = totalForagePerDay * 0.6;
        } else if (pastureAccess === "limited" && season === "growing") {
          pastureContribution = totalForagePerDay * 0.3;
        } else if (pastureAccess === "full" && season === "dormant") {
          pastureContribution = totalForagePerDay * 0.15;
        }

        const hayPerDayPerHorse = Math.max(totalForagePerDay - pastureContribution, totalForagePerDay * 0.5);
        const hayPerDayTotal = hayPerDayPerHorse * numberOfHorses;
        const hayPerMonthTotal = hayPerDayTotal * 30;
        const hayPerYearTotal = hayPerDayTotal * 365;

        // Standard bale weights: small square ~50 lbs, round ~800 lbs
        const smallBalesPerMonth = Math.ceil(hayPerMonthTotal / 50);
        const smallBalesPerYear = Math.ceil(hayPerYearTotal / 50);
        const roundBalesPerMonth = hayPerMonthTotal / 800;

        // Cost estimates
        const costPerSmallBale = hayType === "alfalfa" ? 12 : hayType === "mixed" ? 9 : 7;
        const monthlyCost = smallBalesPerMonth * costPerSmallBale;
        const annualCost = smallBalesPerYear * costPerSmallBale;

        // Hay type note
        let hayNote = "";
        if (hayType === "alfalfa") {
          hayNote = "Alfalfa is high in protein and calories. May not be suitable for easy keepers, insulin-resistant horses, or idle horses. Best mixed with grass hay.";
        }

        return {
          primary: {
            label: "Hay Per Horse Per Day",
            value: `${formatNumber(hayPerDayPerHorse, 1)} lbs`,
          },
          details: [
            { label: "Total Flock Daily", value: `${formatNumber(hayPerDayTotal, 1)} lbs` },
            { label: "Monthly (all horses)", value: `${formatNumber(hayPerMonthTotal, 0)} lbs` },
            { label: "Annual (all horses)", value: `${formatNumber(hayPerYearTotal, 0)} lbs` },
            { label: "Small Bales per Month", value: `${smallBalesPerMonth} bales (50 lb)` },
            { label: "Small Bales per Year", value: `${smallBalesPerYear} bales` },
            { label: "Est. Monthly Cost", value: `$${formatNumber(monthlyCost, 0)}` },
            { label: "Est. Annual Cost", value: `$${formatNumber(annualCost, 0)}` },
          ],
          note: hayNote || undefined,
        };
      },
    },
  ],
  relatedSlugs: ["chicken-feed-calculator", "pet-calorie-burn-calculator"],
  faq: [
    {
      question: "How much hay does a horse eat per day?",
      answer:
        "A horse should eat 1.5-2.5% of its body weight in forage daily. For a 1,000 lb horse, this is 15-25 lbs of hay per day. The exact amount depends on workload, body condition, hay quality, and pasture access.",
    },
    {
      question: "Can a horse eat too much hay?",
      answer:
        "Most horses self-regulate hay intake well, and free-choice grass hay is generally safe. However, horses prone to obesity or metabolic issues (insulin resistance, Cushing's) may need restricted hay amounts. Alfalfa should be limited due to high calorie and protein content.",
    },
    {
      question: "How should I store hay?",
      answer:
        "Store hay in a dry, well-ventilated area off the ground (on pallets). Keep it away from direct sunlight and moisture. Properly stored hay maintains quality for up to a year. Never feed moldy or dusty hay as it can cause respiratory problems and colic.",
    },
  ],
  formula:
    "Daily Hay = (Horse Weight x Forage % / 100) - Pasture Contribution | Annual = Daily x 365",
};
