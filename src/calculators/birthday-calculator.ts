import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const birthdayCalculator: CalculatorDefinition = {
  slug: "birthday-calculator",
  title: "Birthday Day of the Week Calculator",
  description:
    "Free birthday calculator. Find out what day of the week you were born on and when your next birthday falls.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "birthday calculator",
    "what day was I born",
    "birthday day of week",
    "next birthday",
    "birthday countdown",
  ],
  variants: [
    {
      id: "birthday-info",
      name: "Birthday Information",
      description: "Find your birth day of the week and next birthday details",
      fields: [
        { name: "birthYear", label: "Birth Year", type: "number", placeholder: "e.g. 1990", min: 1900, max: 2026 },
        { name: "birthMonth", label: "Birth Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "birthDay", label: "Birth Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const year = inputs.birthYear as number;
        const month = inputs.birthMonth as number;
        const day = inputs.birthDay as number;
        if (!year || !month || !day) return null;

        const birth = new Date(year, month - 1, day);
        const now = new Date();
        if (birth > now) return null;

        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const birthDayOfWeek = dayNames[birth.getDay()];

        // Calculate next birthday
        let nextBirthday = new Date(now.getFullYear(), month - 1, day);
        if (nextBirthday <= now) {
          nextBirthday = new Date(now.getFullYear() + 1, month - 1, day);
        }
        const nextBirthdayDay = dayNames[nextBirthday.getDay()];
        const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const weeksUntilBirthday = Math.floor(daysUntilBirthday / 7);

        // Current age
        let ageYears = now.getFullYear() - birth.getFullYear();
        if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) {
          ageYears--;
        }
        const turningAge = ageYears + 1;

        // Total birthdays celebrated
        const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

        return {
          primary: {
            label: "Born On",
            value: `${birthDayOfWeek}, ${monthNames[month - 1]} ${day}, ${year}`,
          },
          details: [
            { label: "Birth day of week", value: birthDayOfWeek },
            { label: "Current age", value: `${ageYears} years` },
            { label: "Next birthday", value: `${nextBirthdayDay}, ${monthNames[month - 1]} ${day}, ${nextBirthday.getFullYear()}` },
            { label: "Turning age", value: `${turningAge}` },
            { label: "Days until next birthday", value: formatNumber(daysUntilBirthday) },
            { label: "Weeks until next birthday", value: formatNumber(weeksUntilBirthday) },
            { label: "Total days alive", value: formatNumber(totalDays) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "age-calculator",
    "what-day-was-calculator",
    "countdown-days-calculator",
  ],
  faq: [
    {
      question: "What day of the week was I born on?",
      answer:
        "Enter your birth year, month, and day. The calculator will tell you the exact day of the week you were born, plus when your next birthday is.",
    },
    {
      question: "How often does my birthday fall on the same day of the week?",
      answer:
        "In a non-leap year, your birthday shifts forward one day of the week. In a leap year (or when crossing one), it shifts two days. On average, your birthday falls on the same day every 5-6 years.",
    },
  ],
  formula: "Birth Day = Day of Week for (Birth Year, Birth Month, Birth Day)",
};
