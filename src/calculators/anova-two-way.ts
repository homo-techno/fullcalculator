import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const anovaTwoWayCalculator: CalculatorDefinition = {
  slug: "anova-two-way-calculator",
  title: "Two-Way ANOVA Calculator",
  description: "Free two-way ANOVA calculator. Analyze the effects of two factors and their interaction on a dependent variable with F-statistics and sum of squares.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["two-way anova", "anova calculator", "f-test", "factorial anova", "interaction effect", "statistics calculator"],
  variants: [
    {
      id: "summary",
      name: "Two-Way ANOVA (Summary Data)",
      description: "Enter summary statistics for a 2×2 factorial design",
      fields: [
        { name: "mean11", label: "Mean (A1, B1)", type: "number", placeholder: "e.g. 10.5", step: 0.1 },
        { name: "mean12", label: "Mean (A1, B2)", type: "number", placeholder: "e.g. 12.3", step: 0.1 },
        { name: "mean21", label: "Mean (A2, B1)", type: "number", placeholder: "e.g. 15.1", step: 0.1 },
        { name: "mean22", label: "Mean (A2, B2)", type: "number", placeholder: "e.g. 18.7", step: 0.1 },
        { name: "n", label: "Observations per Cell", type: "number", placeholder: "e.g. 10", min: 2 },
        { name: "mse", label: "Mean Square Error (MSE)", type: "number", placeholder: "e.g. 4.5", min: 0.001, step: 0.1 },
      ],
      calculate: (inputs) => {
        const m11 = parseFloat(inputs.mean11 as string);
        const m12 = parseFloat(inputs.mean12 as string);
        const m21 = parseFloat(inputs.mean21 as string);
        const m22 = parseFloat(inputs.mean22 as string);
        const n = parseFloat(inputs.n as string);
        const mse = parseFloat(inputs.mse as string);
        if (isNaN(m11) || isNaN(m12) || isNaN(m21) || isNaN(m22) || isNaN(n) || isNaN(mse)) return null;
        if (n < 2 || mse <= 0) return null;

        const grandMean = (m11 + m12 + m21 + m22) / 4;

        // Factor A means
        const meanA1 = (m11 + m12) / 2;
        const meanA2 = (m21 + m22) / 2;

        // Factor B means
        const meanB1 = (m11 + m21) / 2;
        const meanB2 = (m12 + m22) / 2;

        // SS for Factor A (2 levels, 2n observations each)
        const ssA = 2 * n * ((meanA1 - grandMean) ** 2 + (meanA2 - grandMean) ** 2);
        const dfA = 1;
        const msA = ssA / dfA;
        const fA = msA / mse;

        // SS for Factor B (2 levels, 2n observations each)
        const ssB = 2 * n * ((meanB1 - grandMean) ** 2 + (meanB2 - grandMean) ** 2);
        const dfB = 1;
        const msB = ssB / dfB;
        const fB = msB / mse;

        // Interaction SS
        const ssAB = n * (
          (m11 - meanA1 - meanB1 + grandMean) ** 2 +
          (m12 - meanA1 - meanB2 + grandMean) ** 2 +
          (m21 - meanA2 - meanB1 + grandMean) ** 2 +
          (m22 - meanA2 - meanB2 + grandMean) ** 2
        );
        const dfAB = 1;
        const msAB = ssAB / dfAB;
        const fAB = msAB / mse;

        const dfError = 4 * (n - 1);
        const ssError = mse * dfError;

        return {
          primary: { label: "F (Factor A)", value: formatNumber(fA, 4) },
          details: [
            { label: "SS Factor A", value: formatNumber(ssA, 4) },
            { label: "MS Factor A", value: formatNumber(msA, 4) },
            { label: "F (Factor A)", value: formatNumber(fA, 4) },
            { label: "SS Factor B", value: formatNumber(ssB, 4) },
            { label: "MS Factor B", value: formatNumber(msB, 4) },
            { label: "F (Factor B)", value: formatNumber(fB, 4) },
            { label: "SS Interaction (A×B)", value: formatNumber(ssAB, 4) },
            { label: "MS Interaction", value: formatNumber(msAB, 4) },
            { label: "F (Interaction)", value: formatNumber(fAB, 4) },
            { label: "SS Error", value: formatNumber(ssError, 4) },
            { label: "df Error", value: formatNumber(dfError, 0) },
            { label: "Grand Mean", value: formatNumber(grandMean, 4) },
          ],
        };
      },
    },
    {
      id: "effect-size",
      name: "Effect Size (Eta-Squared)",
      description: "Calculate eta-squared effect size from ANOVA results",
      fields: [
        { name: "ssEffect", label: "SS Effect (Treatment)", type: "number", placeholder: "e.g. 120", min: 0 },
        { name: "ssTotal", label: "SS Total", type: "number", placeholder: "e.g. 500", min: 0.001 },
        { name: "dfEffect", label: "df Effect", type: "number", placeholder: "e.g. 2", min: 1 },
        { name: "dfError", label: "df Error", type: "number", placeholder: "e.g. 27", min: 1 },
        { name: "ssError", label: "SS Error", type: "number", placeholder: "e.g. 380", min: 0 },
      ],
      calculate: (inputs) => {
        const ssEffect = parseFloat(inputs.ssEffect as string);
        const ssTotal = parseFloat(inputs.ssTotal as string);
        const dfEffect = parseFloat(inputs.dfEffect as string);
        const dfError = parseFloat(inputs.dfError as string);
        const ssError = parseFloat(inputs.ssError as string);
        if (isNaN(ssEffect) || isNaN(ssTotal) || isNaN(dfEffect) || isNaN(dfError) || isNaN(ssError)) return null;
        if (ssTotal <= 0 || dfEffect < 1 || dfError < 1) return null;

        const etaSquared = ssEffect / ssTotal;
        const partialEtaSq = ssEffect / (ssEffect + ssError);
        const omegaSquared = (ssEffect - dfEffect * (ssError / dfError)) / (ssTotal + ssError / dfError);

        let effectLabel = "Small";
        if (etaSquared >= 0.14) effectLabel = "Large";
        else if (etaSquared >= 0.06) effectLabel = "Medium";

        return {
          primary: { label: "Eta-Squared (η²)", value: formatNumber(etaSquared, 4) },
          details: [
            { label: "Partial η²", value: formatNumber(partialEtaSq, 4) },
            { label: "Omega-Squared (ω²)", value: formatNumber(Math.max(0, omegaSquared), 4) },
            { label: "Effect Size", value: effectLabel },
            { label: "Variance Explained", value: `${formatNumber(etaSquared * 100, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["standard-deviation-calculator", "p-value-calculator", "probability-calculator"],
  faq: [
    { question: "What is two-way ANOVA?", answer: "Two-way ANOVA tests the effect of two independent variables (factors) on a dependent variable. It also tests whether there is an interaction between the two factors. For example, testing the effects of both drug type and dosage on blood pressure." },
    { question: "What is an interaction effect in two-way ANOVA?", answer: "An interaction effect occurs when the effect of one factor depends on the level of the other factor. A significant interaction means the factors do not act independently. For example, a drug might work well at high dosage but not at low dosage." },
    { question: "What is eta-squared?", answer: "Eta-squared (η²) is an effect size measure that represents the proportion of total variance explained by a factor. Values of 0.01, 0.06, and 0.14 are considered small, medium, and large effects respectively." },
  ],
  formula: "SS_A = bn·Σ(Ā_i - X̄)² | SS_B = an·Σ(B̄_j - X̄)² | SS_AB = n·Σ(X̄_ij - Ā_i - B̄_j + X̄)² | F = MS_effect / MS_error",
};
