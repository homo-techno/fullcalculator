import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const saunaSessionCalculator: CalculatorDefinition = {
  slug: "sauna-session-calculator",
  title: "Sauna Session Planner",
  description: "Free sauna session planner. Calculate optimal sauna time, temperature, and session structure for health benefits including cardiovascular and recovery goals.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["sauna calculator", "sauna session planner", "sauna time", "sauna temperature", "sauna health benefits"],
  variants: [
    {
      id: "session-plan",
      name: "Session Planner",
      description: "Plan your sauna session based on experience and goals",
      fields: [
        { name: "saunaType", label: "Sauna Type", type: "select", options: [
          { label: "Traditional (Finnish)", value: "traditional" },
          { label: "Infrared", value: "infrared" },
          { label: "Steam Room", value: "steam" },
        ] },
        { name: "experience", label: "Sauna Experience", type: "select", options: [
          { label: "Beginner", value: "beginner" },
          { label: "Regular (1-6 months)", value: "regular" },
          { label: "Experienced (6+ months)", value: "experienced" },
        ] },
        { name: "goal", label: "Primary Goal", type: "select", options: [
          { label: "Relaxation / Stress Relief", value: "relax" },
          { label: "Cardiovascular Health", value: "cardio" },
          { label: "Muscle Recovery", value: "recovery" },
          { label: "Detox / Sweating", value: "detox" },
        ] },
        { name: "sessionsPerWeek", label: "Sessions Per Week", type: "number", placeholder: "e.g. 3", min: 1, max: 7, defaultValue: 3 },
      ],
      calculate: (inputs) => {
        const type = inputs.saunaType as string;
        const exp = inputs.experience as string;
        const goal = inputs.goal as string;
        const freq = parseFloat(inputs.sessionsPerWeek as string);
        if (isNaN(freq)) return null;

        const temps: Record<string, { min: number; max: number }> = {
          traditional: { min: 150, max: 195 },
          infrared: { min: 120, max: 150 },
          steam: { min: 110, max: 120 },
        };
        const temp = temps[type] || temps.traditional;

        const durationBase: Record<string, number> = { beginner: 10, regular: 15, experienced: 20 };
        const goalMult: Record<string, number> = { relax: 1.0, cardio: 1.2, recovery: 0.9, detox: 1.1 };
        const baseDur = durationBase[exp] || 15;
        const roundDur = Math.round(baseDur * (goalMult[goal] || 1));

        const rounds = exp === "beginner" ? 1 : exp === "regular" ? 2 : 3;
        const cooldownMin = 5;
        const totalTime = rounds * roundDur + (rounds - 1) * cooldownMin;
        const weeklyMinutes = totalTime * freq;

        const caloriesPerMin = type === "traditional" ? 3.5 : type === "infrared" ? 2.5 : 2.0;
        const caloriesBurned = roundDur * rounds * caloriesPerMin;

        const waterLossOz = roundDur * rounds * 0.8;

        let protocol = `${rounds} round(s) of ${roundDur} min`;
        if (rounds > 1) protocol += ` with ${cooldownMin} min cool-down between rounds`;

        return {
          primary: { label: "Session Protocol", value: protocol },
          details: [
            { label: "Temperature Range", value: `${formatNumber(temp.min, 0)}-${formatNumber(temp.max, 0)}°F` },
            { label: "Total Session Time", value: `${formatNumber(totalTime, 0)} min` },
            { label: "Weekly Sauna Time", value: `${formatNumber(weeklyMinutes, 0)} min` },
            { label: "Est. Calories Burned", value: formatNumber(caloriesBurned, 0) },
            { label: "Est. Sweat Loss", value: `${formatNumber(waterLossOz, 0)} oz` },
            { label: "Rehydration Needed", value: `${formatNumber(waterLossOz * 1.5, 0)} oz water` },
          ],
          note: goal === "cardio" ? "Research shows 4-7 sauna sessions/week at 174°F+ for 20 min is associated with reduced cardiovascular mortality." : undefined,
        };
      },
    },
    {
      id: "contrast-therapy",
      name: "Contrast Therapy (Sauna + Cold)",
      description: "Plan a sauna and cold plunge contrast session",
      fields: [
        { name: "rounds", label: "Number of Rounds", type: "number", placeholder: "e.g. 3", min: 1, max: 5, defaultValue: 3 },
        { name: "hotDuration", label: "Hot Phase (minutes)", type: "number", placeholder: "e.g. 15", min: 5, max: 30 },
        { name: "coldDuration", label: "Cold Phase (minutes)", type: "number", placeholder: "e.g. 2", min: 0.5, max: 10, step: 0.5 },
        { name: "endOn", label: "End On", type: "select", options: [
          { label: "Cold (better for alertness)", value: "cold" },
          { label: "Hot (better for relaxation)", value: "hot" },
        ], defaultValue: "cold" },
      ],
      calculate: (inputs) => {
        const rounds = parseFloat(inputs.rounds as string);
        const hot = parseFloat(inputs.hotDuration as string);
        const cold = parseFloat(inputs.coldDuration as string);
        const endOn = inputs.endOn as string;
        if (isNaN(rounds) || isNaN(hot) || isNaN(cold)) return null;

        const totalHot = rounds * hot;
        const totalCold = endOn === "cold" ? rounds * cold : (rounds - 1) * cold;
        const totalSession = totalHot + totalCold;
        const hotColdRatio = hot / cold;

        return {
          primary: { label: "Total Session Time", value: `${formatNumber(totalSession, 0)} min` },
          details: [
            { label: "Total Hot Time", value: `${formatNumber(totalHot, 0)} min` },
            { label: "Total Cold Time", value: `${formatNumber(totalCold, 1)} min` },
            { label: "Hot:Cold Ratio", value: `${formatNumber(hotColdRatio, 1)}:1` },
            { label: "Rounds", value: formatNumber(rounds, 0) },
            { label: "End Phase", value: endOn === "cold" ? "Cold (alertness)" : "Hot (relaxation)" },
            { label: "Protocol", value: `${formatNumber(hot, 0)} min hot / ${formatNumber(cold, 1)} min cold x ${formatNumber(rounds, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cold-plunge-calculator", "muscle-recovery-calculator", "calorie-calculator"],
  faq: [
    { question: "How long should a sauna session be?", answer: "Beginners should start with 10-15 minutes per round. Experienced users can do 15-25 minutes. Most research showing health benefits uses 15-20 minute sessions at 174°F (80°C) or higher, 4+ times per week." },
    { question: "What temperature should a sauna be?", answer: "Traditional Finnish saunas run 150-195°F (65-90°C). Infrared saunas operate at 120-150°F (49-65°C). Steam rooms are typically 110-120°F (43-49°C). Start at lower temperatures and work up." },
    { question: "What is contrast therapy?", answer: "Contrast therapy alternates between hot (sauna) and cold (plunge/shower) exposure. A typical ratio is 10-15 minutes hot followed by 1-3 minutes cold for 2-4 rounds. It may enhance circulation and recovery." },
  ],
  formula: "Total Time = Rounds x Duration + (Rounds-1) x Cooldown | Calories ~ Duration x Rounds x Rate | Rehydration = Sweat Loss x 1.5",
};
