import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ragSystemMonthlyCost: CalculatorDefinition = {
  slug: "rag-system-monthly-cost",
  title: "RAG System Monthly Cost Calculator",
  description:
    "Calculate total cost of running Retrieval-Augmented Generation system. Include vector database, embeddings, LLM API, and storage costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "RAG cost calculator",
    "vector database cost",
    "embedding cost",
    "semantic search cost",
    "RAG infrastructure cost",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate RAG Costs",
      description: "Estimate monthly RAG system expenses",
      fields: [
        {
          name: "queriesPerMonth",
          label: "User Queries Per Month",
          type: "number",
          placeholder: "e.g. 100000",
          suffix: "queries",
        },
        {
          name: "documentCount",
          label: "Total Documents in Knowledge Base",
          type: "number",
          placeholder: "e.g. 10000",
          suffix: "documents",
        },
        {
          name: "vectorDb",
          label: "Vector Database",
          type: "select",
          options: [
            { label: "Pinecone (Managed)", value: "pinecone" },
            { label: "Weaviate (Self-hosted)", value: "weaviate" },
            { label: "Milvus (Self-hosted)", value: "milvus" },
            { label: "Chroma (Self-hosted)", value: "chroma" },
          ],
          defaultValue: "pinecone",
        },
      ],
      calculate: (inputs) => {
        const queriesPerMonth = parseFloat(inputs.queriesPerMonth as string) || 100000;
        const documentCount = parseFloat(inputs.documentCount as string) || 10000;
        const vectorDb = inputs.vectorDb as string;

        // Vector DB costs
        let vdbCost = 0;
        let vdbName = "";
        if (vectorDb === "pinecone") {
          const units = Math.ceil(documentCount / 100000);
          vdbCost = 70 * units; // $70/pod minimum
          vdbName = "Pinecone";
        } else if (vectorDb === "weaviate") {
          vdbCost = 0; // Self-hosted, only GPU costs
          vdbName = "Weaviate";
        } else if (vectorDb === "milvus") {
          vdbCost = 0;
          vdbName = "Milvus";
        } else {
          vdbCost = 0;
          vdbName = "Chroma";
        }

        // Embedding costs (OpenAI embedding-3 small: ~$0.02 per M tokens)
        // Assume ~100 tokens per document at ingestion, then per-query embedding
        const ingestEmbeddings = documentCount * 100;
        const queryEmbeddings = queriesPerMonth * 50; // ~50 tokens per query
        const totalEmbeddings = ingestEmbeddings + (queryEmbeddings * 12 / 12); // Monthly cost
        const embeddingCost = (totalEmbeddings / 1000000) * 0.02;

        // LLM costs (answer generation from retrieved context)
        // Assume each query generates 200 tokens output
        const totalLlmTokens = queriesPerMonth * (100 + 200); // context + output
        const llmCost = (totalLlmTokens / 1000000) * 0.004; // ~$0.004 per M tokens mixed rate

        // Storage costs
        const storageGb = documentCount * 0.1; // ~0.1MB per document average
        const storageCost = storageGb * 0.023;

        const totalCost = vdbCost + embeddingCost + llmCost + storageCost;

        return {
          primary: { label: "Monthly RAG Cost", value: `$${formatNumber(totalCost, 2)}` },
          details: [
            { label: "Vector DB (" + vdbName + ")", value: `$${formatNumber(vdbCost, 2)}` },
            { label: "Embedding API", value: `$${formatNumber(embeddingCost, 2)}` },
            { label: "LLM API (answers)", value: `$${formatNumber(llmCost, 2)}` },
            { label: "Storage", value: `$${formatNumber(storageCost, 2)}` },
            { label: "Cost per query", value: `$${formatNumber(totalCost / queriesPerMonth, 4)}` },
            { label: "Annual projection", value: `$${formatNumber(totalCost * 12, 2)}` },
          ],
          note: "Costs exclude hosting/compute (if self-hosted). Assumes retrieval + LLM generation workflow.",
        };
      },
    },
    {
      id: "compare",
      name: "Compare Architectures",
      description: "Compare managed vs self-hosted RAG costs",
      fields: [
        {
          name: "queriesPerMonth",
          label: "Monthly Queries",
          type: "number",
          placeholder: "e.g. 50000",
          suffix: "queries",
        },
        {
          name: "documentCount",
          label: "Documents",
          type: "number",
          placeholder: "e.g. 5000",
          suffix: "documents",
        },
      ],
      calculate: (inputs) => {
        const queriesPerMonth = parseFloat(inputs.queriesPerMonth as string) || 50000;
        const documentCount = parseFloat(inputs.documentCount as string) || 5000;

        // Managed approach (Pinecone + OpenAI)
        const managedVdb = 70; // Minimum pod
        const managedEmbedding = (documentCount * 100 + queriesPerMonth * 50) / 1000000 * 0.02;
        const managedLlm = (queriesPerMonth * 300) / 1000000 * 0.004;
        const managedTotal = managedVdb + managedEmbedding + managedLlm;

        // Self-hosted approach (Milvus + GPU + local embeddings)
        const gpuCostSelfHosted = 1.6 * 200; // ~200 GPU hours/month
        const selfHostedEmbedding = (queriesPerMonth * 50) / 1000000 * 0.0005; // Much cheaper with local
        const selfHostedLlm = 0; // If using local LLM (but needs GPU hours above)
        const selfHostedTotal = gpuCostSelfHosted + selfHostedEmbedding;

        // Hybrid approach
        const hybridVdb = 35; // Smaller Pinecone
        const hybridEmbedding = managedEmbedding * 0.5; // Some local caching
        const hybridLlm = managedLlm * 0.7; // Some batching
        const hybridTotal = hybridVdb + hybridEmbedding + hybridLlm;

        return {
          primary: {
            label: "Recommended",
            value: managedTotal < selfHostedTotal ? "Managed" : "Self-hosted"
          },
          details: [
            { label: "Managed (Pinecone + OpenAI)", value: `$${formatNumber(managedTotal, 2)}/mo` },
            { label: "Self-hosted (GPU + local)", value: `$${formatNumber(selfHostedTotal, 2)}/mo` },
            { label: "Hybrid approach", value: `$${formatNumber(hybridTotal, 2)}/mo` },
          ],
          note: "Managed scales easily, self-hosted needs operational overhead. Hybrid balances cost and control.",
        };
      },
    },
  ],
  relatedSlugs: ["llm-api-cost-calculator", "ai-token-counter"],
  faq: [
    {
      question: "What's the main cost driver in RAG systems?",
      answer:
        "Vector database (if managed like Pinecone) is often the largest fixed cost. LLM API calls scale with query volume. Embeddings are relatively cheap. For high volume (1M+ queries/mo), self-hosting becomes cheaper.",
    },
    {
      question: "How can I reduce RAG costs?",
      answer:
        "Cache embeddings/results. Use cheaper embedding models. Batch API calls. Implement pagination/filtering before LLM. Self-host if volume justifies it. Use smaller, cheaper LLMs for retrieval scoring.",
    },
    {
      question: "What about indexing and updates?",
      answer:
        "One-time indexing cost is minimal. Regular updates can be batched monthly. Re-embedding documents is main cost if data changes frequently. Plan update frequency carefully.",
    },
  ],
  formula: "Total Cost = Vector DB + Embedding API + LLM API + Storage Costs",
};
