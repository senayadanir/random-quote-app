import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export interface ClsxRecord {
  [key: string]: boolean | undefined | null;
}

export interface ClsxArray extends Array<ClsxValue> {}

export type ClsxValue = string | number | boolean | null | undefined | ClsxArray | ClsxRecord;

export function cn(...inputs: ClsxValue[]): string {
  return twMerge(clsx(inputs));
}
