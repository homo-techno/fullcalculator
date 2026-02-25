import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lactateThresholdCalculator: CalculatorDefinition = {
  slug: "lactate-threshold-calculator",
  title: "Lactate Threshold Calculator",
  description: "Free lactate threshold calculator. Estimate your lactate threshold heart rate and training zones for optimal endurance performance.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["lactate threshold", "LTHR", "threshold training", "LT1", "LT2", "endurance zones", "threshold heart rate"],
  variants: [
    {
      id: "lthr-test",
      name: "LTHR from 30-Min Test",
      description: "Estimate lactate threshold HR from a 30-minute time trial",
      fields: [
        { name: "avgHR", label: "Avg HR (last 20 min of 30-min TT)", type: "number", placeholder: "e.g. 172", suffix: "bpm" },
        { name: "restingHR", label: "Resting Heart Rate", type: "number", placeholder: "e.g. 55", suffix: "bpm" },
        { name: "age", label: "Age (optional)", type: "number", placeholder: "e.g. 30" },
      ],
      calculate: (inputs) => {
        const avgHR = inputs.avgHR as number;
        const restingHR = inputs.restingHR as number;
        const age = inputs.age as number;
        if (!avgHR) return null;
        const lthr = avgHR;
        const hrr = restingHR ? lthr - restingHR : null;
        const maxHR = age ? 220 - age : null;
        const z1 = [lthr * 0.70, lthr * 0.81];
        const z2 = [lthr * 0.81, lthr * 0.90];
        const z3 = [lthr * 0.90, lthr * 0.95];
        const z4 = [lthr * 0.95, lthr * 1.00];
        const z5a = [lthr * 1.00, lthr * 1.03];
        const z5b = [lthr * 1.03, lthr * 1.06];
        const details: { label: string; value: string }[] = [
          { label: "LTHR", value: `${formatNumber(lthr, 0)} bpm` },
          { label: "Zone 1 (Active Recovery)", value: `${formatNumber(z1[0], 0)}-${formatNumber(z1[1], 0)} bpm` },
          { label: "Zone 2 (Aerobic Endurance)", value: `${formatNumber(z2[0], 0)}-${formatNumber(z2[1], 0)} bpm` },
          { label: "Zone 3 (Tempo)", value: `${formatNumber(z3[0], 0)}-${formatNumber(z3[1], 0)} bpm` },
          { label: "Zone 4 (Sub-Threshold)", value: `${formatNumber(z4[0], 0)}-${formatNumber(z4[1], 0)} bpm` },
          { label: "Zone 5a (Super-Threshold)", value: `${formatNumber(z5a[0], 0)}-${formatNumber(z5a[1], 0)} bpm` },
          { label: "Zone 5b (Aerobic Capacity)", value: `${formatNumber(z5b[0], 0)}-${formatNumber(z5b[1], 0)} bpm` },
        ];
        if (hrr !== null) {
          details.push({ label: "Heart Rate Reserve at LT", value: `${formatNumber(hrr, 0)} bpm` });
        }
        if (maxHR) {
          details.push({ label: "LTHR as % Max HR", value: `${formatNumber((lthr / maxHR) * 100, 1)}%` });
        }
        return {
          primary: { label: "Lactate Threshold HR", value: `${formatNumber(lthr, 0)} bpm` },
          details,
          note: "Perform a 30-minute all-out time trial. Use the average HR from the last 20 minutes as your LTHR. Warm up thoroughly before the test.",
        };
      },
    },
    {
      id: "lt-pace",
      name: "LT Pace Zones",
      description: "Estimate lactate threshold pace and running zones from a time trial",
      fields: [
        { name: "distance", label: "Time Trial Distance", type: "number", placeholder: "e.g. 5", suffix: "km" },
        { name: "minutes", label: "Time (minutes)", type: "number", placeholder: "e.g. 22" },
        { name: "seconds", label: "Time (seconds)", type: "number", placeholder: "e.g. 30", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const dist = inputs.distance as number;
        const mins = inputs.minutes as number;
        const secs = (inputs.seconds as number) || 0;
        if (!dist || !mins) return null;
        const totalSec = mins * 60 + secs;
        const pacePerKm = totalSec / dist;
        const ltPace = pacePerKm * 1.05;
        const easyPace = pacePerKm * 1.25;
        const tempoPace = pacePerKm * 1.10;
        const intervalPace = pacePerKm * 0.95;
        const repPace = pacePerKm * 0.88;
        const formatPace = (p: number) => {
          const m = Math.floor(p / 60);
          const s = Math.round(p % 60);
          return `${m}:${String(s).padStart(2, "0")}`;
        };
        return {
          primary: { label: "LT Pace", value: `${formatPace(ltPace)} /km` },
          details: [
            { label: "Race Pace (TT)", value: `${formatPace(pacePerKm)} /km` },
            { label: "Easy/Recovery Pace", value: `${formatPace(easyPace)} /km` },
            { label: "Tempo Pace", value: `${formatPace(tempoPace)} /km` },
            { label: "Interval Pace (VO2)", value: `${formatPace(intervalPace)} /km` },
            { label: "Repetition Pace", value: `${formatPace(repPace)} /km` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["anaerobic-threshold-calculator", "heart-rate-calculator", "vo2-max-calculator"],
  faq: [
    { question: "What is the lactate threshold?", answer: "Lactate threshold (LT) is the exercise intensity where lactate production exceeds clearance, causing blood lactate to rise. LT1 is the first rise above baseline. LT2 (often called OBLA or anaerobic threshold) is where lactate accumulates rapidly, typically at ~4 mmol/L." },
    { question: "How do I test my lactate threshold?", answer: "The simplest field test is a 30-minute all-out time trial (run, bike, or swim). Your average heart rate from the last 20 minutes closely approximates your LTHR. Lab testing with blood lactate sampling is more accurate." },
  ],
  formula: "LTHR = Average HR of last 20 min of a 30-min time trial | Zones based on % of LTHR",
};
