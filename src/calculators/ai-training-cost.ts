import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aiTrainingCostCalculator: CalculatorDefinition = {
  slug: "ai-training-cost",
  title: "AI Model Training & Fine-Tuning Cost Estimator",
  description:
    "Estimate the compute cost of training or fine-tuning AI models based on GPU type, training hours, and cloud provider pricing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "ai training cost",
    "fine-tuning cost",
    "gpu training",
    "model training",
    "compute cost",
    "machine learning cost",
    "deep learning training",
    "gpu hours",
  ],
  variants: [
    {
      slug: "ai-training-cost",
      title: "AI Model Training Cost Estimator",
      description:
        "Estimate the cost of training or fine-tuning an AI model on cloud GPUs.",
      fields: [
        {
          id: "gpuType",
          label: "GPU Type",
          type: "select",
          options: [
            { label: "NVIDIA A100 (80GB)", value: "a100_80" },
            { label: "NVIDIA A100 (40GB)", value: "a100_40" },
            { label: "NVIDIA H100", value: "h100" },
            { label: "NVIDIA V100", value: "v100" },
            { label: "NVIDIA A10G", value: "a10g" },
            { label: "NVIDIA T4", value: "t4" },
          ],
          defaultValue: "a100_80",
        },
        {
          id: "numberOfGpus",
          label: "Number of GPUs",
          type: "number",
          defaultValue: 8,
        },
        {
          id: "trainingHours",
          label: "Estimated Training Hours",
          type: "number",
          defaultValue: 100,
        },
        {
          id: "cloudProvider",
          label: "Cloud Provider",
          type: "select",
          options: [
            { label: "AWS", value: "aws" },
            { label: "Google Cloud", value: "gcp" },
            { label: "Azure", value: "azure" },
            { label: "Lambda Labs", value: "lambda" },
          ],
          defaultValue: "aws",
        },
        {
          id: "spotInstance",
          label: "Instance Type",
          type: "select",
          options: [
            { label: "On-Demand", value: "ondemand" },
            { label: "Spot/Preemptible (60% discount)", value: "spot" },
            { label: "Reserved (30% discount)", value: "reserved" },
          ],
          defaultValue: "ondemand",
        },
      ],
      calculate(inputs) {
        const gpuType = inputs.gpuType as string;
        const numberOfGpus = parseFloat(inputs.numberOfGpus as string);
        const trainingHours = parseFloat(inputs.trainingHours as string);
        const cloudProvider = inputs.cloudProvider as string;
        const spotInstance = inputs.spotInstance as string;

        // Hourly rates per GPU by provider
        const rates: Record<string, Record<string, number>> = {
          aws: {
            a100_80: 4.10,
            a100_40: 3.40,
            h100: 5.60,
            v100: 2.14,
            a10g: 1.50,
            t4: 0.53,
          },
          gcp: {
            a100_80: 3.93,
            a100_40: 3.22,
            h100: 5.31,
            v100: 2.07,
            a10g: 1.40,
            t4: 0.35,
          },
          azure: {
            a100_80: 3.67,
            a100_40: 3.06,
            h100: 5.47,
            v100: 2.07,
            a10g: 1.45,
            t4: 0.53,
          },
          lambda: {
            a100_80: 2.49,
            a100_40: 1.99,
            h100: 3.49,
            v100: 1.25,
            a10g: 0.75,
            t4: 0.33,
          },
        };

        const hourlyRate =
          rates[cloudProvider]?.[gpuType] ?? rates["aws"]["a100_80"];

        let discountMultiplier = 1;
        if (spotInstance === "spot") discountMultiplier = 0.4;
        else if (spotInstance === "reserved") discountMultiplier = 0.7;

        const effectiveRate = hourlyRate * discountMultiplier;
        const totalGpuHours = numberOfGpus * trainingHours;
        const totalCost = totalGpuHours * effectiveRate;
        const costPerGpuHour = effectiveRate;

        return {
          "Hourly Rate per GPU": "$" + formatNumber(effectiveRate),
          "Total GPU-Hours": formatNumber(totalGpuHours),
          "Total Training Cost": "$" + formatNumber(totalCost),
          "Cost per GPU-Hour": "$" + formatNumber(costPerGpuHour),
          "Training Days": formatNumber(trainingHours / 24),
          "Savings vs On-Demand":
            "$" +
            formatNumber(totalGpuHours * hourlyRate - totalCost),
          "On-Demand Cost": "$" + formatNumber(totalGpuHours * hourlyRate),
        };
      },
    },
    {
      slug: "ai-fine-tuning-cost",
      title: "LLM Fine-Tuning Cost Calculator",
      description:
        "Estimate the cost of fine-tuning a language model through an API provider.",
      fields: [
        {
          id: "provider",
          label: "Fine-Tuning Provider",
          type: "select",
          options: [
            { label: "OpenAI (GPT-4o Mini)", value: "openai_mini" },
            { label: "OpenAI (GPT-4o)", value: "openai_4o" },
            { label: "Anthropic Fine-Tuning", value: "anthropic" },
          ],
          defaultValue: "openai_mini",
        },
        {
          id: "trainingTokens",
          label: "Training Tokens (millions)",
          type: "number",
          defaultValue: 10,
        },
        {
          id: "epochs",
          label: "Number of Epochs",
          type: "number",
          defaultValue: 3,
        },
      ],
      calculate(inputs) {
        const provider = inputs.provider as string;
        const trainingTokens = parseFloat(inputs.trainingTokens as string);
        const epochs = parseFloat(inputs.epochs as string);

        const ratePerMillion: Record<string, number> = {
          openai_mini: 3.0,
          openai_4o: 25.0,
          anthropic: 20.0,
        };

        const rate = ratePerMillion[provider] ?? 3.0;
        const totalTokens = trainingTokens * epochs;
        const totalCost = totalTokens * rate;

        return {
          "Rate per Million Tokens": "$" + formatNumber(rate),
          "Total Training Tokens (M)": formatNumber(totalTokens),
          "Total Fine-Tuning Cost": "$" + formatNumber(totalCost),
          "Cost per Epoch": "$" + formatNumber(trainingTokens * rate),
          Epochs: formatNumber(epochs),
        };
      },
    },
  ],
  relatedSlugs: [
    "ai-api-cost",
    "llm-token-calculator",
    "cloud-hosting-cost",
    "ai-image-cost",
  ],
  faq: [
    {
      question: "How much does it cost to train an AI model?",
      answer:
        "Training costs vary enormously. Fine-tuning a small model can cost $10-$100, while training a large language model from scratch can cost millions of dollars. Key factors include model size, dataset size, number of training epochs, and GPU type.",
    },
    {
      question: "Are spot instances reliable for AI training?",
      answer:
        "Spot instances offer 60-70% savings but can be interrupted. For training, use checkpointing to save progress regularly. Short fine-tuning jobs work well on spot instances. Long training runs benefit from reserved instances for stability.",
    },
    {
      question:
        "What is the difference between training and fine-tuning costs?",
      answer:
        "Training from scratch requires far more compute (thousands of GPU-hours) and data. Fine-tuning adapts a pre-trained model with much less compute (hours to days) and data. API-based fine-tuning charges per token and is the most accessible option.",
    },
  ],
  formula:
    "Total Cost = Number of GPUs x Training Hours x Hourly Rate per GPU x Discount Multiplier. Fine-Tuning Cost = Training Tokens (millions) x Epochs x Rate per Million Tokens.",
};
