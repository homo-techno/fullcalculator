import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const abgInterpreterCalculator: CalculatorDefinition = {
  slug: "abg-interpreter",
  title: "Arterial Blood Gas (ABG) Interpreter",
  description: "Free ABG interpreter. Analyze arterial blood gas results including pH, PaCO2, HCO3, and PaO2 to determine acid-base disorders and compensation status.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["abg interpreter", "arterial blood gas calculator", "abg analysis", "acid base calculator", "blood gas interpreter", "pH calculator nursing"],
  variants: [
    {
      id: "abg-analysis",
      name: "ABG Interpretation",
      description: "Interpret arterial blood gas values to determine acid-base status",
      fields: [
        { name: "ph", label: "pH", type: "number", placeholder: "e.g. 7.40", min: 6.8, max: 7.8, step: 0.01 },
        { name: "paco2", label: "PaCO2 (mmHg)", type: "number", placeholder: "e.g. 40", min: 10, max: 120, step: 0.1 },
        { name: "hco3", label: "HCO3 (mEq/L)", type: "number", placeholder: "e.g. 24", min: 5, max: 50, step: 0.1 },
        { name: "pao2", label: "PaO2 (mmHg)", type: "number", placeholder: "e.g. 95", min: 20, max: 600, step: 1 },
      ],
      calculate: (inputs) => {
        const ph = inputs.ph as number;
        const paco2 = inputs.paco2 as number;
        const hco3 = inputs.hco3 as number;
        const pao2 = inputs.pao2 as number;
        if (!ph || !paco2 || !hco3) return null;
        let primaryDisorder = "";
        let compensation = "";
        let oxygenation = "";
        const acidOrAlkaline = ph < 7.35 ? "acidosis" : ph > 7.45 ? "alkalosis" : "normal";
        if (acidOrAlkaline === "acidosis") {
          if (paco2 > 45) {
            primaryDisorder = "Respiratory Acidosis";
            const expectedHCO3Chronic = 24 + 0.35 * (paco2 - 40);
            const expectedHCO3Acute = 24 + 0.1 * (paco2 - 40);
            if (hco3 >= expectedHCO3Chronic - 2) { compensation = "Chronic (compensated)"; }
            else if (hco3 >= expectedHCO3Acute - 2) { compensation = "Acute (partial compensation)"; }
            else { compensation = "Acute (uncompensated)"; }
          } else if (hco3 < 22) {
            primaryDisorder = "Metabolic Acidosis";
            const expectedPaCO2 = 1.5 * hco3 + 8;
            if (Math.abs(paco2 - expectedPaCO2) <= 2) { compensation = "Appropriately compensated (Winters formula)"; }
            else if (paco2 < expectedPaCO2) { compensation = "Additional respiratory alkalosis"; }
            else { compensation = "Inadequate respiratory compensation"; }
          } else { primaryDisorder = "Mixed Acidosis"; compensation = "Evaluate clinically"; }
        } else if (acidOrAlkaline === "alkalosis") {
          if (paco2 < 35) {
            primaryDisorder = "Respiratory Alkalosis";
            const expectedHCO3Chronic = 24 - 0.5 * (40 - paco2);
            const expectedHCO3Acute = 24 - 0.2 * (40 - paco2);
            if (hco3 <= expectedHCO3Chronic + 2) { compensation = "Chronic (compensated)"; }
            else if (hco3 <= expectedHCO3Acute + 2) { compensation = "Acute (partial compensation)"; }
            else { compensation = "Acute (uncompensated)"; }
          } else if (hco3 > 26) {
            primaryDisorder = "Metabolic Alkalosis";
            const expectedPaCO2 = 0.7 * hco3 + 21;
            if (Math.abs(paco2 - expectedPaCO2) <= 2) { compensation = "Appropriately compensated"; }
            else { compensation = "Inadequate respiratory compensation"; }
          } else { primaryDisorder = "Mixed Alkalosis"; compensation = "Evaluate clinically"; }
        } else {
          if (paco2 >= 35 && paco2 <= 45 && hco3 >= 22 && hco3 <= 26) { primaryDisorder = "Normal ABG"; compensation = "No disorder detected"; }
          else { primaryDisorder = "Mixed Disorder (compensated)"; compensation = "pH normal but CO2/HCO3 abnormal"; }
        }
        if (pao2) {
          if (pao2 >= 80) oxygenation = "Normal oxygenation";
          else if (pao2 >= 60) oxygenation = "Mild hypoxemia";
          else if (pao2 >= 40) oxygenation = "Moderate hypoxemia";
          else oxygenation = "Severe hypoxemia";
        }
        const anionGap = formatNumber(140 - 101 - hco3, 1);
        return {
          primary: { label: "Interpretation", value: primaryDisorder },
          details: [
            { label: "pH Status", value: acidOrAlkaline.charAt(0).toUpperCase() + acidOrAlkaline.slice(1) },
            { label: "Primary Disorder", value: primaryDisorder },
            { label: "Compensation", value: compensation },
            { label: "Oxygenation", value: oxygenation || "PaO2 not provided" },
            { label: "Anion Gap (est.)", value: anionGap + " mEq/L" },
            { label: "pH", value: formatNumber(ph, 2) },
            { label: "PaCO2", value: formatNumber(paco2, 1) + " mmHg" },
            { label: "HCO3", value: formatNumber(hco3, 1) + " mEq/L" },
          ],
          note: "This tool is for educational purposes. Always correlate ABG results with clinical presentation. Normal: pH 7.35-7.45, PaCO2 35-45 mmHg, HCO3 22-26 mEq/L, PaO2 80-100 mmHg.",
        };
      },
    },
  ],
  relatedSlugs: ["blood-pressure", "fena-calculator", "egfr-calculator"],
  faq: [
    { question: "What are normal ABG values?", answer: "Normal ranges: pH 7.35-7.45, PaCO2 35-45 mmHg, HCO3 22-26 mEq/L, PaO2 80-100 mmHg." },
    { question: "How do I interpret ABG results step by step?", answer: "Step 1: Check pH. Step 2: Check PaCO2 (respiratory). Step 3: Check HCO3 (metabolic). Step 4: Determine compensation. Step 5: Check PaO2 oxygenation." },
    { question: "What is Winters formula?", answer: "Winters formula predicts expected PaCO2 in metabolic acidosis: Expected PaCO2 = (1.5 x HCO3) + 8, plus or minus 2." },
  ],
  formula: "Anion Gap = Na - Cl - HCO3 | Winters Formula: Expected PaCO2 = 1.5 x HCO3 + 8",
};
