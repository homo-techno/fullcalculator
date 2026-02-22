import type { CalculatorDefinition } from "./types";

export const ivfSuccessCalculator: CalculatorDefinition = {
  slug: "ivf-success-calculator",
  title: "IVF Success Rate Calculator",
  description:
    "Free IVF success rate calculator. Estimate your chances of IVF success based on age, diagnosis, embryo type, and cycle number using published outcome data.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "ivf success rate",
    "ivf calculator",
    "ivf chances",
    "in vitro fertilization success",
    "ivf probability",
  ],
  variants: [
    {
      id: "ivf-success",
      name: "IVF Success Rate Estimator",
      description: "Estimate your IVF success probability based on key factors",
      fields: [
        {
          name: "age",
          label: "Female Partner's Age",
          type: "number",
          placeholder: "e.g. 34",
          min: 20,
          max: 48,
        },
        {
          name: "embryoType",
          label: "Embryo Transfer Type",
          type: "select",
          options: [
            { label: "Fresh Embryo Transfer", value: "fresh" },
            { label: "Frozen Embryo Transfer (FET)", value: "frozen" },
            { label: "Donor Eggs (fresh)", value: "donor-fresh" },
            { label: "Donor Eggs (frozen)", value: "donor-frozen" },
          ],
          defaultValue: "fresh",
        },
        {
          name: "diagnosis",
          label: "Primary Infertility Diagnosis",
          type: "select",
          options: [
            { label: "Unexplained Infertility", value: "unexplained" },
            { label: "Male Factor", value: "male-factor" },
            { label: "Ovulatory Dysfunction", value: "ovulatory" },
            { label: "Tubal Factor", value: "tubal" },
            { label: "Endometriosis", value: "endometriosis" },
            { label: "Diminished Ovarian Reserve", value: "dor" },
            { label: "Uterine Factor", value: "uterine" },
            { label: "Multiple Factors", value: "multiple" },
          ],
          defaultValue: "unexplained",
        },
        {
          name: "cycleNumber",
          label: "IVF Cycle Number",
          type: "select",
          options: [
            { label: "First Cycle", value: "1" },
            { label: "Second Cycle", value: "2" },
            { label: "Third Cycle", value: "3" },
            { label: "Fourth+ Cycle", value: "4" },
          ],
          defaultValue: "1",
        },
        {
          name: "pgtTested",
          label: "PGT-A Tested Embryo?",
          type: "select",
          options: [
            { label: "Yes (genetically tested)", value: "yes" },
            { label: "No", value: "no" },
            { label: "Not Sure", value: "unsure" },
          ],
          defaultValue: "no",
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const embryoType = inputs.embryoType as string;
        const diagnosis = inputs.diagnosis as string;
        const cycleStr = inputs.cycleNumber as string;
        const pgt = inputs.pgtTested as string;
        if (!age) return null;

        // Base success rate by age (per transfer, live birth rate) - CDC/SART data approximation
        let baseRate: number;
        if (age < 30) baseRate = 46;
        else if (age <= 32) baseRate = 43;
        else if (age <= 34) baseRate = 39;
        else if (age <= 36) baseRate = 33;
        else if (age <= 37) baseRate = 28;
        else if (age <= 39) baseRate = 22;
        else if (age <= 41) baseRate = 14;
        else if (age <= 43) baseRate = 7;
        else if (age <= 45) baseRate = 3;
        else baseRate = 1;

        // Donor eggs bypass age factor
        if (embryoType === "donor-fresh" || embryoType === "donor-frozen") {
          baseRate = 50; // Donor egg success ~50% per transfer
        }

        // Frozen embryo transfer slightly better outcomes
        if (embryoType === "frozen") {
          baseRate *= 1.05;
        }

        // PGT-A tested embryos have higher implantation rates
        if (pgt === "yes") {
          baseRate *= 1.20; // ~20% improvement with euploid embryo
        }

        // Diagnosis adjustments
        if (diagnosis === "male-factor") baseRate *= 1.0; // Generally good prognosis
        else if (diagnosis === "ovulatory") baseRate *= 1.05;
        else if (diagnosis === "tubal") baseRate *= 1.0;
        else if (diagnosis === "endometriosis") baseRate *= 0.90;
        else if (diagnosis === "dor") baseRate *= 0.85;
        else if (diagnosis === "uterine") baseRate *= 0.80;
        else if (diagnosis === "multiple") baseRate *= 0.85;

        // Cap at reasonable maximum
        baseRate = Math.min(65, baseRate);

        // Cumulative success over multiple cycles
        const cycleNum = parseInt(cycleStr);
        const cumulativeSuccess = (1 - Math.pow(1 - baseRate / 100, cycleNum)) * 100;

        return {
          primary: {
            label: "Est. Success Rate (Per Transfer)",
            value: `${baseRate.toFixed(0)}%`,
          },
          details: [
            { label: "Age", value: `${age} years` },
            { label: "Transfer Type", value: embryoType === "fresh" ? "Fresh" : embryoType === "frozen" ? "Frozen (FET)" : "Donor Eggs" },
            { label: "Diagnosis", value: diagnosis.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()) },
            { label: "PGT-A Tested", value: pgt === "yes" ? "Yes (euploid)" : "No" },
            { label: `Cumulative Success (${cycleNum} cycle${cycleNum > 1 ? "s" : ""})`, value: `~${cumulativeSuccess.toFixed(0)}%` },
            { label: "Cumulative (3 cycles)", value: `~${((1 - Math.pow(1 - baseRate / 100, 3)) * 100).toFixed(0)}%` },
            { label: "National Average (all ages)", value: "~35% per transfer (SART data)" },
          ],
          note: "These estimates are based on CDC/SART national averages and published research. Actual success varies significantly by clinic, protocol, individual factors (AMH, FSH, antral follicle count), and embryo quality. Consult your reproductive endocrinologist for personalized expectations.",
        };
      },
    },
  ],
  relatedSlugs: ["egg-freezing-calculator", "fertility-window-calculator", "ivf-due-date-calculator"],
  faq: [
    {
      question: "What is the success rate of IVF?",
      answer:
        "IVF success rates vary significantly by age. Per embryo transfer: under 35: ~40-46%, 35-37: ~28-33%, 38-40: ~18-22%, 41-42: ~10-14%, over 42: ~3-7%. With donor eggs, rates are ~50% regardless of the recipient's age. Cumulative success over 3 cycles is significantly higher than a single cycle.",
    },
    {
      question: "How many IVF cycles does it typically take?",
      answer:
        "About 33% of women succeed on the first cycle. Cumulative success rates are: after 2 cycles ~50-55%, after 3 cycles ~65-70%. Most doctors recommend trying at least 3 cycles before considering alternatives, though individual circumstances vary.",
    },
    {
      question: "Does PGT-A testing improve IVF success?",
      answer:
        "PGT-A (Preimplantation Genetic Testing for Aneuploidy) tests embryos for chromosomal abnormalities before transfer. Transferring PGT-A normal (euploid) embryos can improve per-transfer success rates by ~15-20% and reduce miscarriage risk. It's most beneficial for women over 35, those with recurrent miscarriage, or multiple failed cycles.",
    },
  ],
  formula:
    "Success Rate = Base Rate (by age) x Transfer Type Factor x Diagnosis Factor x PGT Factor | Cumulative = 1 - (1 - Per-Transfer Rate)^Cycles",
};
