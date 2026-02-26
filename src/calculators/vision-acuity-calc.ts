import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const visionAcuityCalculator: CalculatorDefinition = {
  slug: "vision-acuity-calculator",
  title: "Visual Acuity Converter",
  description:
    "Convert visual acuity between Snellen (20/xx), LogMAR, decimal, and MAR formats. Understand your eye exam results and visual impairment classification.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "visual acuity converter",
    "snellen chart",
    "LogMAR",
    "20/20 vision",
    "eye test calculator",
    "vision acuity",
    "decimal acuity",
  ],
  variants: [
    {
      id: "snellen-converter",
      name: "Snellen to Other Formats",
      description: "Convert Snellen visual acuity to LogMAR, decimal, and MAR",
      fields: [
        {
          name: "snellenDenominator",
          label: "Snellen Acuity (20/___)",
          type: "select",
          options: [
            { label: "20/10 (Excellent)", value: "10" },
            { label: "20/15 (Better than average)", value: "15" },
            { label: "20/20 (Normal)", value: "20" },
            { label: "20/25", value: "25" },
            { label: "20/30", value: "30" },
            { label: "20/40 (Driving standard many states)", value: "40" },
            { label: "20/50", value: "50" },
            { label: "20/60", value: "60" },
            { label: "20/70", value: "70" },
            { label: "20/80", value: "80" },
            { label: "20/100", value: "100" },
            { label: "20/125", value: "125" },
            { label: "20/150", value: "150" },
            { label: "20/200 (Legal blindness)", value: "200" },
            { label: "20/250", value: "250" },
            { label: "20/300", value: "300" },
            { label: "20/400", value: "400" },
          ],
        },
      ],
      calculate: (inputs) => {
        const denominator = parseFloat(inputs.snellenDenominator as string);
        if (isNaN(denominator)) return null;

        const snellen = `20/${denominator}`;
        const decimal = 20 / denominator;
        const logMAR = Math.log10(denominator / 20);
        const mar = denominator / 20; // Minimum Angle of Resolution in arc minutes

        // Snellen metric equivalent (6/x)
        const metricDenom = (denominator * 6) / 20;
        const snellenMetric = `6/${formatNumber(metricDenom, 0)}`;

        let classification: string;
        if (denominator <= 20) classification = "Normal vision or better";
        else if (denominator <= 60) classification = "Mild vision loss (near normal)";
        else if (denominator <= 200) classification = "Moderate to severe vision loss (low vision)";
        else classification = "Profound vision loss / legal blindness";

        let drivingNote: string;
        if (denominator <= 40) drivingNote = "Meets most US state driving standards (best corrected)";
        else if (denominator <= 70) drivingNote = "May qualify for restricted/bioptic driving license in some states";
        else drivingNote = "Does not meet driving visual acuity requirements in most states";

        return {
          primary: { label: "Snellen", value: snellen },
          details: [
            { label: "Snellen (US)", value: snellen },
            { label: "Snellen (Metric)", value: snellenMetric },
            { label: "Decimal Acuity", value: formatNumber(decimal, 2) },
            { label: "LogMAR", value: formatNumber(logMAR, 2) },
            { label: "MAR (arc minutes)", value: formatNumber(mar, 1) },
            { label: "Classification", value: classification },
            { label: "Driving", value: drivingNote },
          ],
          note: "20/20 is considered normal visual acuity. The Snellen fraction means at 20 feet you can read what a person with normal vision reads at the denominator distance. LogMAR is the standard for clinical research.",
        };
      },
    },
    {
      id: "logmar-converter",
      name: "LogMAR to Other Formats",
      description: "Convert LogMAR visual acuity to Snellen, decimal, and MAR",
      fields: [
        {
          name: "logmar",
          label: "LogMAR Value",
          type: "number",
          placeholder: "e.g. 0.0",
          min: -0.3,
          max: 1.6,
          step: 0.02,
        },
      ],
      calculate: (inputs) => {
        const logmar = parseFloat(inputs.logmar as string);
        if (isNaN(logmar)) return null;

        const mar = Math.pow(10, logmar);
        const decimal = 1 / mar;
        const snellenDenom = 20 * mar;
        const metricDenom = 6 * mar;

        // Snap to nearest standard Snellen
        const standardDenoms = [10, 12.5, 15, 20, 25, 30, 40, 50, 60, 70, 80, 100, 125, 150, 200, 250, 300, 400, 500, 600, 800];
        let nearest = standardDenoms[0];
        let minDiff = Math.abs(snellenDenom - standardDenoms[0]);
        for (const d of standardDenoms) {
          if (Math.abs(snellenDenom - d) < minDiff) {
            minDiff = Math.abs(snellenDenom - d);
            nearest = d;
          }
        }

        let classification: string;
        if (logmar <= 0.0) classification = "Normal vision or better";
        else if (logmar <= 0.5) classification = "Mild vision loss";
        else if (logmar <= 1.0) classification = "Moderate to severe vision loss";
        else classification = "Profound vision loss";

        return {
          primary: { label: "Snellen Equivalent", value: `20/${formatNumber(nearest, 0)}` },
          details: [
            { label: "LogMAR", value: formatNumber(logmar, 2) },
            { label: "Exact Snellen Denominator", value: formatNumber(snellenDenom, 1) },
            { label: "Nearest Standard Snellen", value: `20/${formatNumber(nearest, 0)}` },
            { label: "Metric Snellen", value: `6/${formatNumber(metricDenom, 1)}` },
            { label: "Decimal Acuity", value: formatNumber(decimal, 3) },
            { label: "MAR (arc minutes)", value: formatNumber(mar, 2) },
            { label: "Classification", value: classification },
          ],
          note: "LogMAR 0.0 = 20/20 = Decimal 1.0. Each 0.1 LogMAR step represents one line on the ETDRS chart. Negative LogMAR values indicate better than 20/20 vision.",
        };
      },
    },
    {
      id: "decimal-converter",
      name: "Decimal Acuity Converter",
      description: "Convert decimal visual acuity to Snellen and LogMAR",
      fields: [
        {
          name: "decimalAcuity",
          label: "Decimal Visual Acuity",
          type: "number",
          placeholder: "e.g. 1.0",
          min: 0.01,
          max: 2.0,
          step: 0.05,
        },
      ],
      calculate: (inputs) => {
        const dec = parseFloat(inputs.decimalAcuity as string);
        if (isNaN(dec) || dec <= 0) return null;

        const logmar = -Math.log10(dec);
        const mar = 1 / dec;
        const snellenDenom = 20 / dec;
        const metricDenom = 6 / dec;

        let classification: string;
        if (dec >= 1.0) classification = "Normal vision or better";
        else if (dec >= 0.3) classification = "Mild to moderate vision loss";
        else if (dec >= 0.1) classification = "Severe vision loss (low vision)";
        else classification = "Profound vision loss / near blindness";

        return {
          primary: { label: "Snellen Equivalent", value: `20/${formatNumber(snellenDenom, 0)}` },
          details: [
            { label: "Decimal Acuity", value: formatNumber(dec, 2) },
            { label: "Snellen (US)", value: `20/${formatNumber(snellenDenom, 0)}` },
            { label: "Snellen (Metric)", value: `6/${formatNumber(metricDenom, 1)}` },
            { label: "LogMAR", value: formatNumber(logmar, 2) },
            { label: "MAR (arc minutes)", value: formatNumber(mar, 2) },
            { label: "Classification", value: classification },
          ],
          note: "Decimal 1.0 = 20/20 = LogMAR 0.0. Decimal acuity is commonly used in Europe and Asia. Values above 1.0 indicate better than normal vision.",
        };
      },
    },
  ],
  relatedSlugs: ["hearing-loss-calculator", "blood-oxygen-calculator", "head-circumference-calculator"],
  faq: [
    {
      question: "What does 20/20 vision mean?",
      answer:
        "20/20 means you can see at 20 feet what a person with normal vision sees at 20 feet. It is the baseline for normal visual acuity, not 'perfect' vision. Some people have 20/15 or 20/10 vision, which is better than the baseline.",
    },
    {
      question: "What is legal blindness?",
      answer:
        "In the US, legal blindness is defined as best-corrected visual acuity of 20/200 or worse in the better eye, or a visual field of 20 degrees or less. This corresponds to a decimal acuity of 0.1 or LogMAR 1.0.",
    },
    {
      question: "What is LogMAR and why is it used?",
      answer:
        "LogMAR (Logarithm of the Minimum Angle of Resolution) is a scientific scale for measuring visual acuity. It is preferred in research because it provides a linear, evenly-spaced scale (each 0.1 step = one chart line), making it suitable for statistical analysis unlike the Snellen fraction.",
    },
  ],
  formula:
    "LogMAR = log10(Snellen denominator / 20) | Decimal = 20 / Snellen denominator | MAR = 10^LogMAR | Snellen = 20 / (10^(-LogMAR)) | LogMAR 0.0 = 20/20 = Decimal 1.0",
};
