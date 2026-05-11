import type { ParsedLine } from "./types";

export function parseLine(rawLine: string): ParsedLine | null {
  const trimmed = rawLine.trim();
  if (trimmed === "" || trimmed.startsWith("#") || trimmed.startsWith(";")) {
    return null;
  }

  const parts = trimmed.replace(/,/g, " ").split(/\s+/).filter(Boolean);

  return {
    opcode: parts[0] ?? "",
    dest: parts[1],
    src: parts[2],
  };
}
