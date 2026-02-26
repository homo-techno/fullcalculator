import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dividendYieldCalc: CalculatorDefinition = {
  slug: "dividend-yield-calc",
  title: "Dividend Yield Calculator",
  description: "Free online dividend yield calculator with DRIP. Calculate dividend yield, annual income, and projected growth with dividend reinvestment.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dividend yield", "dividend calculator", "DRIP", "dividend reinvestment", "dividend income", "yield calculator", "passive income"],
  variants: [
    {
      id: "yield-calc",
      name: "Calculate Dividend Yield",
      fields: [
        {
          name: "stockPrice",
          label: "Current Stock Price ($)",
          type: "number",
          placeholder: "e.g. 50",
          min: 0,
        },
        {
          name: "annualDividend",
          label: "Annual Dividend Per Share ($)",
          type: "number",
          placeholder: "e.g. 2.50",
          min: 0,
        },
        {
          name: "sharesOwned",
          label: "Number of Shares Owned",
          type: "number",
          placeholder: "e.g. 200",
          min: 0,
        },
        {
          name: "payoutFrequency",
          label: "Dividend Payout Frequency",
          type: "select",
          options: [
            { label: "Quarterly", value: "4" },
            { label: "Monthly", value: "12" },
            { label: "Semi-Annual", value: "2" },
            { label: "Annual", value: "1" },
          ],
        },
      ],
      calculate: (inputs) => {
        const price = parseFloat(inputs.stockPrice as string) || 0;
        const annualDiv = parseFloat(inputs.annualDividend as string) || 0;
        const shares = parseFloat(inputs.sharesOwned as string) || 0;
        const frequency = parseFloat(inputs.payoutFrequency as string) || 4;

        const dividendYield = price > 0 ? (annualDiv / price) * 100 : 0;
        const annualIncome = annualDiv * shares;
        const monthlyIncome = annualIncome / 12;
        const perPayment = frequency > 0 ? annualIncome / frequency : 0;
        const totalInvested = price * shares;
        const yieldOnCost = totalInvested > 0 ? (annualIncome / totalInvested) * 100 : 0;

        return {
          primary: { label: "Dividend Yield", value: formatNumber(dividendYield, 2) + "%" },
          details: [
            { label: "Annual Dividend Income", value: "$" + formatNumber(annualIncome) },
            { label: "Monthly Income", value: "$" + formatNumber(monthlyIncome) },
            { label: "Income Per Payment", value: "$" + formatNumber(perPayment) },
            { label: "Total Investment Value", value: "$" + formatNumber(totalInvested) },
            { label: "Yield on Cost", value: formatNumber(yieldOnCost, 2) + "%" },
          ],
        };
      },
    },
    {
      id: "drip",
      name: "DRIP Projection",
      fields: [
        {
          name: "initialShares",
          label: "Current Shares Owned",
          type: "number",
          placeholder: "e.g. 100",
          min: 0,
        },
        {
          name: "stockPrice",
          label: "Current Stock Price ($)",
          type: "number",
          placeholder: "e.g. 50",
          min: 0,
        },
        {
          name: "annualDividend",
          label: "Annual Dividend Per Share ($)",
          type: "number",
          placeholder: "e.g. 2.00",
          min: 0,
        },
        {
          name: "dividendGrowthRate",
          label: "Annual Dividend Growth Rate (%)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
        },
        {
          name: "priceGrowthRate",
          label: "Annual Stock Price Growth Rate (%)",
          type: "number",
          placeholder: "e.g. 7",
          min: 0,
        },
        {
          name: "years",
          label: "Investment Horizon (years)",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
          max: 50,
        },
      ],
      calculate: (inputs) => {
        const initialShares = parseFloat(inputs.initialShares as string) || 0;
        const stockPrice = parseFloat(inputs.stockPrice as string) || 0;
        const annualDiv = parseFloat(inputs.annualDividend as string) || 0;
        const divGrowth = parseFloat(inputs.dividendGrowthRate as string) || 0;
        const priceGrowth = parseFloat(inputs.priceGrowthRate as string) || 0;
        const years = parseFloat(inputs.years as string) || 10;

        let shares = initialShares;
        let currentDiv = annualDiv;
        let currentPrice = stockPrice;
        let totalDividendsReceived = 0;

        for (let y = 0; y < years; y++) {
          const yearDividend = shares * currentDiv;
          totalDividendsReceived += yearDividend;
          // Reinvest dividends (DRIP)
          const newShares = currentPrice > 0 ? yearDividend / currentPrice : 0;
          shares += newShares;
          // Grow dividend and price
          currentDiv *= (1 + divGrowth / 100);
          currentPrice *= (1 + priceGrowth / 100);
        }

        const initialValue = initialShares * stockPrice;
        const finalValue = shares * currentPrice;
        const totalReturn = finalValue - initialValue;
        const finalAnnualIncome = shares * currentDiv;

        return {
          primary: { label: "Portfolio Value After " + years + " Years", value: "$" + formatNumber(finalValue) },
          details: [
            { label: "Initial Investment", value: "$" + formatNumber(initialValue) },
            { label: "Total Shares (with DRIP)", value: formatNumber(shares, 2) },
            { label: "Stock Price in Year " + years, value: "$" + formatNumber(currentPrice) },
            { label: "Total Dividends Received", value: "$" + formatNumber(totalDividendsReceived) },
            { label: "Total Return", value: "$" + formatNumber(totalReturn) },
            { label: "Annual Income in Year " + years, value: "$" + formatNumber(finalAnnualIncome) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["stock-average-calc", "rsu-tax-calc", "apy-calculator"],
  faq: [
    {
      question: "What is dividend yield?",
      answer: "Dividend yield is the annual dividend payment divided by the stock price, expressed as a percentage. A stock trading at $50 with a $2 annual dividend has a 4% yield. It indicates how much income you receive relative to the stock price.",
    },
    {
      question: "What is DRIP?",
      answer: "DRIP (Dividend Reinvestment Plan) automatically uses your dividend payments to buy additional shares of the stock. This compounds your returns over time, as each new share also earns dividends. Most brokerages offer DRIP at no additional cost.",
    },
    {
      question: "What is a good dividend yield?",
      answer: "A healthy dividend yield is typically 2-6%. Yields below 2% may not provide enough income, while yields above 6% may signal the company is struggling (and may cut the dividend). Focus on companies with a history of growing dividends over time.",
    },
  ],
  formula: "Dividend Yield = (Annual Dividend / Stock Price) x 100\nDRIP: New Shares = Dividend Income / Stock Price (compounded annually)",
};
