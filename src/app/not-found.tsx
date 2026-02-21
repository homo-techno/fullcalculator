import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-6">
        Calculator not found. It might have been moved or doesn&apos;t exist yet.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Browse all calculators
      </Link>
    </div>
  );
}
