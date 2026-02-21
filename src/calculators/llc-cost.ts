import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const llcCostCalculator: CalculatorDefinition = {
  slug: "llc-cost-calculator",
  title: "LLC Formation Cost Calculator",
  description: "Free LLC cost calculator. Estimate the total cost to form an LLC including state filing fees, registered agent, operating agreement, and annual compliance costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["LLC cost calculator", "LLC formation cost", "how much to start an LLC", "LLC filing fee", "LLC registration cost"],
  variants: [
    {
      id: "llc-formation",
      name: "LLC Formation Cost Estimator",
      description: "Estimate total costs to form and maintain an LLC",
      fields: [
        { name: "state", label: "State of Formation", type: "select", options: [
          { label: "California ($70 + $800 franchise tax)", value: "CA" },
          { label: "Delaware ($90 - business friendly)", value: "DE" },
          { label: "Florida ($125)", value: "FL" },
          { label: "New York ($200 + publication ~$1,500)", value: "NY" },
          { label: "Texas ($300)", value: "TX" },
          { label: "Nevada ($425 + business license $200)", value: "NV" },
          { label: "Wyoming ($100 - low cost)", value: "WY" },
          { label: "Illinois ($150)", value: "IL" },
          { label: "Georgia ($100)", value: "GA" },
          { label: "Other state (average $100-$200)", value: "OTHER" },
        ], defaultValue: "OTHER" },
        { name: "filingMethod", label: "How Are You Filing?", type: "select", options: [
          { label: "DIY (file yourself)", value: "diy" },
          { label: "Online formation service ($50-$300)", value: "service" },
          { label: "Attorney ($500-$2,000)", value: "attorney" },
        ], defaultValue: "diy" },
        { name: "registeredAgent", label: "Registered Agent", type: "select", options: [
          { label: "Be your own agent (free)", value: "self" },
          { label: "Professional registered agent", value: "professional" },
        ], defaultValue: "professional" },
        { name: "operatingAgreement", label: "Operating Agreement", type: "select", options: [
          { label: "Use free template", value: "template" },
          { label: "Attorney-drafted", value: "attorney" },
        ], defaultValue: "template" },
        { name: "einNeeded", label: "Need EIN from IRS?", type: "select", options: [
          { label: "Yes (free from IRS)", value: "yes" },
          { label: "No", value: "no" },
        ], defaultValue: "yes" },
      ],
      calculate: (inputs) => {
        const state = inputs.state as string;
        const filingMethod = inputs.filingMethod as string;
        const registeredAgent = inputs.registeredAgent as string;
        const operatingAgreement = inputs.operatingAgreement as string;

        // State filing fees
        const stateFees: Record<string, { filing: number; annual: number; extra: number; extraLabel: string }> = {
          CA: { filing: 70, annual: 800, extra: 0, extraLabel: "Annual franchise tax minimum" },
          DE: { filing: 90, annual: 300, extra: 0, extraLabel: "" },
          FL: { filing: 125, annual: 138, extra: 0, extraLabel: "" },
          NY: { filing: 200, annual: 25, extra: 1500, extraLabel: "Publication requirement" },
          TX: { filing: 300, annual: 0, extra: 0, extraLabel: "No annual franchise tax for small LLCs" },
          NV: { filing: 425, annual: 350, extra: 200, extraLabel: "State business license" },
          WY: { filing: 100, annual: 60, extra: 0, extraLabel: "" },
          IL: { filing: 150, annual: 75, extra: 0, extraLabel: "" },
          GA: { filing: 100, annual: 50, extra: 0, extraLabel: "" },
          OTHER: { filing: 150, annual: 100, extra: 0, extraLabel: "" },
        };

        const fees = stateFees[state] || stateFees.OTHER;

        // Filing service costs
        const filingServiceCosts: Record<string, number> = {
          diy: 0,
          service: 150,
          attorney: 1000,
        };
        const filingServiceFee = filingServiceCosts[filingMethod] || 0;

        // Registered agent
        const registeredAgentFee = registeredAgent === "professional" ? 125 : 0;
        const annualAgentFee = registeredAgent === "professional" ? 125 : 0;

        // Operating agreement
        const oaFee = operatingAgreement === "attorney" ? 750 : 0;

        // First year total
        const firstYearCost = fees.filing + fees.extra + filingServiceFee + registeredAgentFee + oaFee;
        const annualOngoingCost = fees.annual + annualAgentFee;
        const fiveYearCost = firstYearCost + (annualOngoingCost * 4);

        return {
          primary: { label: "First-Year Formation Cost", value: `$${formatNumber(firstYearCost)}` },
          details: [
            { label: "State filing fee", value: `$${formatNumber(fees.filing)}` },
            { label: "Additional state costs", value: fees.extra > 0 ? `$${formatNumber(fees.extra)} (${fees.extraLabel})` : "None" },
            { label: "Filing service / attorney", value: filingServiceFee > 0 ? `$${formatNumber(filingServiceFee)}` : "DIY (no cost)" },
            { label: "Registered agent (year 1)", value: registeredAgentFee > 0 ? `$${formatNumber(registeredAgentFee)}` : "Self (free)" },
            { label: "Operating agreement", value: oaFee > 0 ? `$${formatNumber(oaFee)} (attorney-drafted)` : "Free template" },
            { label: "EIN", value: "Free (IRS.gov)" },
            { label: "Annual ongoing costs", value: `$${formatNumber(annualOngoingCost)}/year` },
            { label: "5-year total cost", value: `$${formatNumber(fiveYearCost)}` },
          ],
          note: "LLC costs vary significantly by state. Some states like California have a mandatory $800 annual franchise tax. States like Wyoming and New Mexico are popular for low costs. If operating in a state other than where you formed, you may also need to register as a foreign LLC.",
        };
      },
    },
  ],
  relatedSlugs: ["business-license-calculator", "trademark-cost-calculator", "patent-cost-calculator"],
  faq: [
    { question: "How much does it cost to start an LLC?", answer: "State filing fees range from $40 (Kentucky) to $500 (Massachusetts). The cheapest states to form an LLC are Kentucky ($40), Colorado ($50), Iowa ($50), and Wyoming ($100). Additional costs include registered agent ($100-$300/year), and optional attorney or filing service fees ($100-$2,000)." },
    { question: "Do I need a registered agent?", answer: "Yes, every LLC needs a registered agent with a physical address in the state of formation. You can serve as your own agent (free) or hire a professional service ($100-$300/year). A professional agent ensures privacy and reliability for receiving legal documents." },
    { question: "What are annual LLC costs?", answer: "Most states require an annual report fee ($25-$300) and some charge franchise taxes. California is the most expensive with an $800 minimum franchise tax. Some states like Texas and Wyoming have minimal or no annual fees for small LLCs. Budget $100-$1,000/year for ongoing compliance." },
  ],
  formula: "First-Year Cost = State Filing Fee + Extra State Costs + Filing Service Fee + Registered Agent + Operating Agreement. Annual Cost = State Annual Fee + Registered Agent Fee.",
};
