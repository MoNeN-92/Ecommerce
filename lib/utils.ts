import { clsx, type ClassValue } from "clsx";
import { randomBytes } from "crypto";
import { twMerge } from "tailwind-merge";
import { SITE_URL } from "@/lib/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string, locale = "ka-GE", currency = "GEL") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(Number(value));
}

export function getLocaleCurrency(locale: string) {
  return locale === "ka" ? "ka-GE" : "en-US";
}

export function slugify(value: string) {
  const georgianMap: Record<string, string> = {
    ა: "a",
    ბ: "b",
    გ: "g",
    დ: "d",
    ე: "e",
    ვ: "v",
    ზ: "z",
    თ: "t",
    ი: "i",
    კ: "k",
    ლ: "l",
    მ: "m",
    ნ: "n",
    ო: "o",
    პ: "p",
    ჟ: "zh",
    რ: "r",
    ს: "s",
    ტ: "t",
    უ: "u",
    ფ: "f",
    ქ: "q",
    ღ: "gh",
    ყ: "y",
    შ: "sh",
    ჩ: "ch",
    ც: "ts",
    ძ: "dz",
    წ: "w",
    ჭ: "ch",
    ხ: "kh",
    ჯ: "j",
    ჰ: "h"
  };

  return value
    .replace(/[აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ]/g, (char) => georgianMap[char] ?? char)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function generateSku(brand: string, name: string) {
  const brandTokens = slugify(brand)
    .split("-")
    .filter(Boolean);
  const nameTokens = slugify(name)
    .split("-")
    .filter(Boolean);

  const brandCode = brandTokens.length
    ? brandTokens
        .slice(0, 2)
        .map((token) => token.slice(0, 3).toUpperCase())
        .join("")
    : "";

  const nameCode = nameTokens
    .slice(0, 4)
    .map((token) => token.slice(0, token.length > 4 ? 4 : token.length).toUpperCase())
    .join("-");

  return [brandCode, nameCode].filter(Boolean).join("-");
}

export function generateOrderNumber() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TG-${stamp}-${random}`;
}

export function generateConfirmationToken() {
  return randomBytes(24).toString("hex");
}

export function buildAbsoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
