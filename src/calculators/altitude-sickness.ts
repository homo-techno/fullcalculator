import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const altitudeSicknessCalculator: CalculatorDefinition = {
  slug: "altitude-sickness-calculator",
  title: "Altitude Sickness Risk Calculator",
  description:
    "Free altitude sickness risk calculator. Assess your risk of acute mountain sickness based on elevation, ascent rate, and acclimatization plan.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "altitude sickness",
    "mountain sickness",
    "elevation sickness",
    "AMS calculator",
    "high altitude",
  ],
  variants: [
    {
      id: "risk",
      name: "Assess Altitude Risk",
      description: "Calculate your altitude sickness risk level",
      fields: [
        {
          name: "startElevation",
          label: "Starting Elevation",
          type: "number",
          placeholder: "e.g. 1000",
          suffix: "ft",
        },
        {
          name: "targetElevation",
          label: "Target Elevation",
          type: "number",
          placeholder: "e.g. 14000",
          suffix: "ft",
        },
        {
          name: "elevUnit",
          label: "Elevation Unit",
          type: "select",
          options: [
            { label: "Feet", value: "ft" },
            { label: "Meters", value: "m" },
          ],
          defaultValue: "ft",
        },
        {
          name: "ascentDays",
          label: "Days to Reach Target",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "previousExperience",
          label: "High Altitude Experience",
          type: "select",
          options: [
            { label: "No experience above 8,000 ft", value: "none" },
            { label: "Some experience (1-2 trips)", value: "some" },
            { label: "Experienced (regular high altitude)", value: "experienced" },
            { label: "Live at high altitude", value: "resident" },
          ],
          defaultValue: "none",
        },
        {
          name: "fitness",
          label: "Fitness Level",
          type: "select",
          options: [
            { label: "Sedentary", value: "low" },
            { label: "Moderate fitness", value: "moderate" },
            { label: "Very fit / athletic", value: "high" },
          ],
          defaultValue: "moderate",
        },
      ],
      calculate: (inputs) => {
        const startElev = inputs.startElevation as number;
        const targetElev = inputs.targetElevation as number;
        const elevUnit = inputs.elevUnit as string;
        const ascentDays = inputs.ascentDays as number;
        const experience = inputs.previousExperience as string;
        const fitness = inputs.fitness as string;
        if (!startElev && startElev !== 0) return null;
        if (!targetElev || !ascentDays || targetElev <= 0 || ascentDays <= 0) return null;

        const toFeet = (val: number) => (elevUnit === "m" ? val * 3.28084 : val);
        const toMeters = (val: number) => (elevUnit === "ft" ? val * 0.3048 : val);

        const startFt = toFeet(startElev);
        const targetFt = toFeet(targetElev);
        const startM = toMeters(startElev);
        const targetM = toMeters(targetElev);
        const gainFt = targetFt - startFt;
        const gainM = targetM - startM;
        const dailyGainFt = gainFt / ascentDays;
        const dailyGainM = gainM / ascentDays;

        let riskScore = 0;

        if (targetFt > 18000) riskScore += 5;
        else if (targetFt > 14000) riskScore += 4;
        else if (targetFt > 10000) riskScore += 3;
        else if (targetFt > 8000) riskScore += 2;
        else riskScore += 1;

        if (dailyGainFt > 3000) riskScore += 3;
        else if (dailyGainFt > 2000) riskScore += 2;
        else if (dailyGainFt > 1000) riskScore += 1;

        const expModifiers: Record<string, number> = { none: 2, some: 1, experienced: 0, resident: -1 };
        riskScore += expModifiers[experience] || 0;

        const oxygenPercent = targetFt > 29000 ? 33 : Math.round((1 - targetFt / 145000) * 100);
        const boilingPoint = Math.round(212 - (targetFt / 1000) * 1.8);

        let riskLevel: string;
        let riskDescription: string;
        if (riskScore <= 3) {
          riskLevel = "Low Risk";
          riskDescription = "Low risk of altitude sickness. Stay hydrated and monitor for symptoms.";
        } else if (riskScore <= 5) {
          riskLevel = "Moderate Risk";
          riskDescription = "Moderate risk. Ascend gradually, stay hydrated, avoid alcohol, and consider acetazolamide (Diamox).";
        } else if (riskScore <= 7) {
          riskLevel = "High Risk";
          riskDescription = "High risk of AMS. Slow your ascent rate, add acclimatization days, carry Diamox, and know the descent route.";
        } else {
          riskLevel = "Very High Risk";
          riskDescription = "Very high risk. This ascent rate is dangerous. Add more acclimatization days, consider medication, and have an emergency descent plan.";
        }

        const recommendedDays = Math.ceil(gainFt / 1000);

        return {
          primary: {
            label: riskLevel,
            value: `Score: ${riskScore}/10`,
          },
          details: [
            { label: "Starting elevation", value: `${formatNumber(startFt, 0)} ft / ${formatNumber(startM, 0)} m` },
            { label: "Target elevation", value: `${formatNumber(targetFt, 0)} ft / ${formatNumber(targetM, 0)} m` },
            { label: "Total elevation gain", value: `${formatNumber(gainFt, 0)} ft / ${formatNumber(gainM, 0)} m` },
            { label: "Daily ascent rate", value: `${formatNumber(dailyGainFt, 0)} ft/day (${formatNumber(dailyGainM, 0)} m/day)` },
            { label: "Recommended ascent days", value: `${recommendedDays} days (1,000 ft/day max)` },
            { label: "O2 at target (approx)", value: `${oxygenPercent}% of sea level` },
            { label: "Boiling point at target", value: `${boilingPoint}°F` },
          ],
          note: riskDescription,
        };
      },
    },
    {
      id: "acclim",
      name: "Acclimatization Schedule",
      description: "Plan acclimatization stops for high altitude",
      fields: [
        {
          name: "targetElevation",
          label: "Target Elevation (feet)",
          type: "number",
          placeholder: "e.g. 17000",
        },
        {
          name: "startElevation",
          label: "Starting Elevation (feet)",
          type: "number",
          placeholder: "e.g. 3000",
        },
        {
          name: "strategy",
          label: "Acclimatization Strategy",
          type: "select",
          options: [
            { label: "Conservative (500 ft/day above 10k)", value: "conservative" },
            { label: "Standard (1,000 ft/day above 10k)", value: "standard" },
            { label: "Aggressive (1,500 ft/day)", value: "aggressive" },
          ],
          defaultValue: "standard",
        },
      ],
      calculate: (inputs) => {
        const target = inputs.targetElevation as number;
        const start = (inputs.startElevation as number) || 0;
        const strategy = inputs.strategy as string;
        if (!target || target <= 0) return null;

        const rates: Record<string, number> = { conservative: 500, standard: 1000, aggressive: 1500 };
        const dailyRate = rates[strategy] || 1000;

        const gainAbove10k = Math.max(0, target - Math.max(start, 10000));
        const gainBelow10k = Math.max(0, Math.min(target, 10000) - start);
        const daysBelow10k = Math.ceil(gainBelow10k / 3000);
        const daysAbove10k = Math.ceil(gainAbove10k / dailyRate);
        const restDays = Math.floor(daysAbove10k / 3);
        const totalDays = daysBelow10k + daysAbove10k + restDays;

        return {
          primary: {
            label: "Acclimatization Days",
            value: `${totalDays} days recommended`,
          },
          details: [
            { label: "Elevation gain below 10,000 ft", value: `${formatNumber(gainBelow10k, 0)} ft in ${daysBelow10k} days` },
            { label: "Elevation gain above 10,000 ft", value: `${formatNumber(gainAbove10k, 0)} ft in ${daysAbove10k} days` },
            { label: "Rest/acclimatization days", value: `${restDays} days (every 3rd day)` },
            { label: "Daily ascent rate above 10k", value: `${dailyRate} ft/day` },
            { label: "Total recommended days", value: `${totalDays} days` },
          ],
          note: `Plan ${totalDays} days for safe acclimatization. The golden rule: \"climb high, sleep low\" - hike to higher elevations during the day but descend to sleep. Add rest days every 3,000 ft of gain above 10,000 ft.`,
        };
      },
    },
  ],
  relatedSlugs: ["travel-checklist-calculator", "camping-gear-calculator"],
  faq: [
    {
      question: "At what altitude does altitude sickness start?",
      answer:
        "Altitude sickness can begin above 8,000 feet (2,438 m), though it's more common above 10,000 feet (3,048 m). About 25% of people experience symptoms at 8,000 ft, 50% at 14,000 ft, and nearly everyone is affected above 18,000 ft without acclimatization.",
    },
    {
      question: "What are the symptoms of altitude sickness?",
      answer:
        "Mild AMS symptoms include headache, nausea, dizziness, fatigue, and poor sleep. Severe symptoms include confusion, difficulty walking (ataxia), and shortness of breath at rest. HACE (brain swelling) and HAPE (fluid in lungs) are life-threatening and require immediate descent.",
    },
    {
      question: "How can I prevent altitude sickness?",
      answer:
        "Ascend gradually (no more than 1,000 ft/day above 10,000 ft), take rest days every 3,000 ft gained, stay hydrated, avoid alcohol, eat carbohydrate-rich foods, and consider acetazolamide (Diamox) as a preventive medication. Never ignore symptoms.",
    },
  ],
  formula:
    "Risk Score based on: target elevation (1-5 pts) + ascent rate (0-3 pts) + experience modifier (-1 to +2 pts). Scale: 0-3 Low, 4-5 Moderate, 6-7 High, 8+ Very High.",
};
