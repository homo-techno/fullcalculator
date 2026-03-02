import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const triathlonTransitionTimeCalculator: CalculatorDefinition = {
  slug: "triathlon-transition-time-calculator",
  title: "Triathlon Transition Time Calculator",
  description: "Estimate triathlon total time including swim, bike, run legs and T1/T2 transition times.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["triathlon time","triathlon transition","T1 T2 time","triathlon calculator"],
  variants: [{
    id: "standard",
    name: "Triathlon Transition Time",
    description: "Estimate triathlon total time including swim, bike, run legs and T1/T2 transition times.",
    fields: [
      { name: "raceType", label: "Race Distance", type: "select", options: [{ value: "1", label: "Sprint (750m/20K/5K)" }, { value: "2", label: "Olympic (1.5K/40K/10K)" }, { value: "3", label: "Half Ironman (1.9K/90K/21.1K)" }, { value: "4", label: "Ironman (3.8K/180K/42.2K)" }], defaultValue: "2" },
      { name: "swimPace", label: "Swim Pace (min per 100m)", type: "number", min: 1, max: 5, defaultValue: 2 },
      { name: "bikePace", label: "Bike Speed (mph)", type: "number", min: 8, max: 30, defaultValue: 18 },
      { name: "runPace", label: "Run Pace (min per mile)", type: "number", min: 5, max: 16, defaultValue: 9 },
    ],
    calculate: (inputs) => {
    const raceType = parseInt(inputs.raceType as string);
    const swimPace = inputs.swimPace as number;
    const bikePace = inputs.bikePace as number;
    const runPace = inputs.runPace as number;
    const races = [[750, 20, 5], [1500, 40, 10], [1900, 90, 21.1], [3800, 180, 42.2]];
    const race = races[raceType - 1];
    const swimMin = (race[0] / 100) * swimPace;
    const bikeMin = (race[1] / 1.60934) / bikePace * 60;
    const runMin = (race[2] / 1.60934) * runPace;
    const t1 = raceType <= 2 ? 3 : 5;
    const t2 = raceType <= 2 ? 2 : 4;
    const totalMin = swimMin + t1 + bikeMin + t2 + runMin;
    const hours = Math.floor(totalMin / 60);
    const mins = Math.round(totalMin % 60);
    return {
      primary: { label: "Estimated Total Time", value: formatNumber(hours) + "h " + formatNumber(mins) + "m" },
      details: [
        { label: "Swim Time", value: formatNumber(Math.round(swimMin)) + " min" },
        { label: "Bike Time", value: formatNumber(Math.round(bikeMin)) + " min" },
        { label: "Run Time", value: formatNumber(Math.round(runMin)) + " min" },
        { label: "T1 + T2 Transitions", value: formatNumber(t1 + t2) + " min" }
      ]
    };
  },
  }],
  relatedSlugs: ["swim-pace-calculator","rowing-stroke-rate-calculator"],
  faq: [
    { question: "What are T1 and T2 in triathlon?", answer: "T1 is the transition from swim to bike. T2 is the transition from bike to run. Together they can add 5 to 15 minutes." },
    { question: "What is a good Olympic triathlon time?", answer: "For age-group athletes, 2:30 to 3:00 is solid. Competitive amateurs finish in 2:00 to 2:30. Elites are under 2:00." },
    { question: "How do I reduce transition time?", answer: "Practice transitions, use elastic laces, lay out gear logically, and consider a race belt for your bib number." },
  ],
  formula: "Total = Swim Time + T1 + Bike Time + T2 + Run Time",
};
