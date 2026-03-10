import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aiChatbotTcoCalculator: CalculatorDefinition = {
  slug: "ai-chatbot-tco-calculator",
  title: "AI Chatbot TCO Calculator",
  description:
    "Calculate total cost of ownership for AI chatbot deployment. Include development, hosting, API costs, maintenance, and customer support.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "chatbot cost of ownership",
    "AI chatbot TCO",
    "chatbot implementation cost",
    "conversational AI cost",
    "chatbot ROI",
  ],
  variants: [
    {
      id: "deployment",
      name: "Deployment Costs",
      description: "Calculate year 1 chatbot deployment costs",
      fields: [
        {
          name: "conversationsPerDay",
          label: "Daily Conversations",
          type: "number",
          placeholder: "e.g. 1000",
          suffix: "conversations",
        },
        {
          name: "avgMessagesPerConv",
          label: "Avg Messages Per Conversation",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "messages",
        },
        {
          name: "deploymentType",
          label: "Deployment Type",
          type: "select",
          options: [
            { label: "API-based (no hosting)", value: "api" },
            { label: "Cloud-hosted (AWS/GCP)", value: "cloud" },
            { label: "On-premises", value: "onprem" },
          ],
          defaultValue: "api",
        },
      ],
      calculate: (inputs) => {
        const conversationsPerDay = parseFloat(inputs.conversationsPerDay as string) || 1000;
        const avgMessagesPerConv = parseFloat(inputs.avgMessagesPerConv as string) || 5;
        const deploymentType = inputs.deploymentType as string;

        const monthlyConversations = conversationsPerDay * 30;
        const monthlyMessages = monthlyConversations * avgMessagesPerConv;

        // One-time development costs
        let devCost = 10000; // Basic chatbot
        if (avgMessagesPerConv > 10) devCost = 25000; // Complex conversations
        if (monthlyConversations > 50000) devCost = 50000; // Large scale

        // Hosting costs
        let hostingCost = 0;
        let hostingName = "";
        if (deploymentType === "api") {
          hostingCost = 0;
          hostingName = "None (API calls only)";
        } else if (deploymentType === "cloud") {
          hostingCost = 500; // Conservative estimate
          hostingName = "Cloud infrastructure";
        } else {
          hostingCost = 2000; // Servers, network, ops
          hostingName = "On-premises";
        }

        // API costs (assuming Claude/GPT-4)
        const tokensPerMessage = 300; // Input + output avg
        const monthlyTokens = monthlyMessages * tokensPerMessage;
        const apiCost = (monthlyTokens / 1000000) * 0.01; // ~$0.01 per M tokens

        // Integration + testing
        const integrationCost = 5000; // One-time

        // Training data / fine-tuning
        const finetuningCost = 3000; // One-time

        // Year 1 total
        const year1Total = devCost + (hostingCost * 12) + (apiCost * 12) + integrationCost + finetuningCost;

        // Year 2+ ongoing
        const ongoingYearlyCost = (hostingCost * 12) + (apiCost * 12) + (3000); // Support

        return {
          primary: { label: "Year 1 Total Cost", value: `$${formatNumber(year1Total, 2)}` },
          details: [
            { label: "Development", value: `$${formatNumber(devCost, 2)}` },
            { label: "Integration & testing", value: `$${formatNumber(integrationCost, 2)}` },
            { label: "Fine-tuning", value: `$${formatNumber(finetuningCost, 2)}` },
            { label: "Hosting (annual)", value: `$${formatNumber(hostingCost * 12, 2)}` },
            { label: "API calls (annual)", value: `$${formatNumber(apiCost * 12, 2)}` },
            { label: "Year 2+ annual cost", value: `$${formatNumber(ongoingYearlyCost, 2)}` },
            { label: "Monthly run cost", value: `$${formatNumber((hostingCost + apiCost), 2)}` },
            { label: "Cost per conversation", value: `$${formatNumber((apiCost + hostingCost / monthlyConversations), 4)}` },
          ],
          note: "Excludes support staff labor and training. Add 2-3 FTE for large-scale deployments.",
        };
      },
    },
    {
      id: "roi",
      name: "ROI Analysis",
      description: "Analyze chatbot ROI through support cost savings",
      fields: [
        {
          name: "conversationsPerDay",
          label: "Daily Conversations",
          type: "number",
          placeholder: "e.g. 1000",
          suffix: "conversations",
        },
        {
          name: "supportCostPerConv",
          label: "Typical Support Cost Per Conversation",
          type: "number",
          placeholder: "e.g. 5",
          prefix: "$",
        },
        {
          name: "chatbotResolutionRate",
          label: "Chatbot Self-Resolution Rate",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "%",
          min: 0,
          max: 100,
        },
      ],
      calculate: (inputs) => {
        const conversationsPerDay = parseFloat(inputs.conversationsPerDay as string) || 1000;
        const supportCostPerConv = parseFloat(inputs.supportCostPerConv as string) || 5;
        const resolutionRate = parseFloat(inputs.chatbotResolutionRate as string) || 70;

        const monthlyConversations = conversationsPerDay * 30;
        const yearlyChatbotConversations = monthlyConversations * 12;

        // Conversations handled by chatbot
        const chatbotHandled = yearlyChatbotConversations * (resolutionRate / 100);

        // Support cost savings
        const supportCostSaved = chatbotHandled * supportCostPerConv;

        // Year 1 costs (from previous calculator, simplified)
        const year1Cost = 60000; // Rough estimate

        // ROI calculation
        const year1Roi = supportCostSaved - year1Cost;
        const paybackMonths = year1Cost / (supportCostSaved / 12);

        return {
          primary: { label: "Year 1 ROI", value: `$${formatNumber(year1Roi, 2)}` },
          details: [
            { label: "Annual conversations", value: formatNumber(yearlyChatbotConversations) },
            { label: "Bot resolution rate", value: `${resolutionRate}%` },
            { label: "Conversations resolved by bot", value: formatNumber(chatbotHandled) },
            { label: "Support cost per conv", value: `$${supportCostPerConv}` },
            { label: "Annual support savings", value: `$${formatNumber(supportCostSaved, 2)}` },
            { label: "Year 1 implementation cost", value: `$${formatNumber(year1Cost, 2)}` },
            { label: "Year 1 net ROI", value: `$${formatNumber(year1Roi, 2)}` },
            { label: "Break-even period", value: `${formatNumber(paybackMonths, 1)} months` },
          ],
          note: "ROI improves significantly in Year 2+. Resolution rate highly depends on use case (FAQ vs complex issues).",
        };
      },
    },
  ],
  relatedSlugs: ["llm-api-cost-calculator", "ai-vs-human-labor-cost"],
  faq: [
    {
      question: "What's realistic chatbot resolution rate?",
      answer:
        "FAQ/billing: 80-95%. Tech support: 40-60%. Complex issues: 20-30%. Most companies deploy chatbots for specific, well-defined use cases with high resolution rates.",
    },
    {
      question: "How much does chatbot development cost?",
      answer:
        "Simple chatbot (no fine-tuning): $5-15k. Custom-trained: $25-50k. Enterprise with NLU customization: $50-200k. Labor is main cost, not technology.",
    },
    {
      question: "When do chatbots break even?",
      answer:
        "Most break even within 6-18 months if resolution rate > 60% and support costs are > $3/conversation. For low-volume support (< 100 conv/day), ROI is negative.",
    },
  ],
  formula: "Year 1 Total = Dev Cost + Integration + Fine-tuning + (Monthly Hosting + API) × 12",
};
