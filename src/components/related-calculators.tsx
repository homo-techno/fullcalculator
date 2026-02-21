import { CalculatorCard } from "./calculator-card";
import type { CalculatorDefinition } from "@/calculators/types";

export function RelatedCalculators({
  calculators,
}: {
  calculators: CalculatorDefinition[];
}) {
  if (calculators.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        You may also need
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {calculators.map((calc) => (
          <CalculatorCard key={calc.slug} calc={calc} />
        ))}
      </div>
    </section>
  );
}
