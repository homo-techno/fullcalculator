import type { CalculatorDefinition } from "./types";

export const breastfeedingTimerCalculator: CalculatorDefinition = {
  slug: "breastfeeding-timer-calculator",
  title: "Breastfeeding Session Timer",
  description:
    "Free breastfeeding session timer calculator. Track feeding duration, estimate intake, and get guidance on feeding frequency by baby age.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "breastfeeding timer",
    "nursing timer",
    "breastfeeding duration",
    "how long to breastfeed",
    "nursing session",
  ],
  variants: [
    {
      id: "session",
      name: "Session Analysis",
      description: "Analyze your breastfeeding session and get recommendations",
      fields: [
        {
          name: "babyAgeWeeks",
          label: "Baby Age (weeks)",
          type: "number",
          placeholder: "e.g. 6",
          min: 0,
          max: 104,
        },
        {
          name: "leftMinutes",
          label: "Left Side Duration (minutes)",
          type: "number",
          placeholder: "e.g. 12",
          min: 0,
          max: 60,
        },
        {
          name: "rightMinutes",
          label: "Right Side Duration (minutes)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
          max: 60,
        },
        {
          name: "feedingsPerDay",
          label: "Feedings Per Day",
          type: "number",
          placeholder: "e.g. 8",
          min: 1,
          max: 16,
        },
      ],
      calculate: (inputs) => {
        const ageWeeks = inputs.babyAgeWeeks as number;
        const leftMin = inputs.leftMinutes as number;
        const rightMin = inputs.rightMinutes as number;
        const feedings = inputs.feedingsPerDay as number;
        if (ageWeeks === undefined || !feedings) return null;

        const totalMin = (leftMin || 0) + (rightMin || 0);

        // Estimated intake per feeding by age
        let estOzPerFeeding: number;
        if (ageWeeks <= 1) estOzPerFeeding = 1.5;
        else if (ageWeeks <= 4) estOzPerFeeding = 2.5;
        else if (ageWeeks <= 8) estOzPerFeeding = 3.5;
        else if (ageWeeks <= 16) estOzPerFeeding = 4;
        else if (ageWeeks <= 26) estOzPerFeeding = 5;
        else estOzPerFeeding = 5;

        const dailyOz = estOzPerFeeding * feedings;
        const dailyMl = dailyOz * 29.5735;

        // Recommended session time
        let recommendedMin: string;
        if (ageWeeks <= 2) recommendedMin = "20-45 minutes";
        else if (ageWeeks <= 8) recommendedMin = "15-30 minutes";
        else if (ageWeeks <= 16) recommendedMin = "10-20 minutes";
        else recommendedMin = "10-15 minutes";

        // Recommended feedings per day
        let recommendedFeedings: string;
        if (ageWeeks <= 2) recommendedFeedings = "8-12 times/day";
        else if (ageWeeks <= 8) recommendedFeedings = "8-10 times/day";
        else if (ageWeeks <= 16) recommendedFeedings = "7-9 times/day";
        else if (ageWeeks <= 26) recommendedFeedings = "6-8 times/day";
        else recommendedFeedings = "5-7 times/day (plus solids)";

        let sessionAssessment = "Good duration";
        if (totalMin < 5 && ageWeeks < 16) {
          sessionAssessment = "Very short - baby may need longer to fully feed";
        } else if (totalMin < 10 && ageWeeks < 8) {
          sessionAssessment = "Short for this age - watch for adequate intake signs";
        } else if (totalMin > 45) {
          sessionAssessment = "Long session - check for proper latch and effective sucking";
        }

        const dailyNursingHours = (totalMin * feedings / 60).toFixed(1);

        return {
          primary: { label: "Session Duration", value: `${totalMin} minutes total` },
          details: [
            { label: "Session assessment", value: sessionAssessment },
            { label: "Left side", value: `${leftMin || 0} minutes` },
            { label: "Right side", value: `${rightMin || 0} minutes` },
            { label: "Recommended duration", value: recommendedMin },
            { label: "Your feedings/day", value: `${feedings}` },
            { label: "Recommended feedings/day", value: recommendedFeedings },
            { label: "Est. intake per feeding", value: `~${estOzPerFeeding} oz` },
            { label: "Est. daily intake", value: `~${dailyOz.toFixed(0)} oz (~${Math.round(dailyMl)} ml)` },
            { label: "Daily nursing time", value: `~${dailyNursingHours} hours` },
          ],
          note: "Intake estimates are approximate. Watch for adequate wet/dirty diapers (6+ wet diapers/day) and steady weight gain as the best indicators of sufficient feeding.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-bottle-amount-calculator", "pumping-schedule-calculator"],
  faq: [
    {
      question: "How long should each breastfeeding session last?",
      answer:
        "Newborns typically nurse 20-45 minutes per session. By 3-4 months, most babies become more efficient and sessions shorten to 10-20 minutes. Some babies are fast feeders and others take longer - what matters is adequate intake.",
    },
    {
      question: "How do I know my baby is getting enough milk?",
      answer:
        "Signs of adequate intake include: 6+ wet diapers per day, regular bowel movements, steady weight gain, baby seems content after feeding, and you can hear swallowing during nursing.",
    },
  ],
  formula:
    "Est. intake: newborns ~1.5 oz/feeding, 1 mo ~2.5 oz, 2 mo ~3.5 oz, 3-4 mo ~4 oz, 5-6 mo ~5 oz. Daily total = oz per feeding x feedings per day.",
};
