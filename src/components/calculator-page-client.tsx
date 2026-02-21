"use client";

import { getCalculatorBySlug, getRelatedCalculators } from "@/calculators";
import { CalculatorForm } from "./calculator-form";
import { RelatedCalculators } from "./related-calculators";

export function CalculatorPageClient({ slug }: { slug: string }) {
  const calc = getCalculatorBySlug(slug);
  if (!calc) return null;

  const related = getRelatedCalculators(calc);

  return (
    <>
      <div className="space-y-6">
        {calc.variants.map((variant) => (
          <CalculatorForm
            key={variant.id}
            variant={variant}
            calculatorSlug={calc.slug}
          />
        ))}
      </div>

      {calc.formula && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Formula</h2>
          <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm text-gray-800">
            {calc.formula}
          </div>
        </section>
      )}

      {calc.faq.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {calc.faq.map((f, i) => (
              <details
                key={i}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden group"
                open={i === 0}
              >
                <summary className="px-5 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  {f.question}
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                  {f.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      <RelatedCalculators calculators={related} />
    </>
  );
}
