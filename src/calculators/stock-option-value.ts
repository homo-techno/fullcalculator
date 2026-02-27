import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stockOptionValueCalculator: CalculatorDefinition = {
  slug: "stock-option-value",
  title: "Employee Stock Option Value Calculator",
  description:
    "Calculate the potential value of employee stock options (ISOs and NSOs) including exercise costs, tax implications, and various exit scenarios.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "stock option value",
    "employee stock options",
    "iso calculator",
    "nso calculator",
    "option exercise",
    "startup equity value",
    "stock option tax",
    "vesting calculator",
  ],
  variants: [
    {
      slug: "stock-option-value",
      title: "Stock Option Value Calculator",
      description:
        "Calculate the value of your employee stock options under different exit scenarios.",
      fields: [
        {
          id: "numberOfOptions",
          label: "Number of Options Granted",
          type: "number",
          defaultValue: 10000,
        },
        {
          id: "strikePrice",
          label: "Strike / Exercise Price ($)",
          type: "number",
          defaultValue: 1.5,
        },
        {
          id: "currentFmv",
          label: "Current Fair Market Value per Share ($)",
          type: "number",
          defaultValue: 5,
        },
        {
          id: "exitValuation",
          label: "Expected Exit Price per Share ($)",
          type: "number",
          defaultValue: 25,
        },
        {
          id: "optionType",
          label: "Option Type",
          type: "select",
          options: [
            { label: "ISO (Incentive Stock Option)", value: "iso" },
            { label: "NSO (Non-Qualified Stock Option)", value: "nso" },
          ],
          defaultValue: "iso",
        },
        {
          id: "vestingPercent",
          label: "Percent Vested (%)",
          type: "number",
          defaultValue: 50,
        },
        {
          id: "taxBracket",
          label: "Income Tax Bracket (%)",
          type: "number",
          defaultValue: 32,
        },
      ],
      calculate(inputs) {
        const numberOfOptions = parseFloat(inputs.numberOfOptions as string);
        const strikePrice = parseFloat(inputs.strikePrice as string);
        const currentFmv = parseFloat(inputs.currentFmv as string);
        const exitValuation = parseFloat(inputs.exitValuation as string);
        const optionType = inputs.optionType as string;
        const vestingPercent = parseFloat(inputs.vestingPercent as string) / 100;
        const taxBracket = parseFloat(inputs.taxBracket as string) / 100;

        const vestedOptions = numberOfOptions * vestingPercent;
        const exerciseCost = vestedOptions * strikePrice;
        const currentSpread = (currentFmv - strikePrice) * vestedOptions;
        const exitSpread = (exitValuation - strikePrice) * vestedOptions;

        // Tax calculation
        let taxOnExercise = 0;
        let taxOnSale = 0;
        const capitalGainsTax = 0.20; // Long-term capital gains

        if (optionType === "nso") {
          // NSO: ordinary income tax on spread at exercise
          taxOnExercise = currentSpread * taxBracket;
          // Capital gains on appreciation after exercise
          taxOnSale = (exitValuation - currentFmv) * vestedOptions * capitalGainsTax;
        } else {
          // ISO: no tax at exercise (but AMT may apply)
          taxOnExercise = 0;
          // All gain taxed as capital gains if held > 1 year
          taxOnSale = exitSpread * capitalGainsTax;
        }

        const totalTax = taxOnExercise + taxOnSale;
        const netValue = exitSpread - exerciseCost - totalTax + exerciseCost;
        const netProfit = exitSpread - totalTax;

        return {
          "Vested Options": formatNumber(vestedOptions),
          "Exercise Cost": "$" + formatNumber(exerciseCost),
          "Current Paper Value": "$" + formatNumber(currentSpread),
          "Exit Value (gross)": "$" + formatNumber(exitSpread),
          "Estimated Tax on Exercise": "$" + formatNumber(taxOnExercise),
          "Estimated Tax on Sale": "$" + formatNumber(taxOnSale),
          "Total Estimated Tax": "$" + formatNumber(totalTax),
          "Net Profit After Tax": "$" + formatNumber(netProfit),
          "Return on Exercise Cost":
            formatNumber((netProfit / exerciseCost) * 100) + "%",
        };
      },
    },
    {
      slug: "stock-option-vesting",
      title: "Stock Option Vesting Schedule",
      description:
        "Calculate your vesting schedule and option value over time.",
      fields: [
        {
          id: "totalOptions",
          label: "Total Options Granted",
          type: "number",
          defaultValue: 20000,
        },
        {
          id: "vestingPeriod",
          label: "Vesting Period",
          type: "select",
          options: [
            { label: "4 years with 1-year cliff", value: "4yr_cliff" },
            { label: "4 years monthly (no cliff)", value: "4yr_monthly" },
            { label: "3 years with 1-year cliff", value: "3yr_cliff" },
          ],
          defaultValue: "4yr_cliff",
        },
        {
          id: "monthsEmployed",
          label: "Months Employed",
          type: "number",
          defaultValue: 18,
        },
        {
          id: "strikePrice",
          label: "Strike Price ($)",
          type: "number",
          defaultValue: 2,
        },
        {
          id: "currentValue",
          label: "Current Value per Share ($)",
          type: "number",
          defaultValue: 10,
        },
      ],
      calculate(inputs) {
        const totalOptions = parseFloat(inputs.totalOptions as string);
        const vestingPeriod = inputs.vestingPeriod as string;
        const monthsEmployed = parseFloat(inputs.monthsEmployed as string);
        const strikePrice = parseFloat(inputs.strikePrice as string);
        const currentValue = parseFloat(inputs.currentValue as string);

        let vestedOptions = 0;
        let totalMonths = 48;

        if (vestingPeriod === "4yr_cliff") {
          totalMonths = 48;
          if (monthsEmployed < 12) {
            vestedOptions = 0;
          } else {
            vestedOptions = (totalOptions / totalMonths) * monthsEmployed;
          }
        } else if (vestingPeriod === "4yr_monthly") {
          totalMonths = 48;
          vestedOptions = (totalOptions / totalMonths) * monthsEmployed;
        } else {
          totalMonths = 36;
          if (monthsEmployed < 12) {
            vestedOptions = 0;
          } else {
            vestedOptions = (totalOptions / totalMonths) * monthsEmployed;
          }
        }

        vestedOptions = Math.min(Math.floor(vestedOptions), totalOptions);
        const unvestedOptions = totalOptions - vestedOptions;
        const currentGrossValue = vestedOptions * (currentValue - strikePrice);
        const exerciseCost = vestedOptions * strikePrice;
        const monthsRemaining = Math.max(0, totalMonths - monthsEmployed);

        return {
          "Vested Options": formatNumber(vestedOptions),
          "Unvested Options": formatNumber(unvestedOptions),
          "Vesting Progress":
            formatNumber((vestedOptions / totalOptions) * 100) + "%",
          "Current Gross Value": "$" + formatNumber(currentGrossValue),
          "Exercise Cost": "$" + formatNumber(exerciseCost),
          "Net Value": "$" + formatNumber(currentGrossValue),
          "Months to Fully Vested": formatNumber(monthsRemaining),
          "Monthly Vesting":
            formatNumber(Math.floor(totalOptions / totalMonths)) + " options",
        };
      },
    },
  ],
  relatedSlugs: [
    "equity-dilution",
    "startup-runway",
    "saas-metrics",
    "course-pricing",
  ],
  faq: [
    {
      question: "What is the difference between ISOs and NSOs?",
      answer:
        "ISOs (Incentive Stock Options) receive favorable tax treatment - no ordinary income tax at exercise, with gains taxed as long-term capital gains if held 1+ year after exercise and 2+ years after grant. NSOs are taxed as ordinary income on the spread at exercise, with subsequent gains taxed as capital gains.",
    },
    {
      question: "When should I exercise my stock options?",
      answer:
        "The optimal exercise timing depends on tax implications, company trajectory, and personal finances. Early exercise of ISOs can minimize AMT impact. For NSOs, exercise when you believe the stock will appreciate significantly. Always consider the exercise cost and tax liability before exercising.",
    },
    {
      question: "What happens to stock options if I leave the company?",
      answer:
        "Typically, unvested options are forfeited when you leave. Vested options usually must be exercised within 90 days of departure (some companies offer extended exercise windows). If you do not exercise within this window, the vested options are also forfeited.",
    },
  ],
  formula:
    "Exit Value = Vested Options x (Exit Price - Strike Price). Exercise Cost = Vested Options x Strike Price. ISO Tax = Exit Value x Capital Gains Rate. NSO Tax = Spread at Exercise x Income Tax Rate + Post-Exercise Gain x Capital Gains Rate.",
};
