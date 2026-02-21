export function formatNumber(n: number, decimals = 2): string {
  if (Number.isInteger(n) && Math.abs(n) < 1e15) {
    return n.toLocaleString("en-US");
  }
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function parseNumericInput(value: string): number {
  const cleaned = value.replace(/[^0-9.\-]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
