export const parse = <T,>(s: string | null | undefined, fallback: T): T => {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
};

export type NewsBlock = { t: "p" | "h" | "img"; text?: string; src?: string };
