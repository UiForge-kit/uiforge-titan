// deliberately loose: the real validation is the confirmation e-mail
export function isEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

// https only: a signed secret must not travel in clear
export function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.includes(".") && value.length <= 300;
  } catch {
    return false;
  }
}
