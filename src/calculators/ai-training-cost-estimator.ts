import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aiTrainingCostEstimator: CalculatorDefinition = {
  slug: "ai-training-cost-estimator",
  title: "AI Training Cost Estimator",
  description:
    "Estimate costs for fine-tuning language models or training custom ML models. Calculate GPU hours, data pipeline, and storage expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "AI model training cost",
    "fine-tuning cost calculator",
    "ML training budget",
    "GPU training hours",
    "model training expenses",
  ],
  variants: [
    {
      id: "finetuning",
      name: "Fine-Tuning Costs",
      description: "Estimate cost to fine-tune an existing model",
      fields: [
        {
          name: "modelType",
          label: "Model Type",
          type: "select",
          options: [
            { label: "Small LLM (7B parameters)", value: "small" },
            { label: "Medium LLM (13-70B parameters)", value: "medium" },
            { label: "Large LLM (70B+ parameters)", value: "large" },
            { label: "Vision Model (ViT)", value: "vision" },
          ],
          defaultValue: "medium",
        },
        {
          name: "datasetSize",
          label: "Fine-Tuning Dataset Size",
          type: "number",
          placeholder: "e.g. 10000",
          suffix: "examples",
        },
        {
          name: "epochs",
          label: "Training Epochs",
          type: "number",
          placeholder: "e.g. 3",
          min: 1,
          max: 10,
        },
      ],
      calculate: (inputs) => {
        const modelType = inputs.modelType as string;
        const datasetSize = parseFloat(inputs.datasetSize as string) || 10000;
        const epochs = parseFloat(inputs.epochs as string) || 3;

        const config = {
          small: { gpuHours: 0.5, costPerHour: 0.5 },
          medium: { gpuHours: 2, costPerHour: 1.6 },
          large: { gpuHours: 8, costPerHour: 3.5 },
          vision: { gpuHours: 3, costPerHour: 2.0 },
        };

        const modelConfig = config[modelType as keyof typeof config] || config.medium;
        const totalGpuHours = modelConfig.gpuHours * epochs * Math.log(datasetSize / 1000 + 1);
        const gpuCost = totalGpuHours * modelConfig.costPerHour;
        const storageEstimate = (datasetSize * 5) / 1024; // ~5KB per example
        const storageCost = storageEstimate * 0.023; // ~$0.023/GB/month, assume 1 month storage

        const totalCost = gpuCost + storageCost;

        return {
          primary: { label: "Estimated Training Cost", value: `$${formatNumber(totalCost, 2)}` },
          details: [
            { label: "Model Type", value: modelType },
            { label: "Dataset size", value: formatNumber(datasetSize) },
            { label: "Epochs", value: formatNumber(epochs) },
            { label: "Estimated GPU hours", value: formatNumber(totalGpuHours, 1) },
            { label: "GPU cost", value: `$${formatNumber(gpuCost, 2)}` },
            { label: "Storage cost", value: `$${formatNumber(storageCost, 2)}` },
            { label: "Cost per example", value: `$${formatNumber(totalCost / datasetSize, 6)}` },
          ],
          note: "Estimates based on typical hardware (A100). Actual costs vary with model architecture, learning rate, and hardware selection.",
        };
      },
    },
    {
      id: "full",
      name: "Full Training Project",
      description: "Estimate cost for complete training project",
      fields: [
        {
          name: "trainingHours",
          label: "Estimated GPU Training Hours",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "hours",
        },
        {
          name: "gpuModel",
          label: "GPU Type",
          type: "select",
          options: [
            { label: "RTX 4090", value: "rtx4090" },
            { label: "A100", value: "a100" },
            { label: "H100", value: "h100" },
          ],
          defaultValue: "a100",
        },
        {
          name: "datasetSizeGb",
          label: "Total Dataset Size (GB)",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "GB",
        },
        {
          name: "iterations",
          label: "Training Iterations/Runs",
          type: "number",
          placeholder: "e.g. 1",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const trainingHours = parseFloat(inputs.trainingHours as string) || 100;
        const gpuModel = inputs.gpuModel as string;
        const datasetSize = parseFloat(inputs.datasetSizeGb as string) || 100;
        const iterations = parseFloat(inputs.iterations as string) || 1;

        const gpuPricing = {
          rtx4090: 0.5,
          a100: 1.6,
          h100: 3.5,
        };

        const hourlyRate = gpuPricing[gpuModel as keyof typeof gpuPricing] || 1.6;
        const gpuCost = trainingHours * hourlyRate * iterations;

        // Storage: training + output models
        const storageCostMonthly = datasetSize * 0.023;
        const storageCostTotal = storageCostMonthly * 0.5; // Assume half month storage

        // Data pipeline/processing
        const dataProcessingCost = (datasetSize / 100) * 10; // Rough estimate

        const totalCost = gpuCost + storageCostTotal + dataProcessingCost;

        return {
          primary: { label: "Total Project Cost", value: `$${formatNumber(totalCost, 2)}` },
          details: [
            { label: "GPU Model", value: gpuModel.toUpperCase() },
            { label: "GPU hours per run", value: formatNumber(trainingHours) },
            { label: "Number of iterations", value: formatNumber(iterations) },
            { label: "Total GPU hours", value: formatNumber(trainingHours * iterations) },
            { label: "GPU hourly rate", value: `$${hourlyRate}` },
            { label: "GPU cost", value: `$${formatNumber(gpuCost, 2)}` },
            { label: "Storage cost", value: `$${formatNumber(storageCostTotal, 2)}` },
            { label: "Data processing cost", value: `$${formatNumber(dataProcessingCost, 2)}` },
          ],
          note: "Costs include GPU rental, data storage, and processing. Does not include labor, monitoring, or potential re-runs.",
        };
      },
    },
  ],
  relatedSlugs: ["gpu-rental-cost-calculator", "ai-startup-compute-budget"],
  faq: [
    {
      question: "How long does fine-tuning typically take?",
      answer:
        "Small models (7B): 30min-2 hours. Medium models (13-70B): 2-8 hours. Large models (70B+): 8-48 hours. Depends on dataset size and hardware. Use smaller datasets (1k-10k examples) for faster iteration.",
    },
    {
      question: "Can I reduce training costs?",
      answer:
        "Yes: use smaller models, reduce dataset size, decrease training epochs, use lower precision (8-bit), employ model compression techniques, or use spot instances for 70% discount (if interruption is acceptable).",
    },
    {
      question: "What's included in training cost estimates?",
      answer:
        "GPU compute time is the main cost. Also include storage (datasets + checkpoints + outputs), data preparation labor, monitoring/logging infrastructure, and potential failed runs.",
    },
  ],
  formula: "Total Cost = (GPU Hours × Hourly Rate) + Storage Cost + Data Processing Cost",
};
