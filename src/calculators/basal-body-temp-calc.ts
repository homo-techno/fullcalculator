import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const basalBodyTempCalculator: CalculatorDefinition = {
  slug: "basal-body-temp-calculator",
  title: "Basal Body Temperature Calculator",
  description:
    "Track basal body temperature to detect ovulation. Analyze temperature shifts to identify your fertile window and confirm ovulation for fertility planning.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "basal body temperature",
    "BBT calculator",
    "ovulation detection",
    "fertility tracking",
    "temperature charting",
    "BBT shift",
    "luteal phase temperature",
  ],
  variants: [
    {
      id: "bbt-shift",
      name: "BBT Shift Analysis",
      description: "Analyze pre- and post-ovulation temperatures to detect a thermal shift",
      fields: [
        {
          name: "preOvulationAvg",
          label: "Average Pre-Ovulation Temp (last 6 days)",
          type: "number",
          placeholder: "e.g. 97.4",
          suffix: "\u00B0F",
          min: 95,
          max: 100,
          step: 0.01,
        },
        {
          name: "postOvulationTemp1",
          label: "Post-Ovulation Day 1 Temp",
          type: "number",
          placeholder: "e.g. 97.8",
          suffix: "\u00B0F",
          min: 95,
          max: 100,
          step: 0.01,
        },
        {
          name: "postOvulationTemp2",
          label: "Post-Ovulation Day 2 Temp",
          type: "number",
          placeholder: "e.g. 97.9",
          suffix: "\u00B0F",
          min: 95,
          max: 100,
          step: 0.01,
        },
        {
          name: "postOvulationTemp3",
          label: "Post-Ovulation Day 3 Temp",
          type: "number",
          placeholder: "e.g. 98.0",
          suffix: "\u00B0F",
          min: 95,
          max: 100,
          step: 0.01,
        },
      ],
      calculate: (inputs) => {
        const preAvg = parseFloat(inputs.preOvulationAvg as string);
        const post1 = parseFloat(inputs.postOvulationTemp1 as string);
        const post2 = parseFloat(inputs.postOvulationTemp2 as string);
        const post3 = parseFloat(inputs.postOvulationTemp3 as string);

        if (isNaN(preAvg) || isNaN(post1) || isNaN(post2) || isNaN(post3)) return null;

        const coverlineTemp = preAvg + 0.1;
        const postAvg = (post1 + post2 + post3) / 3;
        const shift = postAvg - preAvg;
        const allAboveCoverline = post1 > coverlineTemp && post2 > coverlineTemp && post3 > coverlineTemp;
        const hasSignificantShift = shift >= 0.2;

        let ovulationStatus: string;
        if (allAboveCoverline && hasSignificantShift) {
          ovulationStatus = "Ovulation likely confirmed — sustained thermal shift detected";
        } else if (shift >= 0.1) {
          ovulationStatus = "Possible ovulation — shift is borderline, continue tracking";
        } else {
          ovulationStatus = "No clear thermal shift — ovulation not confirmed";
        }

        const preAvgC = (preAvg - 32) * 5 / 9;
        const postAvgC = (postAvg - 32) * 5 / 9;

        return {
          primary: { label: "Temperature Shift", value: `${formatNumber(shift, 2)}\u00B0F` },
          details: [
            { label: "Pre-Ovulation Average", value: `${formatNumber(preAvg, 2)}\u00B0F (${formatNumber(preAvgC, 2)}\u00B0C)` },
            { label: "Post-Ovulation Average", value: `${formatNumber(postAvg, 2)}\u00B0F (${formatNumber(postAvgC, 2)}\u00B0C)` },
            { label: "Coverline Temperature", value: `${formatNumber(coverlineTemp, 2)}\u00B0F` },
            { label: "All 3 Days Above Coverline", value: allAboveCoverline ? "Yes" : "No" },
            { label: "Ovulation Status", value: ovulationStatus },
          ],
          note: "A sustained rise of 0.2\u00B0F or more above the coverline for 3 consecutive days typically confirms ovulation. BBT can only confirm ovulation after it occurs, not predict it in advance.",
        };
      },
    },
    {
      id: "temp-conversion",
      name: "BBT Temperature Converter",
      description: "Convert basal body temperature between Fahrenheit and Celsius",
      fields: [
        {
          name: "temperature",
          label: "Temperature",
          type: "number",
          placeholder: "e.g. 97.6",
          min: 30,
          max: 110,
          step: 0.01,
        },
        {
          name: "unit",
          label: "Input Unit",
          type: "select",
          options: [
            { label: "Fahrenheit (\u00B0F)", value: "f" },
            { label: "Celsius (\u00B0C)", value: "c" },
          ],
        },
      ],
      calculate: (inputs) => {
        const temp = parseFloat(inputs.temperature as string);
        const unit = inputs.unit as string;

        if (isNaN(temp)) return null;

        let fahrenheit: number;
        let celsius: number;

        if (unit === "c") {
          celsius = temp;
          fahrenheit = temp * 9 / 5 + 32;
        } else {
          fahrenheit = temp;
          celsius = (temp - 32) * 5 / 9;
        }

        let bbtRange: string;
        if (fahrenheit < 97.0) bbtRange = "Below typical BBT range";
        else if (fahrenheit <= 97.7) bbtRange = "Typical pre-ovulation (follicular phase)";
        else if (fahrenheit <= 98.6) bbtRange = "Typical post-ovulation (luteal phase)";
        else bbtRange = "Above typical BBT range";

        return {
          primary: { label: "Converted Temperature", value: unit === "c" ? `${formatNumber(fahrenheit, 2)}\u00B0F` : `${formatNumber(celsius, 2)}\u00B0C` },
          details: [
            { label: "Fahrenheit", value: `${formatNumber(fahrenheit, 2)}\u00B0F` },
            { label: "Celsius", value: `${formatNumber(celsius, 2)}\u00B0C` },
            { label: "BBT Phase Estimate", value: bbtRange },
          ],
          note: "Typical pre-ovulation BBT is 97.0-97.7\u00B0F (36.1-36.5\u00B0C). Post-ovulation BBT rises to 97.8-98.6\u00B0F (36.6-37.0\u00B0C) due to progesterone.",
        };
      },
    },
  ],
  relatedSlugs: ["luteal-phase-calculator", "clomid-ovulation-calculator", "period-calculator"],
  faq: [
    {
      question: "What is a basal body temperature shift?",
      answer:
        "A BBT shift is a sustained rise in resting body temperature (typically 0.2-0.5\u00B0F) that occurs after ovulation due to the hormone progesterone. When your temperature stays elevated for at least 3 consecutive days above the coverline, ovulation is confirmed.",
    },
    {
      question: "When should I take my basal body temperature?",
      answer:
        "Take your BBT first thing in the morning before getting out of bed, talking, or eating. Use a BBT thermometer (accurate to 0.01\u00B0F) and take it at the same time each day. At least 3 hours of uninterrupted sleep is recommended for accuracy.",
    },
    {
      question: "Can BBT predict ovulation in advance?",
      answer:
        "BBT alone cannot predict ovulation before it happens — it only confirms ovulation after the fact via the thermal shift. To predict ovulation, combine BBT with cervical mucus monitoring or OPK (ovulation predictor kit) testing.",
    },
  ],
  formula:
    "Coverline = Pre-Ovulation Average + 0.1\u00B0F | Thermal Shift = Post-Ovulation Average - Pre-Ovulation Average | Ovulation confirmed if 3 consecutive temps above coverline with shift >= 0.2\u00B0F",
};
