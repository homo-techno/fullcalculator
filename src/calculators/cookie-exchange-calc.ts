import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cookieExchangeCalculator: CalculatorDefinition = {
  slug: "cookie-exchange-calculator",
  title: "Cookie Exchange Quantity Planner",
  description:
    "Free cookie exchange calculator. Plan how many cookies each person should bake and bring for a cookie swap party based on number of participants.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cookie exchange calculator",
    "cookie swap planner",
    "cookie exchange quantities",
    "cookie party calculator",
    "holiday cookie exchange",
    "how many cookies to bake",
  ],
  variants: [
    {
      id: "standard",
      name: "Standard Cookie Exchange",
      description:
        "Calculate how many cookies each participant should bake",
      fields: [
        {
          name: "participants",
          label: "Number of Participants",
          type: "number",
          placeholder: "e.g. 10",
          min: 2,
          step: 1,
        },
        {
          name: "cookiesPerVariety",
          label: "Cookies of Each Type to Take Home",
          type: "select",
          options: [
            { label: "1 dozen (12) of each variety", value: "12" },
            { label: "Half dozen (6) of each variety", value: "6" },
            { label: "2 cookies of each variety", value: "2" },
            { label: "3 cookies of each variety", value: "3" },
          ],
          defaultValue: "12",
        },
        {
          name: "extraForTasting",
          label: "Extra Cookies for Tasting at Party?",
          type: "select",
          options: [
            { label: "Yes (+1 dozen extra)", value: "12" },
            { label: "Yes (+half dozen extra)", value: "6" },
            { label: "No extra", value: "0" },
          ],
          defaultValue: "12",
        },
      ],
      calculate: (inputs) => {
        const participants = parseFloat(inputs.participants as string);
        const perVariety = parseFloat(inputs.cookiesPerVariety as string);
        const extra = parseFloat(inputs.extraForTasting as string);
        if (!participants || participants <= 1) return null;

        // Each participant bakes enough for every other participant + extras
        const cookiesPerPerson = (participants - 1) * perVariety + extra;
        const totalCookiesAtParty = participants * cookiesPerPerson;
        const cookiesEachGoesHomeWith = (participants - 1) * perVariety;
        const varietiesEachGetsHomeWith = participants - 1;

        // Estimate batches (standard recipe makes ~36-48 cookies)
        const batches = Math.ceil(cookiesPerPerson / 36);

        return {
          primary: {
            label: `Cookie exchange with ${formatNumber(participants)} people`,
            value: `${formatNumber(cookiesPerPerson)} cookies each`,
          },
          details: [
            { label: "Each Person Bakes", value: `${formatNumber(cookiesPerPerson)} cookies (1 variety)` },
            { label: "Estimated Batches Needed", value: `${formatNumber(batches)} batch(es) (~36 per batch)` },
            { label: "Total Cookies at Party", value: formatNumber(totalCookiesAtParty) },
            { label: "Each Takes Home", value: `${formatNumber(cookiesEachGoesHomeWith)} cookies` },
            { label: "Varieties Each Gets", value: `${formatNumber(varietiesEachGetsHomeWith)} different types` },
          ],
          note: "Each participant bakes ONE type of cookie in bulk. At the exchange, everyone swaps equal portions so each person goes home with a variety of different cookies.",
        };
      },
    },
    {
      id: "by-cookies",
      name: "By Cookie Count",
      description: "Work backwards from how many cookies you want to bake",
      fields: [
        {
          name: "cookiesCanBake",
          label: "Total Cookies You Can Bake",
          type: "number",
          placeholder: "e.g. 120",
          min: 12,
          step: 6,
        },
        {
          name: "participants",
          label: "Number of Participants",
          type: "number",
          placeholder: "e.g. 10",
          min: 2,
          step: 1,
        },
      ],
      calculate: (inputs) => {
        const canBake = parseFloat(inputs.cookiesCanBake as string);
        const participants = parseFloat(inputs.participants as string);
        if (!canBake || !participants || participants <= 1) return null;

        const perSwapper = Math.floor(canBake / (participants - 1));
        const leftoverForTasting = canBake - perSwapper * (participants - 1);
        const takesHome = perSwapper * (participants - 1);

        return {
          primary: {
            label: `${formatNumber(canBake)} cookies / ${formatNumber(participants)} participants`,
            value: `${formatNumber(perSwapper)} per person`,
          },
          details: [
            { label: "Cookies per Participant", value: formatNumber(perSwapper) },
            { label: "Extra for Tasting", value: formatNumber(leftoverForTasting) },
            { label: "Cookies You Take Home", value: `${formatNumber(takesHome)} (${formatNumber(participants - 1)} varieties)` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "potluck-planner-calculator",
    "cooking-converter",
    "brunch-planner-calculator",
  ],
  faq: [
    {
      question: "How many cookies should each person bring to a cookie exchange?",
      answer:
        "The standard formula is: (Number of Participants - 1) x cookies you want each person to take home of your variety. For 10 people bringing 1 dozen of each type: each person bakes (10-1) x 12 = 108 cookies, plus extras for tasting.",
    },
    {
      question: "How do I organize a cookie exchange?",
      answer:
        "Set a date 2-4 weeks out. Ask each participant to bake one type of cookie in the required quantity. Have everyone bring cookies in individual bags/portions for easy swapping. Provide labels for each cookie type. Include recipe cards to share.",
    },
    {
      question: "What are good cookies for a cookie exchange?",
      answer:
        "Choose cookies that travel well and stay fresh: sugar cookies, snickerdoodles, gingerbread, shortbread, biscotti, and chocolate chip cookies are popular choices. Avoid delicate or cream-filled cookies that do not hold up to transport.",
    },
  ],
  formula:
    "Cookies to Bake = (Participants - 1) x Cookies per Variety + Extra for Tasting | Standard: 1 dozen per variety",
};
