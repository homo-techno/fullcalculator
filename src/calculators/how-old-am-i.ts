import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const howOldAmICalculator: CalculatorDefinition = {
  slug: "how-old-am-i",
  title: "How Old Am I Calculator",
  description: "Calculate your exact age in years, months, days, hours, and minutes from your date of birth.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["how old am i", "exact age", "age calculator", "date of birth", "age in days"],
  variants: [
    {
      id: "calc",
      name: "Calculate Exact Age",
      fields: [
        { name: "birthYear", label: "Birth Year", type: "number", placeholder: "e.g. 1990", min: 1900, max: 2026 },
        { name: "birthMonth", label: "Birth Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "birthDay", label: "Birth Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const birthYear = Number(inputs.birthYear);
        const birthMonth = Number(inputs.birthMonth);
        const birthDay = Number(inputs.birthDay);
        if (!birthYear || !birthMonth || !birthDay) return null;

        const now = new Date();
        const birth = new Date(birthYear, birthMonth - 1, birthDay);
        if (birth > now) return null;

        const diffMs = now.getTime() - birth.getTime();
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const totalWeeks = Math.floor(totalDays / 7);

        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        let days = now.getDate() - birth.getDate();
        if (days < 0) {
          months--;
          const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
          days += prevMonth.getDate();
        }
        if (months < 0) {
          years--;
          months += 12;
        }

        const nextBirthday = new Date(now.getFullYear(), birthMonth - 1, birthDay);
        if (nextBirthday <= now) {
          nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }
        const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return {
          primary: { label: "Your Age", value: years + " years, " + months + " months, " + days + " days" },
          details: [
            { label: "Age in Years", value: formatNumber(years) },
            { label: "Age in Months", value: formatNumber(years * 12 + months) },
            { label: "Age in Weeks", value: formatNumber(totalWeeks) },
            { label: "Age in Days", value: formatNumber(totalDays) },
            { label: "Age in Hours", value: formatNumber(totalHours) },
            { label: "Age in Minutes", value: formatNumber(totalMinutes) },
            { label: "Days Until Next Birthday", value: formatNumber(daysUntilBirthday) },
          ],
          note: "Calculated based on today's date. Hours and minutes are approximate.",
        };
      },
    },
  ],
  relatedSlugs: ["age-calculator", "age-in-days-calculator", "birthday-calculator"],
  faq: [
    { question: "How is exact age calculated?", answer: "We compute the difference between your birth date and today, breaking it down into years, months, and days, accounting for varying month lengths." },
    { question: "Does this account for leap years?", answer: "Yes. The calculation uses actual calendar dates, so leap years are included automatically." },
  ],
  formula: "Exact Age = Current Date - Birth Date (broken into years, months, days, hours, minutes)",
};
