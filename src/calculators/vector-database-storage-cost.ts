import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vectorDatabaseStorageCost: CalculatorDefinition = {
  slug: "vector-database-storage-cost",
  title: "Vector Database Storage Cost Comparison",
  description:
    "Compare costs of vector database services. Calculate pricing for Pinecone, Weaviate, Milvus, and other vector DB platforms based on storage size.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "vector database cost",
    "Pinecone pricing",
    "Weaviate cost",
    "vector storage",
    "embedding storage cost",
  ],
  variants: [
    {
      id: "compare",
      name: "Compare Services",
      description: "Compare vector database provider costs",
      fields: [
        {
          name: "vectorCount",
          label: "Number of Vectors",
          type: "number",
          placeholder: "e.g. 1000000",
          suffix: "vectors",
        },
        {
          name: "dimensionality",
          label: "Vector Dimensionality",
          type: "number",
          placeholder: "e.g. 1536",
          suffix: "dimensions",
        },
        {
          name: "monthlyQueries",
          label: "Monthly Queries",
          type: "number",
          placeholder: "e.g. 100000",
          suffix: "queries",
        },
      ],
      calculate: (inputs) => {
        const vectorCount = parseFloat(inputs.vectorCount as string) || 1000000;
        const dimensionality = parseFloat(inputs.dimensionality as string) || 1536;
        const monthlyQueries = parseFloat(inputs.monthlyQueries as string) || 100000;

        // Estimate storage: 4 bytes per dimension + metadata overhead (~30%)
        const storagePerVector = (dimensionality * 4) / (1024 * 1024); // MB
        const totalStorageGb = (vectorCount * storagePerVector) / 1024;

        // Vector database pricing (as of March 2026)
        const providers = [
          {
            name: "Pinecone (Starter)",
            baseCost: 0,
            storageCost: 0.0006 * totalStorageGb, // ~$0.0006 per GB
            queryCost: (monthlyQueries / 1000000) * 0.0005,
            notes: "Serverless, easiest setup"
          },
          {
            name: "Pinecone (Pod)",
            baseCost: 70, // p1 pod
            storageCost: 0,
            queryCost: 0,
            notes: "Fixed cost, better for large scale"
          },
          {
            name: "Weaviate Cloud",
            baseCost: 100,
            storageCost: (totalStorageGb / 100) * 10, // ~$10 per 100GB
            queryCost: 0,
            notes: "Open-source option available"
          },
          {
            name: "Milvus (Self-hosted)",
            baseCost: 500, // K8s infrastructure
            storageCost: (totalStorageGb * 0.023), // Cloud storage cost
            queryCost: 0,
            notes: "Lowest cost if self-hosting"
          },
          {
            name: "Elasticsearch Dense Vector",
            baseCost: 50,
            storageCost: (totalStorageGb * 0.5),
            queryCost: 0,
            notes: "Multi-purpose search engine"
          },
        ];

        let details: { label: string; value: string }[] = [];
        let cheapest = { name: "", cost: Infinity };

        providers.forEach((p) => {
          const monthlyCost = p.baseCost + p.storageCost + p.queryCost;
          const yearlyCost = monthlyCost * 12;
          const note = p.notes;

          details.push({
            label: `${p.name} (${note})`,
            value: `$${formatNumber(monthlyCost, 2)}/mo ($${formatNumber(yearlyCost, 0)}/yr)`
          });

          if (monthlyCost < cheapest.cost) {
            cheapest = { name: p.name, cost: monthlyCost };
          }
        });

        return {
          primary: {
            label: "Cheapest Option",
            value: `${cheapest.name} ($${formatNumber(cheapest.cost, 2)}/mo)`
          },
          details: [
            { label: "Estimated storage size", value: `${formatNumber(totalStorageGb, 1)} GB` },
            { label: "Vector dimensions", value: formatNumber(dimensionality) },
            { label: "Total vectors", value: formatNumber(vectorCount) },
            { label: "", value: "---" },
            ...details
          ],
          note: "Costs vary by region and tier. For >5M vectors, self-hosting typically cheaper. For RAG, pair with embedding cost from separate calculator.",
        };
      },
    },
    {
      id: "detail",
      name: "Detailed Cost Breakdown",
      description: "Deep dive into single provider costs",
      fields: [
        {
          name: "provider",
          label: "Vector Database",
          type: "select",
          options: [
            { label: "Pinecone Serverless", value: "pinecone_serverless" },
            { label: "Pinecone Pod", value: "pinecone_pod" },
            { label: "Weaviate Cloud", value: "weaviate" },
            { label: "Milvus Self-hosted", value: "milvus" },
          ],
          defaultValue: "pinecone_serverless",
        },
        {
          name: "vectorCount",
          label: "Number of Vectors",
          type: "number",
          placeholder: "e.g. 1000000",
          suffix: "vectors",
        },
        {
          name: "dimensionality",
          label: "Dimensionality",
          type: "number",
          placeholder: "e.g. 1536",
        },
      ],
      calculate: (inputs) => {
        const provider = inputs.provider as string;
        const vectorCount = parseFloat(inputs.vectorCount as string) || 1000000;
        const dimensionality = parseFloat(inputs.dimensionality as string) || 1536;

        const storagePerVector = (dimensionality * 4) / (1024 * 1024); // MB
        const totalStorageGb = (vectorCount * storagePerVector) / 1024;

        const configs: Record<string, any> = {
          pinecone_serverless: {
            name: "Pinecone Serverless",
            baseCost: 0,
            readUnits: (vectorCount / 1000000) * 0.10,
            writeUnits: vectorCount / 1000000 * 0.20,
            cost: ((vectorCount / 1000000) * 0.10) * 0.0005 + ((vectorCount / 1000000) * 0.20) * 0.0001
          },
          pinecone_pod: {
            name: "Pinecone Pod (p1)",
            baseCost: 70,
            cost: 70,
            storageCost: 0,
            notes: "Includes: 1GB storage, unlimited queries"
          },
          weaviate: {
            name: "Weaviate Cloud (Professional)",
            baseCost: 100,
            storageCost: (totalStorageGb / 100) * 10,
            cost: 100 + (totalStorageGb / 100) * 10
          },
          milvus: {
            name: "Milvus (Self-hosted on AWS)",
            baseCost: 500, // Infrastructure
            storageCost: totalStorageGb * 0.023,
            computeCost: 100, // Rough estimate
            cost: 500 + (totalStorageGb * 0.023) + 100
          }
        };

        const config = configs[provider] || configs.pinecone_serverless;
        const yearlyCost = config.cost * 12;

        return {
          primary: { label: "Monthly Cost", value: `$${formatNumber(config.cost, 2)}` },
          details: [
            { label: "Provider", value: config.name },
            { label: "Vectors stored", value: formatNumber(vectorCount) },
            { label: "Storage size", value: `${formatNumber(totalStorageGb, 1)} GB` },
            { label: "Base/fixed cost", value: `$${formatNumber(config.baseCost, 2)}` },
            { label: "Usage-based cost", value: `$${formatNumber(config.cost - config.baseCost, 2)}` },
            { label: "Monthly total", value: `$${formatNumber(config.cost, 2)}` },
            { label: "Annual projection", value: `$${formatNumber(yearlyCost, 2)}` },
          ],
          note: "Self-hosted requires DevOps effort but scales better long-term. Managed services are fastest to deploy.",
        };
      },
    },
  ],
  relatedSlugs: ["rag-system-monthly-cost", "ai-token-counter"],
  faq: [
    {
      question: "Which vector database is cheapest?",
      answer:
        "For <1M vectors: Milvus (self-hosted). For 1-10M: Pinecone Pod ($70-200/mo). For >10M: Milvus or self-hosted Weaviate. Managed services (Pinecone, Weaviate Cloud) charge premium for operational ease.",
    },
    {
      question: "How much storage does a vector take?",
      answer:
        "4 bytes per dimension minimum (float32) + metadata overhead. 1536-dim embedding ≈ 6-8KB stored. 1M vectors ≈ 6-8GB storage roughly.",
    },
    {
      question: "Should I self-host or use managed service?",
      answer:
        "Managed: <1M vectors or need global availability. Self-hosted: >5M vectors or cost-sensitive. Break-even: ~3-5M vectors depending on team capacity.",
    },
  ],
  formula: "Storage (GB) = (Vectors × Dimensionality × 4 bytes + Metadata) / (1024 × 1024 × 1024)",
};
