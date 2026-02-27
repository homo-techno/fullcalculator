import Link from "next/link";
import type { CalculatorDefinition } from "@/calculators/types";

export function CalculatorCard({ calc }: { calc: CalculatorDefinition }) {
  return (
    <Link
      href={`/${calc.categorySlug}/${calc.slug}`}
      className="group block p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-bold text-lg shrink-0">
          {calc.icon}
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {calc.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {calc.description}
          </p>
          <span className="inline-block mt-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {calc.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
