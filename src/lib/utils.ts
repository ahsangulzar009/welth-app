export function formatPrice(
  value: number,
  currency: string
): string {
  const locale = currency === 'PKR' ? "en-PK" : undefined
  const amount = Number(value)
  const hasDecimals = !Number.isInteger(amount)

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(value)
}