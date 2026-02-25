import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inheritedIraRmdCalculator: CalculatorDefinition = {
  slug: "inherited-ira-rmd-calculator",
  title: "Inherited IRA RMD Calculator",
  description:
    "Free inherited IRA RMD calculator. Calculate required minimum distributions from an inherited IRA based on the SECURE Act rules.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "inherited IRA RMD",
    "inherited IRA calculator",
    "beneficiary IRA",
    "SECURE Act RMD",
    "inherited retirement account",
  ],
  variants: [
    {
      id: "inherited-rmd",
      name: "Inherited IRA RMD Calculator",
      description:
        "Calculate required minimum distribution for an inherited IRA",
      fields: [
        {
          name: "accountBalance",
          label: "Account Balance (Dec 31 prior year)",
          type: "number",
          placeholder: "e.g. 500000",
          prefix: "$",
        },
        {
          name: "beneficiaryAge",
          label: "Beneficiary's Current Age",
          type: "number",
          placeholder: "e.g. 45",
          min: 1,
          max: 100,
        },
        {
          name: "beneficiaryType",
          label: "Beneficiary Type",
          type: "select",
          options: [
            { label: "Non-Eligible Designated (10-yr rule)", value: "non-eligible" },
            { label: "Eligible Designated (spouse)", value: "spouse" },
            { label: "Eligible Designated (minor child)", value: "minor" },
            { label: "Eligible Designated (disabled/chronically ill)", value: "disabled" },
            { label: "Eligible (not more than 10 years younger)", value: "close-age" },
          ],
          defaultValue: "non-eligible",
        },
        {
          name: "yearsRemaining",
          label: "Years Since Original Owner's Death",
          type: "number",
          placeholder: "e.g. 2",
          defaultValue: 1,
          min: 1,
          max: 10,
        },
        {
          name: "marginalRate",
          label: "Marginal Tax Rate",
          type: "select",
          options: [
            { label: "12%", value: "12" },
            { label: "22%", value: "22" },
            { label: "24%", value: "24" },
            { label: "32%", value: "32" },
            { label: "35%", value: "35" },
            { label: "37%", value: "37" },
          ],
          defaultValue: "22",
        },
      ],
      calculate: (inputs) => {
        const balance = inputs.accountBalance as number;
        const age = inputs.beneficiaryAge as number;
        const benefType = inputs.beneficiaryType as string;
        const yearsSinceDeath = (inputs.yearsRemaining as number) || 1;
        const marginalRate =
          (parseInt(inputs.marginalRate as string) || 22) / 100;

        if (!balance || balance <= 0 || !age) return null;

        // Simplified Single Life Table divisor (approximate)
        const lifeExpectancy = Math.max(1, 84.6 - age + 0.5);

        let rmd = 0;
        let rule = "";
        let yearsLeft = 0;

        if (benefType === "non-eligible") {
          // 10-year rule: must empty account within 10 years
          // Post-SECURE 2.0: annual RMDs may be required in years 1-9
          yearsLeft = Math.max(1, 10 - yearsSinceDeath + 1);
          rmd = balance / yearsLeft;
          rule = `10-year rule (${yearsLeft} years remaining)`;
        } else if (benefType === "spouse") {
          const divisor = Math.max(1, lifeExpectancy);
          rmd = balance / divisor;
          yearsLeft = Math.round(divisor);
          rule = `Spouse: Life expectancy (${formatNumber(divisor)} years)`;
        } else if (benefType === "minor") {
          const divisor = Math.max(1, lifeExpectancy);
          rmd = balance / divisor;
          yearsLeft = Math.min(Math.round(divisor), 18 - age + 10);
          rule = "Minor child: Life expectancy until age of majority, then 10-year rule";
        } else if (benefType === "disabled" || benefType === "close-age") {
          const divisor = Math.max(1, lifeExpectancy);
          rmd = balance / divisor;
          yearsLeft = Math.round(divisor);
          rule = `Life expectancy (${formatNumber(divisor)} years)`;
        }

        const taxOnRMD = rmd * marginalRate;
        const afterTaxRMD = rmd - taxOnRMD;

        return {
          primary: {
            label: "Required Minimum Distribution",
            value: `$${formatNumber(rmd)}`,
          },
          details: [
            {
              label: "Account balance",
              value: `$${formatNumber(balance)}`,
            },
            {
              label: "Distribution rule",
              value: rule,
            },
            {
              label: "Estimated tax on RMD",
              value: `$${formatNumber(taxOnRMD)}`,
            },
            {
              label: "After-tax amount",
              value: `$${formatNumber(afterTaxRMD)}`,
            },
            {
              label: "Monthly distribution",
              value: `$${formatNumber(rmd / 12)}`,
            },
            {
              label: "Years remaining to distribute",
              value: `${yearsLeft}`,
            },
          ],
          note: "Under the SECURE Act, most non-spouse beneficiaries must empty the inherited IRA within 10 years. Eligible designated beneficiaries (spouses, minor children, disabled individuals, or those not more than 10 years younger) may use life expectancy.",
        };
      },
    },
  ],
  relatedSlugs: [
    "roth-conversion-calculator",
    "retirement-calculator",
    "tax-calculator",
  ],
  faq: [
    {
      question: "What is the 10-year rule for inherited IRAs?",
      answer:
        "Under the SECURE Act (2020), most non-spouse beneficiaries must withdraw the entire inherited IRA balance within 10 years of the original owner's death. The SECURE 2.0 Act clarified that annual RMDs may be required during those 10 years if the original owner was already taking RMDs.",
    },
    {
      question: "Who qualifies as an eligible designated beneficiary?",
      answer:
        "Eligible designated beneficiaries include: (1) the surviving spouse, (2) minor children of the deceased (until age of majority), (3) disabled or chronically ill individuals, and (4) individuals not more than 10 years younger than the deceased. These beneficiaries can stretch distributions over their life expectancy.",
    },
  ],
  formula:
    "RMD = Account Balance / Life Expectancy Factor (or remaining years under 10-year rule)",
};
