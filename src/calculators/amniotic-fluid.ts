import type { CalculatorDefinition } from "./types";

export const amnioticFluidCalculator: CalculatorDefinition = {
  slug: "amniotic-fluid-calculator",
  title: "Amniotic Fluid Index Calculator",
  description:
    "Free amniotic fluid index (AFI) calculator. Assess amniotic fluid levels based on ultrasound measurements and gestational age.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "amniotic fluid index",
    "AFI calculator",
    "amniotic fluid level",
    "polyhydramnios",
    "oligohydramnios",
  ],
  variants: [
    {
      id: "afi",
      name: "AFI Assessment",
      description: "Calculate and assess amniotic fluid index from four-quadrant measurement",
      fields: [
        {
          name: "q1",
          label: "Quadrant 1 - Upper Right (cm)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
          max: 20,
          step: 0.1,
        },
        {
          name: "q2",
          label: "Quadrant 2 - Upper Left (cm)",
          type: "number",
          placeholder: "e.g. 4.5",
          min: 0,
          max: 20,
          step: 0.1,
        },
        {
          name: "q3",
          label: "Quadrant 3 - Lower Right (cm)",
          type: "number",
          placeholder: "e.g. 3.5",
          min: 0,
          max: 20,
          step: 0.1,
        },
        {
          name: "q4",
          label: "Quadrant 4 - Lower Left (cm)",
          type: "number",
          placeholder: "e.g. 4",
          min: 0,
          max: 20,
          step: 0.1,
        },
        {
          name: "gestWeeks",
          label: "Gestational Age (weeks)",
          type: "number",
          placeholder: "e.g. 32",
          min: 16,
          max: 42,
        },
      ],
      calculate: (inputs) => {
        const q1 = inputs.q1 as number;
        const q2 = inputs.q2 as number;
        const q3 = inputs.q3 as number;
        const q4 = inputs.q4 as number;
        const weeks = inputs.gestWeeks as number;
        if (q1 === undefined || q2 === undefined || q3 === undefined || q4 === undefined || !weeks) return null;

        const afi = q1 + q2 + q3 + q4;

        let assessment = "";
        let recommendation = "";
        let color = "";

        if (afi < 5) {
          assessment = "Oligohydramnios (Low)";
          recommendation = "AFI below 5 cm indicates low amniotic fluid. Immediate medical evaluation recommended. May require closer monitoring or intervention.";
          color = "Critical";
        } else if (afi < 8) {
          assessment = "Borderline Low";
          recommendation = "AFI is below normal range. Increased monitoring recommended. Stay well hydrated and discuss with your provider.";
          color = "Warning";
        } else if (afi <= 24) {
          assessment = "Normal";
          recommendation = "AFI is within normal range. Continue routine prenatal care.";
          color = "Normal";
        } else if (afi <= 30) {
          assessment = "Borderline High";
          recommendation = "AFI is slightly elevated. May warrant additional monitoring. Often resolves on its own.";
          color = "Warning";
        } else {
          assessment = "Polyhydramnios (High)";
          recommendation = "AFI above 25-30 cm indicates excessive amniotic fluid. Medical evaluation recommended to determine cause.";
          color = "Critical";
        }

        // Normal AFI range varies by gestational age
        let normalRange = "8-24 cm";
        if (weeks < 24) normalRange = "Increasing (fluid levels rising)";
        else if (weeks <= 36) normalRange = "8-24 cm (peak around 34-36 weeks)";
        else normalRange = "Gradually decreasing toward delivery";

        return {
          primary: { label: "AFI Assessment", value: `${afi.toFixed(1)} cm - ${assessment}` },
          details: [
            { label: "Total AFI", value: `${afi.toFixed(1)} cm` },
            { label: "Status", value: `${color}: ${assessment}` },
            { label: "Recommendation", value: recommendation },
            { label: "Quadrant measurements", value: `${q1} + ${q2} + ${q3} + ${q4} cm` },
            { label: "Normal range at ${weeks} weeks", value: normalRange },
            { label: "Gestational age", value: `${weeks} weeks` },
          ],
          note: "AFI should be interpreted by your healthcare provider in context of your overall pregnancy. Single deepest pocket (SDP) measurement may also be used.",
        };
      },
    },
    {
      id: "sdp",
      name: "Single Deepest Pocket (SDP)",
      description: "Assess using single deepest pocket measurement",
      fields: [
        {
          name: "sdpCm",
          label: "Single Deepest Pocket (cm)",
          type: "number",
          placeholder: "e.g. 4",
          min: 0,
          max: 20,
          step: 0.1,
        },
        {
          name: "gestWeeks",
          label: "Gestational Age (weeks)",
          type: "number",
          placeholder: "e.g. 32",
          min: 16,
          max: 42,
        },
      ],
      calculate: (inputs) => {
        const sdp = inputs.sdpCm as number;
        const weeks = inputs.gestWeeks as number;
        if (!sdp || !weeks) return null;

        let assessment = "";
        let recommendation = "";

        if (sdp < 2) {
          assessment = "Oligohydramnios (Low)";
          recommendation = "SDP below 2 cm indicates low fluid. Seek medical evaluation promptly.";
        } else if (sdp < 3) {
          assessment = "Borderline Low";
          recommendation = "Close to low threshold. Increased monitoring recommended.";
        } else if (sdp <= 8) {
          assessment = "Normal";
          recommendation = "SDP is within normal range. Continue routine care.";
        } else {
          assessment = "Polyhydramnios (High)";
          recommendation = "SDP above 8 cm suggests excessive fluid. Medical evaluation recommended.";
        }

        return {
          primary: { label: "SDP Assessment", value: `${sdp} cm - ${assessment}` },
          details: [
            { label: "Single deepest pocket", value: `${sdp} cm` },
            { label: "Recommendation", value: recommendation },
            { label: "Normal SDP range", value: "2-8 cm" },
            { label: "Gestational age", value: `${weeks} weeks` },
          ],
          note: "SDP is an alternative to AFI for assessing amniotic fluid. Your provider will determine which measurement method is most appropriate.",
        };
      },
    },
  ],
  relatedSlugs: ["fetal-weight-calculator", "gestational-age-calculator"],
  faq: [
    {
      question: "What is the amniotic fluid index (AFI)?",
      answer:
        "The AFI is the sum of the deepest fluid pocket measurements in each of four quadrants of the uterus, measured in centimeters by ultrasound. Normal AFI ranges from about 8-24 cm, with fluid levels typically peaking around 34-36 weeks.",
    },
    {
      question: "What causes low or high amniotic fluid?",
      answer:
        "Low fluid (oligohydramnios) can be caused by membrane rupture, placental problems, fetal kidney issues, or post-term pregnancy. High fluid (polyhydramnios) can be caused by gestational diabetes, fetal swallowing difficulties, twin-to-twin transfusion, or sometimes has no identifiable cause.",
    },
  ],
  formula:
    "AFI = Q1 + Q2 + Q3 + Q4 (cm). Normal: 8-24 cm. Oligohydramnios: <5 cm. Polyhydramnios: >24 cm. SDP: Normal 2-8 cm.",
};
