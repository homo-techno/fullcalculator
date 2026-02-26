import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rockClimbingGradeCalculator: CalculatorDefinition = {
  slug: "rock-climbing-grade-converter",
  title: "Rock Climbing Grade Converter",
  description: "Free rock climbing grade converter. Convert between YDS, French, UIAA, British, and V-scale bouldering grades for sport climbing and bouldering.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["climbing grade converter", "yds to french", "v-scale converter", "bouldering grade", "rock climbing calculator"],
  variants: [
    {
      id: "route",
      name: "Route Grades (YDS/French/UIAA)",
      description: "Convert rope climbing grades between systems",
      fields: [
        { name: "system", label: "Input System", type: "select", options: [
          { label: "YDS (USA)", value: "yds" },
          { label: "French", value: "french" },
          { label: "UIAA", value: "uiaa" },
        ] },
        { name: "gradeIndex", label: "Grade Level (1 = easiest)", type: "number", placeholder: "e.g. 10", min: 1, max: 25 },
      ],
      calculate: (inputs) => {
        const system = inputs.system as string;
        const idx = parseFloat(inputs.gradeIndex as string);
        if (isNaN(idx) || idx < 1) return null;
        const i = Math.min(Math.round(idx), 25) - 1;

        const yds = ["5.2","5.3","5.4","5.5","5.6","5.7","5.8","5.9","5.10a","5.10b","5.10c","5.10d","5.11a","5.11b","5.11c","5.11d","5.12a","5.12b","5.12c","5.12d","5.13a","5.13b","5.13c","5.13d","5.14a"];
        const french = ["3","3+","4a","4b","4c","5a","5b","5c","6a","6a+","6b","6b+","6c","6c+","7a","7a+","7b","7b+","7c","7c+","8a","8a+","8b","8b+","8c"];
        const uiaa = ["III","III+","IV-","IV","IV+","V","V+","VI-","VI","VI+","VII-","VII","VII+","VIII-","VIII","VIII+","IX-","IX","IX+","X-","X","X+","XI-","XI","XI+"];

        return {
          primary: { label: `YDS Grade`, value: yds[i] || yds[yds.length - 1] },
          details: [
            { label: "YDS (USA)", value: yds[i] || "N/A" },
            { label: "French", value: french[i] || "N/A" },
            { label: "UIAA", value: uiaa[i] || "N/A" },
            { label: "Grade Index", value: formatNumber(i + 1, 0) },
            { label: "Input System", value: system.toUpperCase() },
          ],
        };
      },
    },
    {
      id: "boulder",
      name: "Bouldering Grades (V-Scale/Font)",
      description: "Convert bouldering grades between V-scale and Fontainebleau",
      fields: [
        { name: "vGrade", label: "V-Scale Grade (number only)", type: "number", placeholder: "e.g. 5", min: 0, max: 17 },
      ],
      calculate: (inputs) => {
        const v = parseFloat(inputs.vGrade as string);
        if (isNaN(v) || v < 0) return null;
        const vi = Math.min(Math.round(v), 17);

        const font = ["3","4","4+","5","5+","6a","6a+","6b","6b+","6c","6c+","7a","7a+","7b","7b+","7c","7c+","8a"];
        const difficulty = vi <= 2 ? "Beginner" : vi <= 5 ? "Intermediate" : vi <= 9 ? "Advanced" : vi <= 13 ? "Expert" : "Elite";

        return {
          primary: { label: "V-Scale", value: `V${vi}` },
          details: [
            { label: "Fontainebleau", value: font[vi] || "8a+" },
            { label: "Difficulty Level", value: difficulty },
            { label: "Approx. YDS Equivalent", value: `5.${Math.min(10 + Math.floor(vi / 2), 15)}` },
            { label: "Climbers at Level", value: vi <= 3 ? "Most gym climbers" : vi <= 7 ? "Dedicated climbers" : "< 1% of climbers" },
          ],
        };
      },
    },
    {
      id: "progression",
      name: "Grade Progression Estimate",
      description: "Estimate time to reach your goal grade",
      fields: [
        { name: "currentGrade", label: "Current V-Grade", type: "number", placeholder: "e.g. 3", min: 0, max: 16 },
        { name: "goalGrade", label: "Goal V-Grade", type: "number", placeholder: "e.g. 7", min: 1, max: 17 },
        { name: "sessionsPerWeek", label: "Sessions Per Week", type: "number", placeholder: "e.g. 3", min: 1, max: 7 },
      ],
      calculate: (inputs) => {
        const current = parseFloat(inputs.currentGrade as string);
        const goal = parseFloat(inputs.goalGrade as string);
        const sessions = parseFloat(inputs.sessionsPerWeek as string);
        if (isNaN(current) || isNaN(goal) || isNaN(sessions) || goal <= current) return null;

        const gradesDiff = goal - current;
        const baseMonthsPerGrade = 3;
        const difficultyMultiplier = 1 + (current + goal) / 2 * 0.15;
        const sessionFactor = 3 / sessions;
        const totalMonths = gradesDiff * baseMonthsPerGrade * difficultyMultiplier * sessionFactor;

        return {
          primary: { label: "Estimated Time", value: `${formatNumber(totalMonths, 0)} months` },
          details: [
            { label: "Grades to Climb", value: formatNumber(gradesDiff, 0) },
            { label: "Current Level", value: `V${formatNumber(current, 0)}` },
            { label: "Goal Level", value: `V${formatNumber(goal, 0)}` },
            { label: "Avg Months Per Grade", value: formatNumber(totalMonths / gradesDiff, 1) },
            { label: "Total Sessions Needed", value: formatNumber(totalMonths * 4.33 * sessions, 0) },
          ],
          note: "Progression varies greatly by individual genetics, training quality, and recovery.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "bmi-calculator", "heart-rate-calculator"],
  faq: [
    { question: "What is the YDS grading system?", answer: "The Yosemite Decimal System (YDS) rates rock climbing difficulty from 5.0 (easy) to 5.15 (hardest). Grades 5.10 and above use letter subdivisions (a-d) for finer distinctions." },
    { question: "How does V-scale compare to YDS?", answer: "V-scale is for bouldering (short, unroped problems) while YDS is for roped routes. V0 roughly corresponds to 5.10a, and difficulty increases are not directly linear between the two systems." },
    { question: "Which grading system should I use?", answer: "Use the system common in your area: YDS in the USA, French grades in Europe, and V-scale for bouldering worldwide. This converter helps when traveling or reading international route guides." },
  ],
  formula: "Grade conversions use standardized cross-reference tables maintained by climbing organizations. Progression: Months = Grades x 3 x DifficultyMultiplier x (3/Sessions)",
};
