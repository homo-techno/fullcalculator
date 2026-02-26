import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const crownRumpLengthCalculator: CalculatorDefinition = {
  slug: "crown-rump-length-calculator",
  title: "Crown-Rump Length Calculator",
  description:
    "Convert crown-rump length (CRL) measurements to gestational age. Estimate due date from first trimester ultrasound CRL measurements using standard formulas.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "crown rump length",
    "CRL calculator",
    "gestational age",
    "ultrasound dating",
    "pregnancy dating",
    "first trimester ultrasound",
    "fetal measurement",
  ],
  variants: [
    {
      id: "crl-to-age",
      name: "CRL to Gestational Age",
      description: "Convert crown-rump length to estimated gestational age",
      fields: [
        {
          name: "crl",
          label: "Crown-Rump Length (CRL)",
          type: "number",
          placeholder: "e.g. 45",
          suffix: "mm",
          min: 2,
          max: 95,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const crl = parseFloat(inputs.crl as string);
        if (isNaN(crl) || crl < 2 || crl > 95) return null;

        // Robinson & Fleming formula: GA (days) = 8.052 * sqrt(CRL * 1.037) + 23.73
        const gaDays = 8.052 * Math.sqrt(crl * 1.037) + 23.73;
        const gaWeeks = Math.floor(gaDays / 7);
        const gaDaysRemainder = Math.round(gaDays % 7);

        // Estimated due date calculation
        const remainingDays = 280 - gaDays;

        // CRL in cm for display
        const crlCm = crl / 10;

        let trimesterNote: string;
        if (gaDays < 84) trimesterNote = "First trimester — CRL is the most accurate dating method";
        else trimesterNote = "Late first / early second trimester — CRL dating less precise";

        let sizeComparison: string;
        if (crl < 5) sizeComparison = "Poppy seed size";
        else if (crl < 10) sizeComparison = "About the size of a lentil";
        else if (crl < 20) sizeComparison = "About the size of a blueberry";
        else if (crl < 30) sizeComparison = "About the size of a grape";
        else if (crl < 45) sizeComparison = "About the size of a strawberry";
        else if (crl < 60) sizeComparison = "About the size of a lime";
        else sizeComparison = "About the size of a plum";

        return {
          primary: { label: "Gestational Age", value: `${formatNumber(gaWeeks, 0)} weeks, ${formatNumber(gaDaysRemainder, 0)} days` },
          details: [
            { label: "CRL", value: `${formatNumber(crl, 1)} mm (${formatNumber(crlCm, 2)} cm)` },
            { label: "Gestational Age (decimal)", value: `${formatNumber(gaDays / 7, 1)} weeks` },
            { label: "Gestational Age (days)", value: `${formatNumber(gaDays, 0)} days` },
            { label: "Days Until Due Date", value: `~${formatNumber(remainingDays, 0)} days` },
            { label: "Size Comparison", value: sizeComparison },
            { label: "Note", value: trimesterNote },
          ],
          note: "CRL measurement is most accurate for dating between 7-13 weeks gestation (accuracy +/- 3-5 days). Based on Robinson & Fleming formula. Consult your OB/GYN for clinical dating.",
        };
      },
    },
    {
      id: "age-to-crl",
      name: "Gestational Age to Expected CRL",
      description: "Estimate expected CRL from known gestational age",
      fields: [
        {
          name: "gaWeeks",
          label: "Gestational Age (weeks)",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "weeks",
          min: 5,
          max: 14,
          step: 1,
        },
        {
          name: "gaDays",
          label: "Additional Days",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "days",
          min: 0,
          max: 6,
          step: 1,
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const gaWeeks = parseFloat(inputs.gaWeeks as string);
        const gaDaysExtra = parseFloat(inputs.gaDays as string) || 0;

        if (isNaN(gaWeeks)) return null;

        const totalDays = gaWeeks * 7 + gaDaysExtra;

        // Inverse of Robinson & Fleming: CRL = ((GA_days - 23.73) / 8.052)^2 / 1.037
        const sqrtTerm = (totalDays - 23.73) / 8.052;
        if (sqrtTerm < 0) return null;
        const expectedCRL = (sqrtTerm * sqrtTerm) / 1.037;

        // Expected range (+/- 15%)
        const crlLow = expectedCRL * 0.85;
        const crlHigh = expectedCRL * 1.15;

        return {
          primary: { label: "Expected CRL", value: `${formatNumber(expectedCRL, 1)} mm` },
          details: [
            { label: "Gestational Age", value: `${formatNumber(gaWeeks, 0)} weeks, ${formatNumber(gaDaysExtra, 0)} days` },
            { label: "Expected CRL", value: `${formatNumber(expectedCRL, 1)} mm (${formatNumber(expectedCRL / 10, 2)} cm)` },
            { label: "Normal Range", value: `${formatNumber(crlLow, 1)} - ${formatNumber(crlHigh, 1)} mm` },
          ],
          note: "Normal CRL varies. A measurement significantly below expected may warrant follow-up. Always interpret in clinical context with your healthcare provider.",
        };
      },
    },
  ],
  relatedSlugs: ["implantation-calculator", "period-calculator", "head-circumference-calculator"],
  faq: [
    {
      question: "What is Crown-Rump Length (CRL)?",
      answer:
        "CRL is the measurement from the top of the embryo's head (crown) to the bottom of its buttocks (rump). It is measured by ultrasound and is the most accurate method for dating a pregnancy during the first trimester (7-13 weeks).",
    },
    {
      question: "How accurate is CRL for dating pregnancy?",
      answer:
        "CRL dating in the first trimester is accurate to within 3-5 days (compared to 7-14 days for second trimester measurements). This is why first trimester ultrasound is preferred for establishing the due date.",
    },
    {
      question: "What if CRL is smaller than expected?",
      answer:
        "A CRL smaller than expected could mean the pregnancy is earlier than thought, or it could indicate a growth concern. A single measurement may not be conclusive — your doctor may recommend a follow-up ultrasound in 1-2 weeks to assess growth.",
    },
  ],
  formula:
    "Robinson & Fleming: GA (days) = 8.052 x sqrt(CRL_mm x 1.037) + 23.73 | Inverse: CRL = ((GA_days - 23.73) / 8.052)^2 / 1.037 | Due Date = 280 - GA_days remaining",
};
