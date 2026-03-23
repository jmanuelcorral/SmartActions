import { randomUUID } from "crypto";

/**
 * Sanitizes user input by escaping HTML special characters.
 * Prevents Cross-Site Scripting (XSS) attacks.
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Generates a unique request identifier (UUID v4).
 */
export function generateId(): string {
  return randomUUID();
}

/**
 * Formats a Date object into an ISO 8601 string.
 */
export function formatTimestamp(date: Date): string {
  return date.toISOString();
}

/**
 * Validates that a value is a positive integer.
 * Useful for sanitizing route parameters before database queries.
 */
export function isPositiveInteger(value: string): boolean {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
}

/**
 * Truncates a string to a maximum length, appending an ellipsis if truncated.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}
