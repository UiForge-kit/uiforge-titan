const NUMBER = new Intl.NumberFormat("fr-FR");

export function formatNumber(value: number): string {
  return NUMBER.format(value);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  const units = ["Ko", "Mo", "Go", "To"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1).replace(".", ",")} ${units[unit]}`;
}

export function formatDelta(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1).replace(".", ",")} %`;
}

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const EUR = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const EUR_PRECISE = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const COMPACT = new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 });

export const formatCurrency = (value: number) => EUR.format(value);
export const formatCurrencyPrecise = (value: number) => EUR_PRECISE.format(value);
export const formatCompact = (value: number) => COMPACT.format(value);
export const formatPercent = (value: number, digits = 1) => `${value.toFixed(digits).replace(".", ",")} %`;
