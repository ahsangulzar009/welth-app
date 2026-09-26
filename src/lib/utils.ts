import { format } from "date-fns";
import { Transaction } from "./api/transactions";
import { Directory, File, Paths } from "expo-file-system";
import * as Sharing from 'expo-sharing'

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

const EXPORT_WINDOW_DAYS = 30

function toCSVCell(value: string | null | number) {
  if (value === null) return ""
  const str = String(value)
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`

  return str
}

function buildCSV(transactions: Transaction[]) {
  const header = [
    "Date",
    "Type",
    "Category",
    "Description",
    "Amount",
    "Input Method"
  ];

  const rows = transactions.map((tx) => [
    format(new Date(tx.date), "dd-MM-yyyy"),
    tx.type,
    tx.category,
    tx.description ?? "",
    tx.amount,
    tx.input_method
  ])

  return [header, ...rows]
    .map((row) => row.map(toCSVCell).join(","))
    .join("\n")
}


export async function exportTransactionsToCSV(transactions: Transaction[]) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - EXPORT_WINDOW_DAYS);

  const recentTransactions = transactions.filter(
    (tx) => new Date(tx.date) >= cutoff
  )

  const csv = buildCSV(recentTransactions)
  const fileName = `transactions-${format(new Date(), "dd-MM-yyyy")}`
  const file = new File(new Directory(Paths.cache), fileName);
  if (file.exists) file.delete();
  file.create()
  file.write(csv)

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: "text/csv",
      dialogTitle: "Export transactions",
      UTI: "publick.comma-separated-values-text"
    })
  }

  return { count: recentTransactions.length, uri: file.uri }

}