import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lightYearsToKmCalculator: CalculatorDefinition = {
  slug: "light-years-to-km",
  title: "Light-Years, Parsecs & AU Converter",
  description:
    "Convert between light-years, parsecs, astronomical units (AU), and kilometers for astronomy and space science applications.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "light-year",
    "parsec",
    "AU",
    "astronomical unit",
    "astronomy",
    "space",
    "distance",
    "stars",
    "galaxy",
    "cosmic",
  ],
  variants: [
    {
      slug: "ly-convert",
      title: "Light-Years to Other Units",
      fields: [
        {
          name: "ly",
          label: "Distance (Light-Years)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const ly = parseFloat(inputs.ly as string);
        if (isNaN(ly)) return { error: "Please enter a valid light-year value." };

        const km = ly * 9.461e12;
        const au = ly * 63241.077;
        const parsecs = ly * 0.306601;
        const miles = ly * 5.8786e12;
        const meters = km * 1000;

        return {
          results: [
            { label: "Kilometers (km)", value: formatNumber(km) },
            { label: "Astronomical Units (AU)", value: formatNumber(au) },
            { label: "Parsecs (pc)", value: formatNumber(parsecs) },
            { label: "Miles", value: formatNumber(miles) },
            { label: "Meters", value: formatNumber(meters) },
          ],
        };
      },
    },
    {
      slug: "parsec-convert",
      title: "Parsecs to Other Units",
      fields: [
        {
          name: "pc",
          label: "Distance (Parsecs)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const pc = parseFloat(inputs.pc as string);
        if (isNaN(pc)) return { error: "Please enter a valid parsec value." };

        const ly = pc * 3.26156;
        const km = ly * 9.461e12;
        const au = pc * 206265;
        const miles = ly * 5.8786e12;

        return {
          results: [
            { label: "Light-Years (ly)", value: formatNumber(ly) },
            { label: "Kilometers (km)", value: formatNumber(km) },
            { label: "Astronomical Units (AU)", value: formatNumber(au) },
            { label: "Miles", value: formatNumber(miles) },
          ],
        };
      },
    },
    {
      slug: "au-convert",
      title: "Astronomical Units Converter",
      fields: [
        {
          name: "value",
          label: "Distance Value",
          type: "number",
        },
        {
          name: "unit",
          label: "Input Unit",
          type: "select",
          options: [
            { label: "Astronomical Units (AU)", value: "au" },
            { label: "Light-Years (ly)", value: "ly" },
            { label: "Parsecs (pc)", value: "pc" },
            { label: "Kilometers (km)", value: "km" },
          ],
        },
      ],
      calculate(inputs) {
        const value = parseFloat(inputs.value as string);
        const unit = inputs.unit as string;
        if (isNaN(value)) return { error: "Please enter a valid distance value." };

        let au: number;
        if (unit === "au") au = value;
        else if (unit === "ly") au = value * 63241.077;
        else if (unit === "pc") au = value * 206265;
        else au = value / 1.496e8;

        const ly = au / 63241.077;
        const pc = au / 206265;
        const km = au * 1.496e8;
        const miles = km * 0.621371;
        const lightMinutes = au * 8.317;

        return {
          results: [
            { label: "Astronomical Units (AU)", value: formatNumber(au) },
            { label: "Light-Years (ly)", value: formatNumber(ly) },
            { label: "Parsecs (pc)", value: formatNumber(pc) },
            { label: "Kilometers (km)", value: formatNumber(km) },
            { label: "Miles", value: formatNumber(miles) },
            { label: "Light-Minutes", value: formatNumber(lightMinutes) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["nautical-miles-to-km", "newtons-to-pounds", "micrograms-to-mg"],
  faq: [
    {
      question: "How far is one light-year in kilometers?",
      answer:
        "One light-year is approximately 9.461 trillion kilometers (9.461 x 10^12 km). It is the distance that light travels in one year in a vacuum, at approximately 299,792 km/s.",
    },
    {
      question: "What is a parsec?",
      answer:
        "A parsec (parallax-arcsecond) is approximately 3.262 light-years or 3.086 x 10^13 km. It is defined as the distance at which one astronomical unit subtends an angle of one arcsecond. Astronomers commonly use parsecs for interstellar distances.",
    },
    {
      question: "How far is one AU?",
      answer:
        "One Astronomical Unit (AU) is approximately 149.6 million km (1.496 x 10^8 km), roughly the average distance from the Earth to the Sun. Light takes about 8.3 minutes to travel one AU.",
    },
  ],
  formula:
    "1 ly = 9.461 x 10^12 km = 63,241 AU = 0.3066 pc | 1 pc = 3.262 ly = 206,265 AU | 1 AU = 1.496 x 10^8 km",
};
