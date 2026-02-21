import { calculators } from "@/calculators";
import { CATEGORIES } from "@/calculators/types";
import { CalculatorCard } from "@/components/calculator-card";

export default function HomePage() {
  return (
    <>
      <section className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Free Online Calculators
        </h1>
        <p className="mt-3 text-gray-600 max-w-xl mx-auto">
          Fast, accurate calculators for math, finance, health, and everyday
          life. No signup required.
        </p>
      </section>

      {CATEGORIES.map((cat) => {
        const catCalcs = calculators.filter(
          (c) => c.categorySlug === cat.slug
        );
        if (catCalcs.length === 0) return null;
        return (
          <section key={cat.slug} id={cat.slug} className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm">
                {cat.icon}
              </span>
              {cat.name} Calculators
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catCalcs.map((calc) => (
                <CalculatorCard key={calc.slug} calc={calc} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
