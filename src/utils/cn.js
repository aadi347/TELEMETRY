import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines clsx and tailwind-merge for conditional class merging.
 * Usage: cn("base-class", conditional && "extra-class", className)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
