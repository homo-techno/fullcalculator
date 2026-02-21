import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const runningSplitsCalculator: CalculatorDefinition = {
  slug: "running-splits-calculator",
  title: "Running Splits Calculator",
  description:
    "Free running splits calculator. Calculate per-mile or per-kilometer splits for common race distances based on your target time.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["running splits", "race pace", "per mile pace", "per km pace"],
  variants: [
    {
      id: "perKm",
      name: "Per-Kilometer Splits",
      fields: [
        {
          name: "race",
          label: "Race Distance",
          type: "select",
          options: [
            { label: "5K (5 km)", value: "5" },
            { label: "10K (10 km)", value: "10" },
            { label: "Half Marathon (21.0975 km)", value: "21.0975" },
            { label: "Marathon (42.195 km)", value: "42.195" },
          ],
        },
        {
          name: "hours",
          label: "Target Time \u2013 Hours",
          type: "number",
          placeholder: "e.g. 0",
        },
        {
          name: "minutes",
          label: "Target Time \u2013 Minutes",
          type: "number",
          placeholder: "e.g. 25",
        },
        {
          name: "seconds",
          label: "Target Time \u2013 Seconds",
          type: "number",
          placeholder: "e.g. 0",
        },
      ],
      calculate: (inputs) => {
        const distanceKm = parseFloat(inputs.race as string);
        const hours = (inputs.hours as number) || 0;
        const minutes = (inputs.minutes as number) || 0;
        const seconds = (inputs.seconds as number) || 0;
        if (!distanceKm) return null;

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        if (totalSeconds === 0) return null;

        const pacePerKmSec = totalSeconds / distanceKm;
        const paceMin = Math.floor(pacePerKmSec / 60);
        const paceSec = pacePerKmSec % 60;

        const fullKms = Math.floor(distanceKm);
        const details = [];
        for (let i = 1; i <= fullKms; i++) {
          const splitSec = pacePerKmSec * i;
          const sH = Math.floor(splitSec / 3600);
          const sM = Math.floor((splitSec % 3600) / 60);
          const sS = splitSec % 60;
          details.push({
            label: `Km ${i}`,
            value: sH > 0
              ? `${sH}:${sM < 10 ? "0" : ""}${sM}:${sS < 10 ? "0" : ""}${formatNumber(sS, 0)}`
              : `${sM}:${sS < 10 ? "0" : ""}${formatNumber(sS, 0)}`,
          });
        }

        // Add final partial km if applicable
        if (distanceKm > fullKms) {
          const finishTime = totalSeconds;
          const fH = Math.floor(finishTime / 3600);
          const fM = Math.floor((finishTime % 3600) / 60);
          const fS = finishTime % 60;
          details.push({
            label: `Finish (${formatNumber(distanceKm, 2)} km)`,
            value: fH > 0
              ? `${fH}:${fM < 10 ? "0" : ""}${fM}:${fS < 10 ? "0" : ""}${formatNumber(fS, 0)}`
              : `${fM}:${fS < 10 ? "0" : ""}${formatNumber(fS, 0)}`,
          });
        }

        return {
          primary: {
            label: "Pace per Kilometer",
            value: `${paceMin}:${paceSec < 10 ? "0" : ""}${formatNumber(paceSec, 0)} /km`,
          },
          details,
        };
      },
    },
    {
      id: "perMile",
      name: "Per-Mile Splits",
      fields: [
        {
          name: "race",
          label: "Race Distance",
          type: "select",
          options: [
            { label: "5K (3.107 mi)", value: "3.107" },
            { label: "10K (6.214 mi)", value: "6.214" },
            { label: "Half Marathon (13.109 mi)", value: "13.109" },
            { label: "Marathon (26.219 mi)", value: "26.219" },
          ],
        },
        {
          name: "hours",
          label: "Target Time \u2013 Hours",
          type: "number",
          placeholder: "e.g. 0",
        },
        {
          name: "minutes",
          label: "Target Time \u2013 Minutes",
          type: "number",
          placeholder: "e.g. 25",
        },
        {
          name: "seconds",
          label: "Target Time \u2013 Seconds",
          type: "number",
          placeholder: "e.g. 0",
        },
      ],
      calculate: (inputs) => {
        const distanceMi = parseFloat(inputs.race as string);
        const hours = (inputs.hours as number) || 0;
        const minutes = (inputs.minutes as number) || 0;
        const seconds = (inputs.seconds as number) || 0;
        if (!distanceMi) return null;

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        if (totalSeconds === 0) return null;

        const pacePerMiSec = totalSeconds / distanceMi;
        const paceMin = Math.floor(pacePerMiSec / 60);
        const paceSec = pacePerMiSec % 60;

        const fullMiles = Math.floor(distanceMi);
        const details = [];
        for (let i = 1; i <= fullMiles; i++) {
          const splitSec = pacePerMiSec * i;
          const sH = Math.floor(splitSec / 3600);
          const sM = Math.floor((splitSec % 3600) / 60);
          const sS = splitSec % 60;
          details.push({
            label: `Mile ${i}`,
            value: sH > 0
              ? `${sH}:${sM < 10 ? "0" : ""}${sM}:${sS < 10 ? "0" : ""}${formatNumber(sS, 0)}`
              : `${sM}:${sS < 10 ? "0" : ""}${formatNumber(sS, 0)}`,
          });
        }

        if (distanceMi > fullMiles) {
          const finishTime = totalSeconds;
          const fH = Math.floor(finishTime / 3600);
          const fM = Math.floor((finishTime % 3600) / 60);
          const fS = finishTime % 60;
          details.push({
            label: `Finish (${formatNumber(distanceMi, 3)} mi)`,
            value: fH > 0
              ? `${fH}:${fM < 10 ? "0" : ""}${fM}:${fS < 10 ? "0" : ""}${formatNumber(fS, 0)}`
              : `${fM}:${fS < 10 ? "0" : ""}${formatNumber(fS, 0)}`,
          });
        }

        return {
          primary: {
            label: "Pace per Mile",
            value: `${paceMin}:${paceSec < 10 ? "0" : ""}${formatNumber(paceSec, 0)} /mi`,
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["marathon-predictor-calculator", "heart-rate-reserve-calculator"],
  faq: [
    {
      question: "How do I calculate running splits?",
      answer:
        "Divide your target finish time by the race distance to get your per-unit pace, then accumulate that pace at each split point to get cumulative split times.",
    },
    {
      question: "Should I run even splits or negative splits?",
      answer:
        "Even splits (consistent pace throughout) are recommended for most runners. Negative splits (running the second half faster) can be effective for experienced racers.",
    },
  ],
  formula: "Pace per unit = Total Time / Distance. Each split = Pace \u00D7 split number.",
};
