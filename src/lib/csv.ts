function escapeField(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Build a CSV string from rows. `headers` is the ordered list of column keys.
 * Prepends a UTF-8 BOM so Excel renders Hebrew correctly.
 */
export function toCsv(
  rows: Record<string, unknown>[],
  headers: { key: string; label: string }[]
): string {
  const head = headers.map((h) => escapeField(h.label)).join(",");
  const body = rows
    .map((row) => headers.map((h) => escapeField(row[h.key])).join(","))
    .join("\r\n");
  return "﻿" + head + "\r\n" + body;
}
