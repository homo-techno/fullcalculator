import type { CalculatorDefinition } from "./types";

export const allergySeasonCalculator: CalculatorDefinition = {
  slug: "allergy-season-calculator",
  title: "Allergy Season Predictor Calculator",
  description:
    "Free allergy season predictor calculator. Find out which allergens are active by month and region. Plan ahead for seasonal allergy management.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "allergy season",
    "allergy predictor",
    "pollen season",
    "seasonal allergies",
    "hay fever season",
    "allergy calendar",
    "allergy forecast",
  ],
  variants: [
    {
      id: "season-check",
      name: "Allergy Season by Month & Region",
      description: "Check which allergens are typically active for your month and region",
      fields: [
        {
          name: "month",
          label: "Month",
          type: "select",
          options: [
            { label: "January", value: "1" },
            { label: "February", value: "2" },
            { label: "March", value: "3" },
            { label: "April", value: "4" },
            { label: "May", value: "5" },
            { label: "June", value: "6" },
            { label: "July", value: "7" },
            { label: "August", value: "8" },
            { label: "September", value: "9" },
            { label: "October", value: "10" },
            { label: "November", value: "11" },
            { label: "December", value: "12" },
          ],
        },
        {
          name: "region",
          label: "US Climate Region",
          type: "select",
          options: [
            { label: "Northeast (NY, MA, PA, CT, etc.)", value: "northeast" },
            { label: "Southeast (FL, GA, NC, SC, etc.)", value: "southeast" },
            { label: "Midwest (OH, IL, MI, MN, etc.)", value: "midwest" },
            { label: "Southwest (AZ, NM, TX, NV, etc.)", value: "southwest" },
            { label: "Northwest (WA, OR, ID, MT, etc.)", value: "northwest" },
            { label: "West Coast (CA)", value: "westcoast" },
          ],
        },
        {
          name: "allergyType",
          label: "Primary Allergy Type",
          type: "select",
          options: [
            { label: "Tree Pollen", value: "tree" },
            { label: "Grass Pollen", value: "grass" },
            { label: "Weed/Ragweed Pollen", value: "weed" },
            { label: "Mold Spores", value: "mold" },
            { label: "All / Not Sure", value: "all" },
          ],
        },
      ],
      calculate: (inputs) => {
        const month = parseInt(inputs.month as string);
        const region = inputs.region as string;
        const type = inputs.allergyType as string;
        if (!month || !region || !type) return null;

        // Allergen activity data by season (simplified model)
        const allergenData: Record<string, Record<string, { peak: number[]; active: number[] }>> = {
          northeast: {
            tree: { peak: [4, 5], active: [3, 4, 5, 6] },
            grass: { peak: [5, 6, 7], active: [5, 6, 7, 8] },
            weed: { peak: [8, 9], active: [7, 8, 9, 10] },
            mold: { peak: [7, 8, 9], active: [4, 5, 6, 7, 8, 9, 10] },
          },
          southeast: {
            tree: { peak: [2, 3, 4], active: [1, 2, 3, 4, 5] },
            grass: { peak: [4, 5, 6], active: [3, 4, 5, 6, 7, 8, 9] },
            weed: { peak: [8, 9, 10], active: [7, 8, 9, 10, 11] },
            mold: { peak: [6, 7, 8, 9], active: [3, 4, 5, 6, 7, 8, 9, 10, 11] },
          },
          midwest: {
            tree: { peak: [4, 5], active: [3, 4, 5, 6] },
            grass: { peak: [5, 6, 7], active: [5, 6, 7, 8] },
            weed: { peak: [8, 9], active: [7, 8, 9, 10] },
            mold: { peak: [7, 8, 9], active: [5, 6, 7, 8, 9, 10] },
          },
          southwest: {
            tree: { peak: [2, 3, 4], active: [1, 2, 3, 4, 5] },
            grass: { peak: [3, 4, 5], active: [2, 3, 4, 5, 6, 10, 11] },
            weed: { peak: [8, 9, 10], active: [7, 8, 9, 10, 11] },
            mold: { peak: [7, 8], active: [7, 8, 9] },
          },
          northwest: {
            tree: { peak: [3, 4, 5], active: [2, 3, 4, 5, 6] },
            grass: { peak: [5, 6, 7], active: [5, 6, 7, 8] },
            weed: { peak: [7, 8, 9], active: [7, 8, 9] },
            mold: { peak: [9, 10, 11], active: [7, 8, 9, 10, 11] },
          },
          westcoast: {
            tree: { peak: [2, 3, 4], active: [1, 2, 3, 4, 5] },
            grass: { peak: [4, 5, 6], active: [3, 4, 5, 6, 7] },
            weed: { peak: [7, 8, 9], active: [6, 7, 8, 9, 10] },
            mold: { peak: [10, 11, 12], active: [9, 10, 11, 12, 1] },
          },
        };

        const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const types = type === "all" ? ["tree", "grass", "weed", "mold"] : [type];
        const regionData = allergenData[region];

        const activeAllergens: string[] = [];
        const peakAllergens: string[] = [];
        let overallSeverity = "Low";

        for (const t of types) {
          const data = regionData[t];
          if (data.peak.includes(month)) {
            peakAllergens.push(t === "tree" ? "Tree pollen" : t === "grass" ? "Grass pollen" : t === "weed" ? "Weed/ragweed pollen" : "Mold spores");
          }
          if (data.active.includes(month)) {
            activeAllergens.push(t === "tree" ? "Tree pollen" : t === "grass" ? "Grass pollen" : t === "weed" ? "Weed/ragweed pollen" : "Mold spores");
          }
        }

        if (peakAllergens.length >= 2) overallSeverity = "Very High";
        else if (peakAllergens.length === 1) overallSeverity = "High";
        else if (activeAllergens.length >= 2) overallSeverity = "Moderate";
        else if (activeAllergens.length === 1) overallSeverity = "Low-Moderate";
        else overallSeverity = "Low";

        const tips: string[] = [];
        if (overallSeverity !== "Low") {
          tips.push("Start allergy medications 1-2 weeks before peak season");
          tips.push("Keep windows closed on high pollen days");
          tips.push("Shower after outdoor activities");
          tips.push("Check local pollen forecasts daily");
        }

        return {
          primary: { label: `${monthNames[month]} Allergy Severity`, value: overallSeverity },
          details: [
            { label: "Month", value: monthNames[month] },
            { label: "Peak allergens", value: peakAllergens.length > 0 ? peakAllergens.join(", ") : "None at peak levels" },
            { label: "Active allergens", value: activeAllergens.length > 0 ? activeAllergens.join(", ") : "Minimal allergen activity" },
            { label: "Overall severity", value: overallSeverity },
            ...(tips.length > 0 ? [{ label: "Management tips", value: tips.join("; ") }] : []),
          ],
          note: "Allergen seasons vary by year based on weather, temperature, and rainfall patterns. This provides typical seasonal patterns. Check local pollen counts at pollen.com or weather services for real-time data. Climate change is extending allergy seasons. Consult an allergist for persistent symptoms.",
        };
      },
    },
    {
      id: "symptom-tracker",
      name: "Allergy Symptom Severity Score",
      description: "Rate your allergy symptoms to track severity",
      fields: [
        {
          name: "sneezing",
          label: "Sneezing",
          type: "select",
          options: [
            { label: "None (0)", value: "0" },
            { label: "Mild - occasional (1)", value: "1" },
            { label: "Moderate - frequent (2)", value: "2" },
            { label: "Severe - constant (3)", value: "3" },
          ],
        },
        {
          name: "congestion",
          label: "Nasal Congestion",
          type: "select",
          options: [
            { label: "None (0)", value: "0" },
            { label: "Mild (1)", value: "1" },
            { label: "Moderate (2)", value: "2" },
            { label: "Severe - can't breathe through nose (3)", value: "3" },
          ],
        },
        {
          name: "itchyEyes",
          label: "Itchy/Watery Eyes",
          type: "select",
          options: [
            { label: "None (0)", value: "0" },
            { label: "Mild (1)", value: "1" },
            { label: "Moderate (2)", value: "2" },
            { label: "Severe (3)", value: "3" },
          ],
        },
        {
          name: "runnyNose",
          label: "Runny Nose",
          type: "select",
          options: [
            { label: "None (0)", value: "0" },
            { label: "Mild (1)", value: "1" },
            { label: "Moderate (2)", value: "2" },
            { label: "Severe - constant drip (3)", value: "3" },
          ],
        },
        {
          name: "cough",
          label: "Cough / Throat Irritation",
          type: "select",
          options: [
            { label: "None (0)", value: "0" },
            { label: "Mild (1)", value: "1" },
            { label: "Moderate (2)", value: "2" },
            { label: "Severe (3)", value: "3" },
          ],
        },
        {
          name: "sleepImpact",
          label: "Impact on Sleep",
          type: "select",
          options: [
            { label: "None (0)", value: "0" },
            { label: "Mild difficulty (1)", value: "1" },
            { label: "Moderate difficulty (2)", value: "2" },
            { label: "Severe - can't sleep (3)", value: "3" },
          ],
        },
      ],
      calculate: (inputs) => {
        const scores = [
          parseInt(inputs.sneezing as string) || 0,
          parseInt(inputs.congestion as string) || 0,
          parseInt(inputs.itchyEyes as string) || 0,
          parseInt(inputs.runnyNose as string) || 0,
          parseInt(inputs.cough as string) || 0,
          parseInt(inputs.sleepImpact as string) || 0,
        ];

        const total = scores.reduce((a, b) => a + b, 0);
        const maxScore = 18;

        let severity: string;
        let treatment: string;
        if (total <= 3) { severity = "Mild"; treatment = "OTC antihistamines as needed; nasal saline rinse"; }
        else if (total <= 8) { severity = "Moderate"; treatment = "Daily antihistamine + nasal corticosteroid spray"; }
        else if (total <= 13) { severity = "Moderate-Severe"; treatment = "Nasal corticosteroid + antihistamine combo; consider allergist referral"; }
        else { severity = "Severe"; treatment = "See an allergist; consider allergy testing and immunotherapy (allergy shots)"; }

        return {
          primary: { label: "Symptom Severity", value: `${severity} (${total}/${maxScore})` },
          details: [
            { label: "Total score", value: `${total} / ${maxScore}` },
            { label: "Severity", value: severity },
            { label: "Treatment consideration", value: treatment },
            { label: "Worst symptom(s)", value: (() => {
              const labels = ["Sneezing", "Congestion", "Itchy eyes", "Runny nose", "Cough", "Sleep impact"];
              const max = Math.max(...scores);
              if (max === 0) return "None";
              return labels.filter((_, i) => scores[i] === max).join(", ");
            })() },
          ],
          note: "This symptom tracker helps you monitor allergy severity over time. Record scores regularly to identify patterns and evaluate treatment effectiveness. If symptoms persist despite OTC treatment, or if you have asthma symptoms, see an allergist. This is not medical advice.",
        };
      },
    },
  ],
  relatedSlugs: ["sleep-cycle-calculator", "pain-scale-calculator"],
  faq: [
    {
      question: "When is allergy season?",
      answer:
        "Tree pollen: spring (Feb-May). Grass pollen: late spring to summer (May-July). Ragweed: late summer to fall (Aug-Oct). Mold: varies, often summer-fall. Seasons vary by region and are getting longer due to climate change.",
    },
    {
      question: "What is the best allergy medicine?",
      answer:
        "Second-generation antihistamines (cetirizine, loratadine, fexofenadine) are first-line for mild symptoms. Nasal corticosteroid sprays (fluticasone, mometasone) are most effective for moderate-severe nasal symptoms. Consult your healthcare provider for personalized recommendations.",
    },
    {
      question: "When should I see an allergist?",
      answer:
        "See an allergist if: OTC medications don't control symptoms, symptoms last more than 3 months, allergies trigger asthma, you want allergy testing, or you're interested in immunotherapy (allergy shots or sublingual tablets).",
    },
    {
      question: "How can I reduce allergy exposure?",
      answer:
        "Keep windows closed during high pollen days, use HEPA air filters, shower and change clothes after outdoor activity, avoid outdoor exercise in early morning (peak pollen), wear sunglasses outdoors, and consider a nasal saline rinse.",
    },
  ],
  formula:
    "Symptom severity score: Sum of individual symptom ratings (0-3 each) across 6 domains. Total 0-18. Mild: 0-3, Moderate: 4-8, Moderate-Severe: 9-13, Severe: 14-18.",
};
