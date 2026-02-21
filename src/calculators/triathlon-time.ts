import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const triathlonTimeCalculator: CalculatorDefinition = {
  slug: "triathlon-time-calculator",
  title: "Triathlon Time Calculator",
  description:
    "Free triathlon time calculator. Estimate your total race time for Sprint, Olympic, Half Ironman, and Ironman triathlons including transitions.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "triathlon calculator",
    "triathlon time",
    "ironman calculator",
    "triathlon pace",
    "sprint triathlon time",
  ],
  variants: [
    {
      id: "sprint",
      name: "Sprint Triathlon",
      description: "750m swim, 20km bike, 5km run",
      fields: [
        { name: "swimPace", label: "Swim Pace (min per 100m)", type: "number", placeholder: "e.g. 2.0", step: 0.1 },
        { name: "bikePace", label: "Bike Speed (mph)", type: "number", placeholder: "e.g. 15", step: 0.1 },
        { name: "runPace", label: "Run Pace (min per mile)", type: "number", placeholder: "e.g. 9", step: 0.1 },
        { name: "t1", label: "T1 Transition (minutes)", type: "number", placeholder: "e.g. 3", min: 0 },
        { name: "t2", label: "T2 Transition (minutes)", type: "number", placeholder: "e.g. 2", min: 0 },
      ],
      calculate: (inputs) => {
        const swimPace = inputs.swimPace as number;
        const bikeSpeed = inputs.bikePace as number;
        const runPace = inputs.runPace as number;
        const t1 = (inputs.t1 as number) || 3;
        const t2 = (inputs.t2 as number) || 2;
        if (!swimPace || !bikeSpeed || !runPace) return null;

        const swimMin = swimPace * (750 / 100);
        const bikeMin = (20 / 1.60934 / bikeSpeed) * 60;
        const runMin = runPace * (5 / 1.60934);
        const total = swimMin + t1 + bikeMin + t2 + runMin;

        const h = Math.floor(total / 60);
        const m = Math.floor(total % 60);
        const s = Math.round((total % 1) * 60);

        return {
          primary: { label: "Total Time", value: `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}` },
          details: [
            { label: "Swim (750m)", value: `${formatNumber(swimMin, 1)} min` },
            { label: "T1", value: `${formatNumber(t1, 0)} min` },
            { label: "Bike (20km)", value: `${formatNumber(bikeMin, 1)} min` },
            { label: "T2", value: `${formatNumber(t2, 0)} min` },
            { label: "Run (5km)", value: `${formatNumber(runMin, 1)} min` },
          ],
        };
      },
    },
    {
      id: "olympic",
      name: "Olympic Triathlon",
      description: "1500m swim, 40km bike, 10km run",
      fields: [
        { name: "swimPace", label: "Swim Pace (min per 100m)", type: "number", placeholder: "e.g. 2.0", step: 0.1 },
        { name: "bikePace", label: "Bike Speed (mph)", type: "number", placeholder: "e.g. 18", step: 0.1 },
        { name: "runPace", label: "Run Pace (min per mile)", type: "number", placeholder: "e.g. 8.5", step: 0.1 },
        { name: "t1", label: "T1 Transition (minutes)", type: "number", placeholder: "e.g. 3", min: 0 },
        { name: "t2", label: "T2 Transition (minutes)", type: "number", placeholder: "e.g. 2", min: 0 },
      ],
      calculate: (inputs) => {
        const swimPace = inputs.swimPace as number;
        const bikeSpeed = inputs.bikePace as number;
        const runPace = inputs.runPace as number;
        const t1 = (inputs.t1 as number) || 3;
        const t2 = (inputs.t2 as number) || 2;
        if (!swimPace || !bikeSpeed || !runPace) return null;

        const swimMin = swimPace * (1500 / 100);
        const bikeMin = (40 / 1.60934 / bikeSpeed) * 60;
        const runMin = runPace * (10 / 1.60934);
        const total = swimMin + t1 + bikeMin + t2 + runMin;

        const h = Math.floor(total / 60);
        const m = Math.floor(total % 60);
        const s = Math.round((total % 1) * 60);

        return {
          primary: { label: "Total Time", value: `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}` },
          details: [
            { label: "Swim (1500m)", value: `${formatNumber(swimMin, 1)} min` },
            { label: "T1", value: `${formatNumber(t1, 0)} min` },
            { label: "Bike (40km)", value: `${formatNumber(bikeMin, 1)} min` },
            { label: "T2", value: `${formatNumber(t2, 0)} min` },
            { label: "Run (10km)", value: `${formatNumber(runMin, 1)} min` },
          ],
        };
      },
    },
    {
      id: "half-ironman",
      name: "Half Ironman (70.3)",
      description: "1.9km swim, 90km bike, 21.1km run",
      fields: [
        { name: "swimPace", label: "Swim Pace (min per 100m)", type: "number", placeholder: "e.g. 2.0", step: 0.1 },
        { name: "bikePace", label: "Bike Speed (mph)", type: "number", placeholder: "e.g. 18", step: 0.1 },
        { name: "runPace", label: "Run Pace (min per mile)", type: "number", placeholder: "e.g. 9", step: 0.1 },
        { name: "t1", label: "T1 Transition (minutes)", type: "number", placeholder: "e.g. 5", min: 0 },
        { name: "t2", label: "T2 Transition (minutes)", type: "number", placeholder: "e.g. 4", min: 0 },
      ],
      calculate: (inputs) => {
        const swimPace = inputs.swimPace as number;
        const bikeSpeed = inputs.bikePace as number;
        const runPace = inputs.runPace as number;
        const t1 = (inputs.t1 as number) || 5;
        const t2 = (inputs.t2 as number) || 4;
        if (!swimPace || !bikeSpeed || !runPace) return null;

        const swimMin = swimPace * (1900 / 100);
        const bikeMin = (90 / 1.60934 / bikeSpeed) * 60;
        const runMin = runPace * (21.0975 / 1.60934);
        const total = swimMin + t1 + bikeMin + t2 + runMin;

        const h = Math.floor(total / 60);
        const m = Math.floor(total % 60);
        const s = Math.round((total % 1) * 60);

        return {
          primary: { label: "Total Time", value: `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}` },
          details: [
            { label: "Swim (1.9km)", value: `${formatNumber(swimMin, 1)} min` },
            { label: "T1", value: `${formatNumber(t1, 0)} min` },
            { label: "Bike (90km)", value: `${formatNumber(bikeMin, 1)} min` },
            { label: "T2", value: `${formatNumber(t2, 0)} min` },
            { label: "Run (21.1km)", value: `${formatNumber(runMin, 1)} min` },
          ],
        };
      },
    },
    {
      id: "ironman",
      name: "Full Ironman (140.6)",
      description: "3.8km swim, 180km bike, 42.2km run",
      fields: [
        { name: "swimPace", label: "Swim Pace (min per 100m)", type: "number", placeholder: "e.g. 2.0", step: 0.1 },
        { name: "bikePace", label: "Bike Speed (mph)", type: "number", placeholder: "e.g. 17", step: 0.1 },
        { name: "runPace", label: "Run Pace (min per mile)", type: "number", placeholder: "e.g. 10", step: 0.1 },
        { name: "t1", label: "T1 Transition (minutes)", type: "number", placeholder: "e.g. 8", min: 0 },
        { name: "t2", label: "T2 Transition (minutes)", type: "number", placeholder: "e.g. 6", min: 0 },
      ],
      calculate: (inputs) => {
        const swimPace = inputs.swimPace as number;
        const bikeSpeed = inputs.bikePace as number;
        const runPace = inputs.runPace as number;
        const t1 = (inputs.t1 as number) || 8;
        const t2 = (inputs.t2 as number) || 6;
        if (!swimPace || !bikeSpeed || !runPace) return null;

        const swimMin = swimPace * (3800 / 100);
        const bikeMin = (180 / 1.60934 / bikeSpeed) * 60;
        const runMin = runPace * (42.195 / 1.60934);
        const total = swimMin + t1 + bikeMin + t2 + runMin;

        const h = Math.floor(total / 60);
        const m = Math.floor(total % 60);
        const s = Math.round((total % 1) * 60);

        return {
          primary: { label: "Total Time", value: `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}` },
          details: [
            { label: "Swim (3.8km)", value: `${formatNumber(swimMin, 1)} min` },
            { label: "T1", value: `${formatNumber(t1, 0)} min` },
            { label: "Bike (180km)", value: `${formatNumber(bikeMin, 1)} min` },
            { label: "T2", value: `${formatNumber(t2, 0)} min` },
            { label: "Run (42.2km)", value: `${formatNumber(runMin, 1)} min` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pace-calculator", "swimming-pace-calculator", "cycling-calorie-calculator"],
  faq: [
    {
      question: "What are the triathlon distances?",
      answer:
        "Sprint: 750m swim, 20km bike, 5km run. Olympic: 1500m swim, 40km bike, 10km run. Half Ironman (70.3): 1.9km swim, 90km bike, 21.1km run. Full Ironman (140.6): 3.8km swim, 180km bike, 42.2km run.",
    },
    {
      question: "What is a good transition time?",
      answer:
        "For sprint/Olympic triathlons, T1 (swim-to-bike) averages 2-4 minutes and T2 (bike-to-run) averages 1-3 minutes. For Ironman events, transitions are longer (5-10 minutes) due to gear changes and nutrition.",
    },
    {
      question: "How long does an Ironman take?",
      answer:
        "Average Ironman finish time is about 12-13 hours. Competitive age-groupers finish in 9-11 hours. Elite professionals finish in 8-9 hours. The cutoff is typically 17 hours.",
    },
  ],
  formula: "Total Time = Swim Time + T1 + Bike Time + T2 + Run Time",
};
