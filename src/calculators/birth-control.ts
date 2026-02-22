import type { CalculatorDefinition } from "./types";

export const birthControlCalculator: CalculatorDefinition = {
  slug: "birth-control-calculator",
  title: "Birth Control Effectiveness Calculator",
  description:
    "Free birth control effectiveness calculator. Compare contraceptive methods by effectiveness rates, typical use vs. perfect use, and see cumulative risk over time.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "birth control effectiveness",
    "contraception calculator",
    "birth control comparison",
    "contraceptive failure rate",
    "birth control options",
  ],
  variants: [
    {
      id: "effectiveness",
      name: "Birth Control Effectiveness Comparison",
      description: "See effectiveness rates for your chosen method",
      fields: [
        {
          name: "method",
          label: "Birth Control Method",
          type: "select",
          options: [
            { label: "Hormonal IUD (Mirena, Kyleena)", value: "hormonal-iud" },
            { label: "Copper IUD (Paragard)", value: "copper-iud" },
            { label: "Implant (Nexplanon)", value: "implant" },
            { label: "Birth Control Pill", value: "pill" },
            { label: "Patch (Xulane)", value: "patch" },
            { label: "Vaginal Ring (NuvaRing)", value: "ring" },
            { label: "Depo-Provera Shot", value: "shot" },
            { label: "Male Condom", value: "condom-male" },
            { label: "Female Condom", value: "condom-female" },
            { label: "Diaphragm with Spermicide", value: "diaphragm" },
            { label: "Fertility Awareness Methods", value: "fam" },
            { label: "Withdrawal (Pull-Out)", value: "withdrawal" },
            { label: "Spermicide Alone", value: "spermicide" },
            { label: "No Method", value: "none" },
          ],
        },
        {
          name: "years",
          label: "Years of Use",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 20,
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const method = inputs.method as string;
        const years = (inputs.years as number) || 1;
        if (!method) return null;

        // Failure rates per year (typical use, perfect use) per 100 women
        const methods: Record<string, { name: string; typical: number; perfect: number; duration: string; reversible: string }> = {
          "hormonal-iud": { name: "Hormonal IUD", typical: 0.2, perfect: 0.2, duration: "3-7 years", reversible: "Immediately on removal" },
          "copper-iud": { name: "Copper IUD", typical: 0.8, perfect: 0.6, duration: "Up to 10-12 years", reversible: "Immediately on removal" },
          "implant": { name: "Implant (Nexplanon)", typical: 0.05, perfect: 0.05, duration: "Up to 3-5 years", reversible: "Immediately on removal" },
          "pill": { name: "Birth Control Pill", typical: 7, perfect: 0.3, duration: "Daily use", reversible: "1-3 months" },
          "patch": { name: "Patch", typical: 7, perfect: 0.3, duration: "Weekly change", reversible: "1-3 months" },
          "ring": { name: "Vaginal Ring", typical: 7, perfect: 0.3, duration: "Monthly change", reversible: "1-3 months" },
          "shot": { name: "Depo-Provera Shot", typical: 4, perfect: 0.2, duration: "Every 3 months", reversible: "3-18 months" },
          "condom-male": { name: "Male Condom", typical: 13, perfect: 2, duration: "Per use", reversible: "Immediately" },
          "condom-female": { name: "Female Condom", typical: 21, perfect: 5, duration: "Per use", reversible: "Immediately" },
          "diaphragm": { name: "Diaphragm + Spermicide", typical: 17, perfect: 6, duration: "Per use", reversible: "Immediately" },
          "fam": { name: "Fertility Awareness", typical: 12, perfect: 0.4, duration: "Daily tracking", reversible: "Immediately" },
          "withdrawal": { name: "Withdrawal", typical: 20, perfect: 4, duration: "Per use", reversible: "Immediately" },
          "spermicide": { name: "Spermicide Alone", typical: 21, perfect: 16, duration: "Per use", reversible: "Immediately" },
          "none": { name: "No Method", typical: 85, perfect: 85, duration: "N/A", reversible: "N/A" },
        };

        const data = methods[method];
        if (!data) return null;

        // Cumulative failure over multiple years
        const cumulativeTypical = (1 - Math.pow(1 - data.typical / 100, years)) * 100;
        const cumulativePerfect = (1 - Math.pow(1 - data.perfect / 100, years)) * 100;

        return {
          primary: {
            label: "Typical Use Effectiveness",
            value: `${(100 - data.typical).toFixed(1)}%`,
          },
          details: [
            { label: "Method", value: data.name },
            { label: "Typical Use Failure Rate", value: `${data.typical}% per year` },
            { label: "Perfect Use Failure Rate", value: `${data.perfect}% per year` },
            { label: "Perfect Use Effectiveness", value: `${(100 - data.perfect).toFixed(1)}%` },
            { label: `Cumulative Risk (${years} yr, typical)`, value: `${cumulativeTypical.toFixed(1)}% chance of pregnancy` },
            { label: `Cumulative Risk (${years} yr, perfect)`, value: `${cumulativePerfect.toFixed(1)}% chance of pregnancy` },
            { label: "Duration / Frequency", value: data.duration },
            { label: "Fertility Return", value: data.reversible },
          ],
          note: "'Typical use' reflects how the method performs in real life (including human error like forgetting pills). 'Perfect use' reflects 100% correct and consistent use. LARC methods (IUD, implant) have the smallest gap between typical and perfect use because they require no user action.",
        };
      },
    },
  ],
  relatedSlugs: ["period-calculator", "ovulation-calculator", "fertility-window-calculator"],
  faq: [
    {
      question: "What is the most effective birth control?",
      answer:
        "The most effective reversible methods are LARC (Long-Acting Reversible Contraception): the implant (Nexplanon) at 99.95% and hormonal IUD at 99.8%. These are 'set it and forget it' methods with virtually no difference between typical and perfect use because they don't require daily user action.",
    },
    {
      question: "What is the difference between typical use and perfect use?",
      answer:
        "Perfect use means using the method exactly as directed every single time. Typical use reflects real-world effectiveness including human errors like missing pills, late injections, or incorrect condom application. For user-dependent methods (pills, condoms), the gap is significant; for LARC methods, it's minimal.",
    },
    {
      question: "How long does it take for fertility to return after stopping birth control?",
      answer:
        "For most methods, fertility returns quickly: immediately for condoms and IUD/implant removal, within 1-3 months for pills/patch/ring. The exception is Depo-Provera (the shot), where it can take 3-18 months (average 10 months) for fertility to return after the last injection.",
    },
  ],
  formula:
    "Effectiveness = 100 - Failure Rate | Cumulative Risk over N years = 1 - (1 - Annual Failure Rate)^N",
};
