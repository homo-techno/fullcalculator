import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const anniversaryCalculator: CalculatorDefinition = {
  slug: "anniversary-calculator",
  title: "Anniversary Calculator",
  description:
    "Free anniversary calculator. Calculate how long you have been together in years, months, and days. Find your next anniversary date.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "anniversary calculator",
    "how long together",
    "relationship duration",
    "wedding anniversary calculator",
    "years months days together",
  ],
  variants: [
    {
      id: "anniversary",
      name: "Anniversary Duration",
      description: "Calculate how long since your anniversary date",
      fields: [
        { name: "startYear", label: "Anniversary Year", type: "number", placeholder: "e.g. 2015", min: 1900, max: 2026 },
        { name: "startMonth", label: "Anniversary Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "startDay", label: "Anniversary Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const sy = inputs.startYear as number;
        const sm = inputs.startMonth as number;
        const sd = inputs.startDay as number;
        if (!sy || !sm || !sd) return null;

        const start = new Date(sy, sm - 1, sd);
        const now = new Date();
        if (start > now) return null;

        let years = now.getFullYear() - start.getFullYear();
        let months = now.getMonth() - start.getMonth();
        let days = now.getDate() - start.getDate();

        if (days < 0) {
          months--;
          const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
          days += prevMonth.getDate();
        }
        if (months < 0) {
          years--;
          months += 12;
        }

        const totalDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = years * 12 + months;
        const totalHours = totalDays * 24;

        // Next anniversary
        let nextAnniversary = new Date(now.getFullYear(), sm - 1, sd);
        if (nextAnniversary <= now) {
          nextAnniversary = new Date(now.getFullYear() + 1, sm - 1, sd);
        }
        const daysUntilNext = Math.ceil((nextAnniversary.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const nextYear = years + 1;

        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // Traditional anniversary name
        const anniversaryNames: Record<number, string> = {
          1: "Paper", 2: "Cotton", 3: "Leather", 4: "Fruit/Flowers",
          5: "Wood", 6: "Candy/Iron", 7: "Wool/Copper", 8: "Pottery/Bronze",
          9: "Pottery/Willow", 10: "Tin/Aluminum", 15: "Crystal",
          20: "China", 25: "Silver", 30: "Pearl", 35: "Coral",
          40: "Ruby", 45: "Sapphire", 50: "Gold", 55: "Emerald",
          60: "Diamond", 75: "Diamond/Platinum",
        };
        const nextName = anniversaryNames[nextYear] || "";

        return {
          primary: {
            label: "Time Together",
            value: `${years} years, ${months} months, ${days} days`,
          },
          details: [
            { label: "Total months", value: formatNumber(totalMonths) },
            { label: "Total weeks", value: formatNumber(totalWeeks) },
            { label: "Total days", value: formatNumber(totalDays) },
            { label: "Total hours", value: formatNumber(totalHours) },
            { label: `Next anniversary (${nextYear}${nextName ? " - " + nextName : ""})`, value: `${dayNames[nextAnniversary.getDay()]}, ${monthNames[sm - 1]} ${sd}, ${nextAnniversary.getFullYear()}` },
            { label: "Days until next anniversary", value: formatNumber(daysUntilNext) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "age-calculator",
    "days-between-dates-calculator",
    "countdown-days-calculator",
  ],
  faq: [
    {
      question: "What are the traditional anniversary names?",
      answer:
        "Common traditional names: 1st = Paper, 5th = Wood, 10th = Tin, 15th = Crystal, 20th = China, 25th = Silver, 30th = Pearl, 40th = Ruby, 50th = Gold, 60th = Diamond.",
    },
    {
      question: "How is the duration calculated?",
      answer:
        "The calculator computes the exact difference in years, months, and days from your anniversary date to today, properly accounting for varying month lengths and leap years.",
    },
  ],
  formula: "Duration = Current Date - Anniversary Date (in years, months, days)",
};
