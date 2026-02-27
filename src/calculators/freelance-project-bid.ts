import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const freelanceProjectBidCalculator: CalculatorDefinition = {
  slug: "freelance-project-bid",
  title: "Freelance Project Bid Calculator",
  description:
    "Calculate the right bid price for freelance projects based on your target hourly rate, estimated hours, expenses, and profit margin.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "freelance",
    "project bid",
    "pricing",
    "hourly rate",
    "proposal",
    "contractor",
    "estimate",
  ],
  variants: [
    {
      slug: "freelance-project-bid",
      title: "Project Bid Calculator",
      description:
        "Calculate a competitive project bid that covers your costs and desired profit.",
      fields: [
        {
          name: "estimatedHours",
          label: "Estimated Project Hours",
          type: "number",
          defaultValue: "40",
        },
        {
          name: "targetHourlyRate",
          label: "Target Hourly Rate ($)",
          type: "number",
          defaultValue: "75",
        },
        {
          name: "directExpenses",
          label: "Direct Project Expenses ($)",
          type: "number",
          defaultValue: "200",
        },
        {
          name: "scopeBuffer",
          label: "Scope Creep Buffer (%)",
          type: "number",
          defaultValue: "20",
        },
        {
          name: "profitMargin",
          label: "Desired Profit Margin (%)",
          type: "number",
          defaultValue: "15",
        },
        {
          name: "revisionsIncluded",
          label: "Revision Rounds Included",
          type: "number",
          defaultValue: "2",
        },
        {
          name: "hoursPerRevision",
          label: "Estimated Hours Per Revision",
          type: "number",
          defaultValue: "4",
        },
      ],
      calculate(inputs) {
        const hours = parseFloat(inputs.estimatedHours as string);
        const rate = parseFloat(inputs.targetHourlyRate as string);
        const expenses = parseFloat(inputs.directExpenses as string);
        const buffer = parseFloat(inputs.scopeBuffer as string) / 100;
        const margin = parseFloat(inputs.profitMargin as string) / 100;
        const revisions = parseFloat(inputs.revisionsIncluded as string);
        const hoursPerRevision = parseFloat(inputs.hoursPerRevision as string);

        const revisionHours = revisions * hoursPerRevision;
        const totalHours = hours + revisionHours;
        const bufferedHours = totalHours * (1 + buffer);
        const laborCost = bufferedHours * rate;
        const subtotal = laborCost + expenses;
        const profitAmount = subtotal * margin;
        const totalBid = subtotal + profitAmount;
        const effectiveHourly = totalBid / totalHours;
        const taxReserve = totalBid * 0.3;
        const takeHome = totalBid - taxReserve;

        return {
          "Base Hours": formatNumber(hours),
          "Revision Hours": formatNumber(revisionHours),
          "Buffered Total Hours": formatNumber(bufferedHours),
          "Labor Cost": `$${formatNumber(laborCost)}`,
          "Direct Expenses": `$${formatNumber(expenses)}`,
          "Profit Margin": `$${formatNumber(profitAmount)}`,
          "Recommended Bid Price": `$${formatNumber(totalBid)}`,
          "Effective Hourly Rate": `$${formatNumber(effectiveHourly)}`,
          "Tax Reserve (30%)": `$${formatNumber(taxReserve)}`,
          "Estimated Take Home": `$${formatNumber(takeHome)}`,
        };
      },
    },
    {
      slug: "freelance-project-bid-value",
      title: "Value-Based Pricing",
      description:
        "Calculate project pricing based on the value delivered to the client.",
      fields: [
        {
          name: "clientRevenue",
          label: "Expected Client Revenue/Savings ($)",
          type: "number",
          defaultValue: "50000",
        },
        {
          name: "valuePercent",
          label: "Value Capture Percentage (%)",
          type: "number",
          defaultValue: "10",
        },
        {
          name: "estimatedHours",
          label: "Estimated Hours",
          type: "number",
          defaultValue: "40",
        },
        {
          name: "minimumHourly",
          label: "Minimum Hourly Rate ($)",
          type: "number",
          defaultValue: "75",
        },
      ],
      calculate(inputs) {
        const clientValue = parseFloat(inputs.clientRevenue as string);
        const valuePercent = parseFloat(inputs.valuePercent as string) / 100;
        const hours = parseFloat(inputs.estimatedHours as string);
        const minRate = parseFloat(inputs.minimumHourly as string);

        const valuePrice = clientValue * valuePercent;
        const floorPrice = hours * minRate;
        const recommendedPrice = Math.max(valuePrice, floorPrice);
        const effectiveRate = recommendedPrice / hours;
        const clientROI = clientValue - recommendedPrice;
        const roiMultiple = clientValue / recommendedPrice;

        return {
          "Value-Based Price": `$${formatNumber(valuePrice)}`,
          "Floor Price (Cost-Based)": `$${formatNumber(floorPrice)}`,
          "Recommended Price": `$${formatNumber(recommendedPrice)}`,
          "Effective Hourly Rate": `$${formatNumber(effectiveRate)}`,
          "Client ROI": `$${formatNumber(clientROI)}`,
          "Client ROI Multiple": `${formatNumber(roiMultiple)}x`,
        };
      },
    },
  ],
  relatedSlugs: [
    "contractor-vs-employee",
    "1099-deduction",
    "product-pricing",
  ],
  faq: [
    {
      question: "How do I determine my freelance hourly rate?",
      answer:
        "Start with your desired annual salary, add 25-30% for taxes and benefits, then divide by billable hours (typically 1,000-1,500/year). For example: ($80,000 + 30%) / 1,200 hours = $87/hour. Adjust based on market rates and your experience level.",
    },
    {
      question: "Should I bid fixed-price or hourly?",
      answer:
        "Fixed-price bids work well for well-defined projects with clear scope. Hourly billing is better for ongoing work or projects with uncertain scope. Always include a scope creep buffer (15-25%) in fixed-price bids.",
    },
  ],
  formula:
    "Bid = (Estimated Hours + Revision Hours) x (1 + Buffer%) x Hourly Rate + Expenses + Profit Margin. Value Price = Client Expected Value x Value Capture %.",
};
