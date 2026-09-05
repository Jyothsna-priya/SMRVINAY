import type { Quote, QuoteInput } from "./types";

/** Format a number using the Indian numbering system, e.g. 12888000 -> "1,28,88,000". */
export function formatINR(n: number): string {
  const rounded = Math.round(n || 0);
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    rounded,
  );
}

/** Format as "Rs.1,28,88,000/-" to match the estimate letter. */
export function rupees(n: number): string {
  return `Rs.${formatINR(n)}/-`;
}

/** Flat cost rate (Rs./Sft) is fixed per tower, not freely editable. */
export const BASIC_RATE_BY_TOWER: Record<string, number> = {
  LOGAN: 9999,
  HAMILTON: 10499,
};

export function basicRateForTower(tower: string): number {
  return BASIC_RATE_BY_TOWER[(tower || "").toUpperCase()] ?? 0;
}

/** The agreement amount is always 20% of the flat cost (registration charges excluded). */
export const AGREEMENT_PERCENT = 20;

/** Booking amount is a fixed figure for every quote, not user-editable. */
export const BOOKING_AMOUNT = 1000000;

/** Corpus Fund is a fixed Rs./Sft rate applied to the flat's extent. */
export const CORPUS_FUND_RATE_PER_SFT = 60;

/** Advance Maintenance is a fixed Rs./Sft/month rate, collected 2 years (24 months) in advance. */
export const MAINT_RATE_PER_SFT = 4;
export const MAINT_MONTHS = 24;

export interface ComputedQuote {
  basicCost: number;
  discountAmount: number;
  flatCost: number;

  corpusFund: number;
  maintCharges: number;
  registrationCharges: { label: string; amount: number }[];
  registrationTotal: number;

  agreementAmount: number; // 20% of flat cost, minus booking amount
  grandTotal: number; // flat cost + registration charges
}

export function computeQuote(q: Quote | QuoteInput): ComputedQuote {
  const extent = Number(q.extentSft) || 0;

  const basicCost = (Number(q.basicRate) || 0) * extent;
  const discountAmount = (Number(q.discountPerSft) || 0) * extent;
  const flatCost = basicCost - discountAmount;

  const corpusFund = CORPUS_FUND_RATE_PER_SFT * extent;
  const maintCharges = MAINT_RATE_PER_SFT * extent * MAINT_MONTHS;

  const registrationCharges = [
    { label: `Corpus Fund (@Rs.${CORPUS_FUND_RATE_PER_SFT}/- per Sft)`, amount: corpusFund },
    {
      label: `${MAINT_MONTHS / 12} Yrs. Adv. Maintenance Charges (@Rs.${MAINT_RATE_PER_SFT}/- per Sft per Month)`,
      amount: maintCharges,
    },
  ].filter((r) => r.amount > 0);

  const registrationTotal = registrationCharges.reduce(
    (s, r) => s + r.amount,
    0,
  );

  const agreementAmount = (AGREEMENT_PERCENT / 100) * flatCost - BOOKING_AMOUNT;

  return {
    basicCost,
    discountAmount,
    flatCost,
    corpusFund,
    maintCharges,
    registrationCharges,
    registrationTotal,
    agreementAmount,
    grandTotal: flatCost + registrationTotal,
  };
}

/** dd.mm.yyyy to match the letter (e.g. 13.07.2026). */
export function formatDateDots(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

/** Friendly date e.g. 13 Jul 2026 for list/UI. */
export function formatDateNice(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
