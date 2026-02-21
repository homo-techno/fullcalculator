import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const businessLicenseCalculator: CalculatorDefinition = {
  slug: "business-license-calculator",
  title: "Business License Fee Calculator",
  description: "Free business license fee calculator. Estimate the costs of business licenses, permits, and registrations needed to start a business by type and location.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["business license calculator", "business license cost", "business permit fees", "business registration cost", "how much is a business license"],
  variants: [
    {
      id: "business-license",
      name: "Business License Fee Estimator",
      description: "Estimate total licensing and permit costs for starting a business",
      fields: [
        { name: "businessType", label: "Business Type", type: "select", options: [
          { label: "General retail / Online store", value: "retail" },
          { label: "Restaurant / Food service", value: "restaurant" },
          { label: "Professional services (consulting, etc.)", value: "professional" },
          { label: "Construction / Contractor", value: "construction" },
          { label: "Healthcare / Medical", value: "healthcare" },
          { label: "Home-based business", value: "home" },
          { label: "Transportation / Trucking", value: "transport" },
          { label: "Salon / Beauty services", value: "salon" },
        ], defaultValue: "retail" },
        { name: "location", label: "Location Cost Level", type: "select", options: [
          { label: "Low-cost area (small town, rural)", value: "low" },
          { label: "Average (mid-size city)", value: "average" },
          { label: "High-cost area (large metro)", value: "high" },
          { label: "Very high-cost (NYC, SF, LA)", value: "very-high" },
        ], defaultValue: "average" },
        { name: "revenue", label: "Expected Annual Revenue", type: "select", options: [
          { label: "Under $50,000", value: "under-50k" },
          { label: "$50,000 - $100,000", value: "50k-100k" },
          { label: "$100,000 - $500,000", value: "100k-500k" },
          { label: "$500,000 - $1,000,000", value: "500k-1m" },
          { label: "Over $1,000,000", value: "over-1m" },
        ], defaultValue: "50k-100k" },
        { name: "employees", label: "Number of Employees", type: "select", options: [
          { label: "0 (solo)", value: "0" },
          { label: "1-5", value: "3" },
          { label: "6-20", value: "13" },
          { label: "21-50", value: "35" },
          { label: "50+", value: "75" },
        ], defaultValue: "0" },
      ],
      calculate: (inputs) => {
        const businessType = inputs.businessType as string;
        const location = inputs.location as string;
        const revenue = inputs.revenue as string;
        const employees = parseInt(inputs.employees as string) || 0;

        // Base licensing fees by business type
        const baseFees: Record<string, { license: number; permits: number; inspections: number; label: string }> = {
          retail: { license: 75, permits: 100, inspections: 0, label: "Retail / Online Store" },
          restaurant: { license: 200, permits: 500, inspections: 300, label: "Restaurant / Food Service" },
          professional: { license: 100, permits: 50, inspections: 0, label: "Professional Services" },
          construction: { license: 300, permits: 250, inspections: 200, label: "Construction / Contractor" },
          healthcare: { license: 500, permits: 400, inspections: 350, label: "Healthcare / Medical" },
          home: { license: 50, permits: 25, inspections: 0, label: "Home-based Business" },
          transport: { license: 400, permits: 300, inspections: 150, label: "Transportation / Trucking" },
          salon: { license: 150, permits: 100, inspections: 50, label: "Salon / Beauty Services" },
        };

        const base = baseFees[businessType] || baseFees.retail;

        // Location multiplier
        const locationFactors: Record<string, number> = {
          low: 0.6, average: 1.0, high: 1.5, "very-high": 2.5,
        };
        const locationFactor = locationFactors[location] || 1.0;

        // Revenue-based fees (some cities charge based on revenue)
        const revenueCharges: Record<string, number> = {
          "under-50k": 0, "50k-100k": 50, "100k-500k": 150, "500k-1m": 400, "over-1m": 800,
        };
        const revenueFee = revenueCharges[revenue] || 0;

        // Employer-related costs
        const employerFees = employees > 0 ? 100 + employees * 15 : 0; // EIN, state employer registration, etc.

        // DBA / Fictitious name fee
        const dbaFee = 25;

        // State registration
        const stateRegistration = 50;

        const licenseFee = base.license * locationFactor;
        const permitFee = base.permits * locationFactor;
        const inspectionFee = base.inspections * locationFactor;

        const firstYearTotal = licenseFee + permitFee + inspectionFee + revenueFee + employerFees + dbaFee + stateRegistration;
        const annualRenewal = licenseFee + revenueFee;

        return {
          primary: { label: "Estimated First-Year Total", value: `$${formatNumber(firstYearTotal)}` },
          details: [
            { label: "Business type", value: base.label },
            { label: "Business license", value: `$${formatNumber(licenseFee)}` },
            { label: "Permits & special licenses", value: `$${formatNumber(permitFee)}` },
            { label: "Inspections", value: inspectionFee > 0 ? `$${formatNumber(inspectionFee)}` : "None required" },
            { label: "Revenue-based fee", value: `$${formatNumber(revenueFee)}` },
            { label: "Employer-related fees", value: employerFees > 0 ? `$${formatNumber(employerFees)}` : "N/A (no employees)" },
            { label: "DBA / State registration", value: `$${formatNumber(dbaFee + stateRegistration)}` },
            { label: "Est. annual renewal", value: `$${formatNumber(annualRenewal)}` },
          ],
          note: "Business licensing requirements and fees vary greatly by city, county, and state. Some businesses need additional professional licenses, health permits, zoning approvals, or industry-specific certifications. Contact your local city clerk or SBA office for specific requirements.",
        };
      },
    },
  ],
  relatedSlugs: ["llc-cost-calculator", "trademark-cost-calculator", "patent-cost-calculator"],
  faq: [
    { question: "How much does a business license cost?", answer: "Business license fees typically range from $50 to $500+ depending on your location, business type, and city/county requirements. Home-based businesses often pay $50-$100, while restaurants and healthcare businesses may pay $500-$1,500+ due to additional permits, health department inspections, and specialized licenses." },
    { question: "What licenses do I need to start a business?", answer: "At minimum, most businesses need: a general business license from the city/county, a state business registration, and a DBA (fictitious business name) filing. Additional requirements may include sales tax permits, professional licenses, health permits, building permits, signage permits, and federal licenses depending on your industry." },
    { question: "Do I need a business license for an online business?", answer: "Yes, in most cases. Even online businesses typically need a general business license from their city or county, a state business registration, and a sales tax permit if selling taxable goods. The requirements apply based on where your business is located, not just where your customers are." },
  ],
  formula: "First-Year Cost = Business License + Permits + Inspections + Revenue Fee + Employer Fees + DBA + State Registration. Fees scaled by location cost factor.",
};
