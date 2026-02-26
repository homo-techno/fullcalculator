import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const breastmilkStorageCalculator: CalculatorDefinition = {
  slug: "breastmilk-storage-calculator",
  title: "Breastmilk Storage Calculator",
  description:
    "Calculate breastmilk storage times and guidelines. Determine how long expressed breastmilk can be safely stored at room temperature, in the fridge, or freezer.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "breastmilk storage",
    "breast milk storage guidelines",
    "pumped milk storage",
    "breastmilk expiration",
    "milk storage calculator",
    "expressed milk",
    "breastfeeding storage",
  ],
  variants: [
    {
      id: "storage-time",
      name: "Storage Time Calculator",
      description: "Calculate remaining safe storage time based on when milk was expressed and storage method",
      fields: [
        {
          name: "hoursAgo",
          label: "Hours Since Milk Was Expressed",
          type: "number",
          placeholder: "e.g. 2",
          suffix: "hours",
          min: 0,
          max: 8760,
          step: 0.5,
        },
        {
          name: "storageMethod",
          label: "Storage Method",
          type: "select",
          options: [
            { label: "Room Temperature (77\u00B0F / 25\u00B0C)", value: "room" },
            { label: "Insulated Cooler with Ice Packs", value: "cooler" },
            { label: "Refrigerator (40\u00B0F / 4\u00B0C)", value: "fridge" },
            { label: "Freezer (0\u00B0F / -18\u00B0C)", value: "freezer" },
            { label: "Deep Freezer (-4\u00B0F / -20\u00B0C)", value: "deep_freezer" },
          ],
        },
        {
          name: "milkType",
          label: "Milk Type",
          type: "select",
          options: [
            { label: "Freshly Expressed", value: "fresh" },
            { label: "Previously Frozen (thawed)", value: "thawed" },
          ],
        },
      ],
      calculate: (inputs) => {
        const hoursAgo = parseFloat(inputs.hoursAgo as string);
        const storageMethod = inputs.storageMethod as string;
        const milkType = inputs.milkType as string;

        if (isNaN(hoursAgo) || !storageMethod || !milkType) return null;

        // CDC/ABM guidelines for storage duration (in hours)
        let maxHours: number;
        let guideline: string;
        let optimalHours: number;

        if (milkType === "thawed") {
          // Thawed milk has shorter storage times
          switch (storageMethod) {
            case "room":
              maxHours = 2;
              optimalHours = 1;
              guideline = "Use thawed milk within 1-2 hours at room temperature";
              break;
            case "cooler":
              maxHours = 4;
              optimalHours = 4;
              guideline = "Use within 4 hours in an insulated cooler";
              break;
            case "fridge":
              maxHours = 24;
              optimalHours = 24;
              guideline = "Use thawed milk within 24 hours in the fridge";
              break;
            default:
              maxHours = 0;
              optimalHours = 0;
              guideline = "Do NOT refreeze thawed breastmilk";
          }
        } else {
          // Fresh milk
          switch (storageMethod) {
            case "room":
              maxHours = 4;
              optimalHours = 4;
              guideline = "Ideal up to 4 hours (CDC), up to 6-8 hours in very clean conditions";
              break;
            case "cooler":
              maxHours = 24;
              optimalHours = 24;
              guideline = "Up to 24 hours with ice packs in an insulated cooler";
              break;
            case "fridge":
              maxHours = 96;
              optimalHours = 72;
              guideline = "Optimal: 3 days (72 hours). Acceptable: up to 4 days (96 hours)";
              break;
            case "freezer":
              maxHours = 4320; // 6 months
              optimalHours = 4320;
              guideline = "Best within 6 months. Acceptable up to 12 months.";
              break;
            case "deep_freezer":
              maxHours = 8760; // 12 months
              optimalHours = 4320; // optimal 6 months
              guideline = "Best within 6 months. Acceptable up to 12 months in deep freezer.";
              break;
            default:
              maxHours = 4;
              optimalHours = 4;
              guideline = "Use within 4 hours";
          }
        }

        const remainingHours = maxHours - hoursAgo;
        const isStillSafe = remainingHours > 0;

        let remainingDisplay: string;
        if (!isStillSafe) {
          remainingDisplay = "EXPIRED — discard this milk";
        } else if (remainingHours >= 720) {
          remainingDisplay = `~${formatNumber(remainingHours / 720, 1)} months remaining`;
        } else if (remainingHours >= 24) {
          remainingDisplay = `~${formatNumber(remainingHours / 24, 1)} days remaining`;
        } else {
          remainingDisplay = `${formatNumber(remainingHours, 1)} hours remaining`;
        }

        let statusColor: string;
        if (!isStillSafe) statusColor = "Expired";
        else if (hoursAgo > optimalHours) statusColor = "Past optimal — use soon";
        else statusColor = "Safe to use";

        return {
          primary: { label: "Storage Status", value: isStillSafe ? "Safe" : "Expired" },
          details: [
            { label: "Time Stored", value: hoursAgo >= 24 ? `${formatNumber(hoursAgo / 24, 1)} days` : `${formatNumber(hoursAgo, 1)} hours` },
            { label: "Storage Method", value: storageMethod.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()) },
            { label: "Milk Type", value: milkType === "fresh" ? "Freshly Expressed" : "Previously Frozen (Thawed)" },
            { label: "Maximum Storage", value: maxHours >= 720 ? `${formatNumber(maxHours / 720, 0)} months` : `${formatNumber(maxHours, 0)} hours` },
            { label: "Time Remaining", value: remainingDisplay },
            { label: "Status", value: statusColor },
            { label: "Guideline", value: guideline },
          ],
          note: "Based on CDC and Academy of Breastfeeding Medicine guidelines. Always use the oldest stored milk first (FIFO). Label containers with date and time expressed. When in doubt, discard.",
        };
      },
    },
    {
      id: "daily-supply",
      name: "Daily Supply Estimator",
      description: "Estimate daily breastmilk needs and pumping sessions required",
      fields: [
        {
          name: "babyAgeMonths",
          label: "Baby's Age",
          type: "select",
          options: [
            { label: "0-1 month", value: "0.5" },
            { label: "1-3 months", value: "2" },
            { label: "3-6 months", value: "4.5" },
            { label: "6-9 months (with solids)", value: "7.5" },
            { label: "9-12 months (with solids)", value: "10.5" },
          ],
        },
        {
          name: "hoursAway",
          label: "Hours Away from Baby Per Day",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "hours",
          min: 1,
          max: 24,
          step: 0.5,
        },
        {
          name: "pumpOutput",
          label: "Average Pump Output Per Session",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "oz",
          min: 0.5,
          max: 12,
          step: 0.5,
        },
      ],
      calculate: (inputs) => {
        const babyAge = parseFloat(inputs.babyAgeMonths as string);
        const hoursAway = parseFloat(inputs.hoursAway as string);
        const pumpOutput = parseFloat(inputs.pumpOutput as string);

        if (isNaN(babyAge) || isNaN(hoursAway) || isNaN(pumpOutput)) return null;

        // Average milk intake by age (oz per day)
        let dailyIntakeOz: number;
        if (babyAge < 1) dailyIntakeOz = 20;
        else if (babyAge < 3) dailyIntakeOz = 25;
        else if (babyAge < 6) dailyIntakeOz = 25;
        else if (babyAge < 9) dailyIntakeOz = 20; // supplemented with solids
        else dailyIntakeOz = 16;

        const ozPerHour = dailyIntakeOz / 24;
        const ozNeeded = ozPerHour * hoursAway;
        const sessionsNeeded = Math.ceil(ozNeeded / pumpOutput);
        const totalPumpedOz = sessionsNeeded * pumpOutput;
        const surplusOz = totalPumpedOz - ozNeeded;

        return {
          primary: { label: "Milk Needed While Away", value: `${formatNumber(ozNeeded, 1)} oz` },
          details: [
            { label: "Average Daily Intake", value: `${formatNumber(dailyIntakeOz, 0)} oz/day` },
            { label: "Oz Per Hour", value: `${formatNumber(ozPerHour, 1)} oz/hr` },
            { label: "Milk Needed", value: `${formatNumber(ozNeeded, 1)} oz for ${formatNumber(hoursAway, 1)} hours` },
            { label: "Pump Sessions Needed", value: `${formatNumber(sessionsNeeded, 0)} sessions (at ${formatNumber(pumpOutput, 1)} oz each)` },
            { label: "Total Pumped", value: `${formatNumber(totalPumpedOz, 1)} oz` },
            { label: "Surplus", value: `${formatNumber(surplusOz, 1)} oz (for stash)` },
          ],
          note: "Breastfed babies typically consume 1-1.5 oz per hour of separation. Amounts are averages and vary by baby. Build a freezer stash gradually — even 1-2 oz extra per day adds up.",
        };
      },
    },
  ],
  relatedSlugs: ["ibuprofen-dosage-calculator", "child-growth-chart-calculator", "meal-calorie-calculator"],
  faq: [
    {
      question: "How long can breastmilk stay at room temperature?",
      answer:
        "According to CDC guidelines, freshly expressed breastmilk can stay at room temperature (up to 77\u00B0F/25\u00B0C) for up to 4 hours. Previously frozen (thawed) milk should be used within 1-2 hours at room temperature.",
    },
    {
      question: "Can I combine freshly expressed milk with refrigerated milk?",
      answer:
        "Yes, but cool the freshly expressed milk in the refrigerator first before adding it to already chilled milk. Never add warm milk to frozen milk. Always label with the date of the oldest milk in the container.",
    },
    {
      question: "How do I safely thaw frozen breastmilk?",
      answer:
        "The safest method is to thaw in the refrigerator overnight (takes 12 hours). For quicker thawing, hold the container under warm running water or place in warm water. Never microwave breastmilk — it creates hot spots and destroys nutrients.",
    },
  ],
  formula:
    "Room temp: 4 hours | Insulated cooler: 24 hours | Refrigerator: 4 days (96 hours) | Freezer: 6 months | Deep freezer: 12 months | Thawed: 24 hours in fridge, 1-2 hours at room temp",
};
