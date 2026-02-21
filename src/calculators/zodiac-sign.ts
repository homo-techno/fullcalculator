import type { CalculatorDefinition } from "./types";

export const zodiacSignCalculator: CalculatorDefinition = {
  slug: "zodiac-sign-calculator",
  title: "Zodiac Sign Calculator",
  description:
    "Free zodiac sign calculator. Enter your birth month and day to find your Western zodiac sign, date range, and element.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "zodiac sign",
    "horoscope",
    "astrology",
    "star sign",
    "birth sign",
    "zodiac element",
  ],
  variants: [
    {
      id: "calc",
      name: "Find Your Zodiac Sign",
      fields: [
        {
          name: "month",
          label: "Birth Month (1-12)",
          type: "number",
          placeholder: "e.g. 7",
        },
        {
          name: "day",
          label: "Birth Day (1-31)",
          type: "number",
          placeholder: "e.g. 22",
        },
      ],
      calculate: (inputs) => {
        const month = inputs.month as number;
        const day = inputs.day as number;

        if (!month || !day) return null;
        if (month < 1 || month > 12 || day < 1 || day > 31) return null;

        const signs = [
          {
            name: "Capricorn",
            startMonth: 12,
            startDay: 22,
            endMonth: 1,
            endDay: 19,
            element: "Earth",
            range: "Dec 22 - Jan 19",
          },
          {
            name: "Aquarius",
            startMonth: 1,
            startDay: 20,
            endMonth: 2,
            endDay: 18,
            element: "Air",
            range: "Jan 20 - Feb 18",
          },
          {
            name: "Pisces",
            startMonth: 2,
            startDay: 19,
            endMonth: 3,
            endDay: 20,
            element: "Water",
            range: "Feb 19 - Mar 20",
          },
          {
            name: "Aries",
            startMonth: 3,
            startDay: 21,
            endMonth: 4,
            endDay: 19,
            element: "Fire",
            range: "Mar 21 - Apr 19",
          },
          {
            name: "Taurus",
            startMonth: 4,
            startDay: 20,
            endMonth: 5,
            endDay: 20,
            element: "Earth",
            range: "Apr 20 - May 20",
          },
          {
            name: "Gemini",
            startMonth: 5,
            startDay: 21,
            endMonth: 6,
            endDay: 20,
            element: "Air",
            range: "May 21 - Jun 20",
          },
          {
            name: "Cancer",
            startMonth: 6,
            startDay: 21,
            endMonth: 7,
            endDay: 22,
            element: "Water",
            range: "Jun 21 - Jul 22",
          },
          {
            name: "Leo",
            startMonth: 7,
            startDay: 23,
            endMonth: 8,
            endDay: 22,
            element: "Fire",
            range: "Jul 23 - Aug 22",
          },
          {
            name: "Virgo",
            startMonth: 8,
            startDay: 23,
            endMonth: 9,
            endDay: 22,
            element: "Earth",
            range: "Aug 23 - Sep 22",
          },
          {
            name: "Libra",
            startMonth: 9,
            startDay: 23,
            endMonth: 10,
            endDay: 22,
            element: "Air",
            range: "Sep 23 - Oct 22",
          },
          {
            name: "Scorpio",
            startMonth: 10,
            startDay: 23,
            endMonth: 11,
            endDay: 21,
            element: "Water",
            range: "Oct 23 - Nov 21",
          },
          {
            name: "Sagittarius",
            startMonth: 11,
            startDay: 22,
            endMonth: 12,
            endDay: 21,
            element: "Fire",
            range: "Nov 22 - Dec 21",
          },
        ];

        let sign = signs[0]; // default Capricorn
        const dateVal = month * 100 + day;

        if (dateVal >= 120 && dateVal <= 218) sign = signs[1];
        else if (dateVal >= 219 && dateVal <= 320) sign = signs[2];
        else if (dateVal >= 321 && dateVal <= 419) sign = signs[3];
        else if (dateVal >= 420 && dateVal <= 520) sign = signs[4];
        else if (dateVal >= 521 && dateVal <= 620) sign = signs[5];
        else if (dateVal >= 621 && dateVal <= 722) sign = signs[6];
        else if (dateVal >= 723 && dateVal <= 822) sign = signs[7];
        else if (dateVal >= 823 && dateVal <= 922) sign = signs[8];
        else if (dateVal >= 923 && dateVal <= 1022) sign = signs[9];
        else if (dateVal >= 1023 && dateVal <= 1121) sign = signs[10];
        else if (dateVal >= 1122 && dateVal <= 1221) sign = signs[11];

        return {
          primary: {
            label: "Zodiac Sign",
            value: sign.name,
          },
          details: [
            { label: "Date Range", value: sign.range },
            { label: "Element", value: sign.element },
            { label: "Input", value: `Month ${month}, Day ${day}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["chinese-zodiac-calculator"],
  faq: [
    {
      question: "How is the zodiac sign determined?",
      answer:
        "Your Western zodiac sign is determined by the position of the Sun at the time of your birth. Each sign covers roughly 30 days of the year.",
    },
    {
      question: "What are the four elements?",
      answer:
        "The four elements are Fire (Aries, Leo, Sagittarius), Earth (Taurus, Virgo, Capricorn), Air (Gemini, Libra, Aquarius), and Water (Cancer, Scorpio, Pisces).",
    },
  ],
  formula:
    "Zodiac signs are determined by birth date ranges. Each of the 12 signs spans approximately one month and is associated with one of four elements: Fire, Earth, Air, or Water.",
};
