import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vo2maxEstimateCalculator: CalculatorDefinition = {
  slug: "vo2max-estimate-calculator",
  title: "VO2 Max Estimation from Running",
  description: "Free VO2 Max estimation calculator from running performance. Estimate your VO2max from race times using the Jack Daniels and VDOT methods.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["vo2max from running", "vdot calculator", "jack daniels vo2max", "running vo2max", "race time vo2max", "vo2max estimation"],
  variants: [
    {
      id: "vdot-race",
      name: "VDOT from Race Time",
      description: "Estimate VO2max (VDOT) from a recent race performance",
      fields: [
        { name: "distance", label: "Race Distance", type: "select", options: [
          { label: "1500m", value: "1500" },
          { label: "1 Mile", value: "1609" },
          { label: "3000m", value: "3000" },
          { label: "5K", value: "5000" },
          { label: "10K", value: "10000" },
          { label: "Half Marathon", value: "21097" },
          { label: "Marathon", value: "42195" },
        ], defaultValue: "5000" },
        { name: "hours", label: "Hours", type: "number", placeholder: "0", defaultValue: 0, min: 0 },
        { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 22" },
        { name: "seconds", label: "Seconds", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
        { name: "age", label: "Age (optional)", type: "number", placeholder: "e.g. 30" },
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
      ],
      calculate: (inputs) => {
        const distM = parseInt(inputs.distance as string);
        const hours = (inputs.hours as number) || 0;
        const mins = inputs.minutes as number;
        const secs = (inputs.seconds as number) || 0;
        const age = inputs.age as number;
        const gender = inputs.gender as string;
        if (!mins && !hours) return null;
        const totalMin = hours * 60 + mins + secs / 60;
        const velocity = distM / totalMin;
        const pctVO2 = 0.8 + 0.1894393 * Math.exp(-0.012778 * totalMin) + 0.2989558 * Math.exp(-0.1932605 * totalMin);
        const vo2 = -4.60 + 0.182258 * velocity + 0.000104 * velocity * velocity;
        const vdot = vo2 / pctVO2;
        let fitness: string;
        const isMale = gender === "male";
        if (isMale) {
          if (vdot >= 70) fitness = "Elite";
          else if (vdot >= 60) fitness = "Highly competitive";
          else if (vdot >= 50) fitness = "Competitive";
          else if (vdot >= 40) fitness = "Above average";
          else if (vdot >= 30) fitness = "Average";
          else fitness = "Beginner";
        } else {
          if (vdot >= 60) fitness = "Elite";
          else if (vdot >= 50) fitness = "Highly competitive";
          else if (vdot >= 42) fitness = "Competitive";
          else if (vdot >= 35) fitness = "Above average";
          else if (vdot >= 27) fitness = "Average";
          else fitness = "Beginner";
        }
        const easyPace = 30.0 / (vdot * 0.008 + 0.16);
        const tempoPace = 30.0 / (vdot * 0.012 + 0.12);
        const intervalPace = 30.0 / (vdot * 0.014 + 0.10);
        const formatPace = (secPerKm: number) => {
          const m = Math.floor(secPerKm / 60);
          const s = Math.round(secPerKm % 60);
          return `${m}:${String(s).padStart(2, "0")}`;
        };
        const easyPaceSec = easyPace * 60;
        const tempoPaceSec = tempoPace * 60;
        const intervalPaceSec = intervalPace * 60;
        const details: { label: string; value: string }[] = [
          { label: "Fitness Level", value: fitness },
          { label: "VO2 at Race Pace", value: `${formatNumber(vo2, 1)} mL/kg/min` },
          { label: "% VO2max Used", value: `${formatNumber(pctVO2 * 100, 1)}%` },
          { label: "Easy Pace", value: `${formatPace(easyPaceSec)} /km` },
          { label: "Tempo/Threshold Pace", value: `${formatPace(tempoPaceSec)} /km` },
          { label: "Interval Pace", value: `${formatPace(intervalPaceSec)} /km` },
        ];
        if (age) {
          const maxHR = 220 - age;
          const easyHR = [maxHR * 0.60, maxHR * 0.70];
          const tempoHR = [maxHR * 0.83, maxHR * 0.88];
          details.push(
            { label: "Easy HR Zone", value: `${formatNumber(easyHR[0], 0)}-${formatNumber(easyHR[1], 0)} bpm` },
            { label: "Tempo HR Zone", value: `${formatNumber(tempoHR[0], 0)}-${formatNumber(tempoHR[1], 0)} bpm` },
          );
        }
        return {
          primary: { label: "VDOT (VO2max est.)", value: `${formatNumber(vdot, 1)} mL/kg/min` },
          details,
          note: "VDOT is Jack Daniels' effective VO2max estimate from race performance. It correlates well with lab-tested VO2max and is used to set training paces.",
        };
      },
    },
    {
      id: "vo2-treadmill",
      name: "VO2max from Treadmill",
      description: "Estimate VO2max from a maximal treadmill test",
      fields: [
        { name: "speed", label: "Max Speed Achieved", type: "number", placeholder: "e.g. 16", suffix: "km/h" },
        { name: "grade", label: "Grade / Incline", type: "number", placeholder: "e.g. 2", suffix: "%", defaultValue: 1 },
        { name: "duration", label: "Test Duration", type: "number", placeholder: "e.g. 12", suffix: "min" },
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
      ],
      calculate: (inputs) => {
        const speed = inputs.speed as number;
        const grade = (inputs.grade as number) || 1;
        const duration = inputs.duration as number;
        const gender = inputs.gender as string;
        if (!speed || !duration) return null;
        const speedMPM = (speed * 1000) / 60;
        const horizontalVO2 = 0.2 * speedMPM;
        const verticalVO2 = 0.9 * speedMPM * (grade / 100);
        const restVO2 = 3.5;
        const vo2max = horizontalVO2 + verticalVO2 + restVO2;
        let fitness: string;
        const isMale = gender === "male";
        if (isMale) {
          if (vo2max >= 60) fitness = "Excellent";
          else if (vo2max >= 50) fitness = "Good";
          else if (vo2max >= 40) fitness = "Average";
          else if (vo2max >= 30) fitness = "Below average";
          else fitness = "Poor";
        } else {
          if (vo2max >= 50) fitness = "Excellent";
          else if (vo2max >= 42) fitness = "Good";
          else if (vo2max >= 34) fitness = "Average";
          else if (vo2max >= 25) fitness = "Below average";
          else fitness = "Poor";
        }
        return {
          primary: { label: "VO2max", value: `${formatNumber(vo2max, 1)} mL/kg/min` },
          details: [
            { label: "Fitness Level", value: fitness },
            { label: "Speed", value: `${formatNumber(speed, 1)} km/h` },
            { label: "Grade", value: `${grade}%` },
            { label: "Test Duration", value: `${formatNumber(duration, 1)} min` },
            { label: "Horizontal VO2", value: `${formatNumber(horizontalVO2, 1)} mL/kg/min` },
            { label: "Vertical VO2", value: `${formatNumber(verticalVO2, 1)} mL/kg/min` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["vo2-max-calculator", "pace-calculator", "running-age-grade-calculator"],
  faq: [
    { question: "How accurate is VO2max from running times?", answer: "VDOT estimates from race times correlate highly (r=0.96) with lab-tested VO2max for trained runners. The estimate assumes a maximal effort race. It may underestimate VO2max for under-trained runners who have not reached their aerobic potential." },
    { question: "What is VDOT?", answer: "VDOT is Jack Daniels' pseudo-VO2max value derived from race performance. It accounts for both VO2max and running economy. A runner with great economy may have a higher VDOT than their lab VO2max, reflecting better overall running performance." },
  ],
  formula: "VDOT = VO2 / %VO2max | VO2 = -4.60 + 0.182258v + 0.000104v^2 | %VO2max = 0.8 + 0.1894e^(-0.01278t) + 0.2990e^(-0.1933t)",
};
