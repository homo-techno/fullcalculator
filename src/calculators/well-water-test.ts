import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wellWaterTestCalculator: CalculatorDefinition = {
  slug: "well-water-test",
  title: "Well Water Test Results Interpreter",
  description:
    "Interpret well water test results for common contaminants. Compare your readings against EPA and WHO safe drinking water standards.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "well water",
    "water test",
    "contaminants",
    "EPA",
    "drinking water",
    "pH",
    "bacteria",
    "nitrate",
    "hardness",
    "water quality",
  ],
  variants: [
    {
      slug: "basic-water-quality",
      title: "Basic Water Quality Check",
      fields: [
        {
          name: "ph",
          label: "pH Level",
          type: "number",
        },
        {
          name: "hardness",
          label: "Total Hardness (mg/L as CaCO3)",
          type: "number",
        },
        {
          name: "tds",
          label: "Total Dissolved Solids (mg/L)",
          type: "number",
        },
        {
          name: "iron",
          label: "Iron (mg/L)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const ph = parseFloat(inputs.ph as string);
        const hardness = parseFloat(inputs.hardness as string);
        const tds = parseFloat(inputs.tds as string);
        const iron = parseFloat(inputs.iron as string);
        if (isNaN(ph) || isNaN(hardness) || isNaN(tds) || isNaN(iron))
          return { error: "Please enter all water test values." };

        const phStatus =
          ph >= 6.5 && ph <= 8.5
            ? "Normal (EPA range 6.5-8.5)"
            : ph < 6.5
            ? "Acidic - may corrode pipes"
            : "Alkaline - may cause scaling";

        const hardnessStatus =
          hardness < 60
            ? "Soft"
            : hardness < 120
            ? "Moderately Hard"
            : hardness < 180
            ? "Hard"
            : "Very Hard - consider water softener";

        const tdsStatus =
          tds < 300
            ? "Excellent"
            : tds < 500
            ? "Good (EPA secondary limit: 500)"
            : tds < 1000
            ? "Fair - above EPA recommendation"
            : "Poor - consider treatment";

        const ironStatus =
          iron <= 0.3
            ? "Normal (EPA limit: 0.3 mg/L)"
            : iron <= 1.0
            ? "Elevated - may stain fixtures"
            : "High - treatment recommended";

        const hardnessGpg = hardness / 17.1;

        return {
          results: [
            { label: "pH Assessment", value: phStatus },
            { label: "Hardness Assessment", value: hardnessStatus },
            { label: "Hardness (grains/gal)", value: formatNumber(hardnessGpg) },
            { label: "TDS Assessment", value: tdsStatus },
            { label: "Iron Assessment", value: ironStatus },
          ],
        };
      },
    },
    {
      slug: "contaminant-check",
      title: "Contaminant Level Check",
      fields: [
        {
          name: "contaminant",
          label: "Contaminant Type",
          type: "select",
          options: [
            { label: "Nitrate (mg/L)", value: "nitrate" },
            { label: "Lead (mg/L)", value: "lead" },
            { label: "Arsenic (mg/L)", value: "arsenic" },
            { label: "Fluoride (mg/L)", value: "fluoride" },
            { label: "Manganese (mg/L)", value: "manganese" },
            { label: "Copper (mg/L)", value: "copper" },
          ],
        },
        {
          name: "level",
          label: "Measured Level (mg/L)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const contaminant = inputs.contaminant as string;
        const level = parseFloat(inputs.level as string);
        if (isNaN(level)) return { error: "Please enter a valid contaminant level." };

        const limits: Record<string, { epa: number; name: string; health: string }> = {
          nitrate: { epa: 10, name: "Nitrate", health: "Blue baby syndrome, digestive issues" },
          lead: { epa: 0.015, name: "Lead", health: "Neurological damage, developmental issues" },
          arsenic: { epa: 0.01, name: "Arsenic", health: "Cancer risk, skin lesions" },
          fluoride: { epa: 4.0, name: "Fluoride", health: "Skeletal fluorosis, dental issues" },
          manganese: { epa: 0.05, name: "Manganese", health: "Neurological effects, staining" },
          copper: { epa: 1.3, name: "Copper", health: "Gastrointestinal distress, liver damage" },
        };

        const info = limits[contaminant];
        const percentOfLimit = (level / info.epa) * 100;
        const status =
          level <= info.epa
            ? "Within EPA safe limit"
            : level <= info.epa * 2
            ? "Exceeds EPA limit - treatment recommended"
            : "Significantly exceeds EPA limit - immediate action needed";

        return {
          results: [
            { label: `${info.name} Level`, value: `${formatNumber(level)} mg/L` },
            { label: "EPA Maximum (MCL)", value: `${formatNumber(info.epa)} mg/L` },
            { label: "Percent of EPA Limit", value: `${formatNumber(percentOfLimit)}%` },
            { label: "Status", value: status },
            { label: "Health Concerns if Exceeded", value: info.health },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["septic-perc-test", "roof-snow-load", "radon-mitigation-cost"],
  faq: [
    {
      question: "How often should I test my well water?",
      answer:
        "The EPA recommends testing well water at least annually for bacteria (total coliform), nitrates, pH, and TDS. Test more frequently if you notice changes in taste, odor, or color, or after flooding, nearby construction, or septic system issues.",
    },
    {
      question: "What are the most important contaminants to test for?",
      answer:
        "Priority tests include coliform bacteria, nitrate/nitrite, pH, hardness, iron, and TDS. Depending on your area, you may also need to test for arsenic, lead, radon, fluoride, and volatile organic compounds. Check with your local health department for area-specific recommendations.",
    },
    {
      question: "What should I do if my well water fails a test?",
      answer:
        "Stop drinking the water immediately for health-related failures (bacteria, nitrate, lead). Retest to confirm results. Contact your local health department for guidance. Treatment options include disinfection (UV/chlorine), filtration (reverse osmosis, activated carbon), and water softening.",
    },
  ],
  formula:
    "Compare measured levels against EPA Maximum Contaminant Levels (MCL) | Hardness (gpg) = mg/L CaCO3 / 17.1 | Percent of limit = (measured / MCL) x 100",
};
