const ghs = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  currencyDisplay: "code",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats a number as "GHS 1,250.00" consistently on server and client. */
export function formatGHS(amount: number): string {
  // Normalise the non-breaking space some runtimes insert after the code
  return ghs.format(amount).replace(/ /g, " ");
}
