import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const RETIREMENT_AGE_OPTIONS = [
  { label: "59.5 (Penalty-Free IRA)", value: "59.5" },
  { label: "62 (Early Social Security)", value: "62" },
  { label: "65 (Medicare Eligible)", value: "65" },
  { label: "66 (SS Full - Born 1943-1954)", value: "66" },
  { label: "67 (SS Full - Born 1960+)", value: "67" },
  { label: "70 (Max SS Benefits)", value: "70" },
];

export const retirementAgeCalculator: CalculatorDefinition = {
  slug: "retirement-age-calculator",
  title: "Retirement Age Calculator",
  description:
    "Free retirement age calculator. Find out when you can retire based on your birth date and target retirement age.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "retirement age calculator",
    "when can I retire",
    "retirement date calculator",
    "social security retirement age",
    "full retirement age",
  ],
  variants: [
    {
      id: "retirement-date",
      name: "When Can I Retire?",
      description: "Calculate your retirement date based on your birth date and target retirement age",
      fields: [
        { name: "birthYear", label: "Birth Year", type: "number", placeholder: "e.g. 1970", min: 1930, max: 2010 },
        { name: "birthMonth", label: "Birth Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "birthDay", label: "Birth Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "retireAge", label: "Target Retirement Age", type: "select", options: RETIREMENT_AGE_OPTIONS, defaultValue: "67" },
      ],
      calculate: (inputs) => {
        const year = inputs.birthYear as number;
        const month = inputs.birthMonth as number;
        const day = inputs.birthDay as number;
        const retireAge = parseFloat(inputs.retireAge as string);
        if (!year || !month || !day) return null;

        const birth = new Date(year, month - 1, day);
        const retireYears = Math.floor(retireAge);
        const retireMonths = Math.round((retireAge - retireYears) * 12);

        const retireDate = new Date(year + retireYears, month - 1 + retireMonths, day);
        const now = new Date();

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const retireDateStr = `${monthNames[retireDate.getMonth()]} ${retireDate.getDate()}, ${retireDate.getFullYear()}`;

        const isRetired = retireDate <= now;

        if (isRetired) {
          const diffMs = now.getTime() - retireDate.getTime();
          const yearsSince = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
          return {
            primary: { label: "Retirement Date", value: retireDateStr },
            details: [
              { label: "Status", value: "Already eligible to retire!" },
              { label: "Years since eligibility", value: formatNumber(yearsSince) },
            ],
          };
        }

        const diffMs = retireDate.getTime() - now.getTime();
        const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const yearsUntil = Math.floor(daysUntil / 365.25);
        const monthsUntil = Math.floor((daysUntil % 365.25) / 30.4375);

        return {
          primary: { label: "Retirement Date", value: retireDateStr },
          details: [
            { label: "Time until retirement", value: `${yearsUntil} years, ${monthsUntil} months` },
            { label: "Days until retirement", value: formatNumber(daysUntil) },
            { label: "Retirement age", value: `${retireAge}` },
            { label: "Weeks until retirement", value: formatNumber(Math.floor(daysUntil / 7)) },
          ],
        };
      },
    },
    {
      id: "custom-age",
      name: "Custom Retirement Age",
      description: "Calculate retirement date with a custom age",
      fields: [
        { name: "birthYear", label: "Birth Year", type: "number", placeholder: "e.g. 1970", min: 1930, max: 2010 },
        { name: "birthMonth", label: "Birth Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "birthDay", label: "Birth Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "retireAge", label: "Custom Retirement Age", type: "number", placeholder: "e.g. 55", min: 40, max: 80 },
      ],
      calculate: (inputs) => {
        const year = inputs.birthYear as number;
        const month = inputs.birthMonth as number;
        const day = inputs.birthDay as number;
        const retireAge = inputs.retireAge as number;
        if (!year || !month || !day || !retireAge) return null;

        const retireDate = new Date(year + retireAge, month - 1, day);
        const now = new Date();

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const retireDateStr = `${monthNames[retireDate.getMonth()]} ${retireDate.getDate()}, ${retireDate.getFullYear()}`;

        const diffMs = retireDate.getTime() - now.getTime();
        const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (daysUntil <= 0) {
          return {
            primary: { label: "Retirement Date", value: retireDateStr },
            details: [{ label: "Status", value: "Already eligible to retire!" }],
          };
        }

        const yearsUntil = Math.floor(daysUntil / 365.25);
        const monthsUntil = Math.floor((daysUntil % 365.25) / 30.4375);

        return {
          primary: { label: "Retirement Date", value: retireDateStr },
          details: [
            { label: "Time until retirement", value: `${yearsUntil} years, ${monthsUntil} months` },
            { label: "Days until retirement", value: formatNumber(daysUntil) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "age-calculator",
    "retirement-calculator",
    "savings-goal-calculator",
  ],
  faq: [
    {
      question: "What is the full retirement age for Social Security?",
      answer:
        "The full retirement age (FRA) for Social Security depends on your birth year. For those born 1943-1954, it is 66. For those born in 1960 or later, it is 67. Years in between are on a sliding scale.",
    },
    {
      question: "Can I retire early?",
      answer:
        "You can start receiving reduced Social Security benefits as early as age 62. However, your benefit will be permanently reduced by up to 30% compared to waiting until your full retirement age.",
    },
    {
      question: "When can I access my 401(k) or IRA without penalty?",
      answer:
        "You can make penalty-free withdrawals from a 401(k) or traditional IRA starting at age 59.5. Early withdrawals typically incur a 10% penalty plus income taxes.",
    },
  ],
  formula: "Retirement Date = Birth Date + Retirement Age",
};
