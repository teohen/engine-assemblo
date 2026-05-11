export interface State {
  registers: { r0: number; r1: number; r2: number; r3: number };
  memory: number[];
  status: "idle" | "running" | "finished" | "errored";
  messages: string[];
}

export function createState(): State {
  return {
    registers: { r0: 0, r1: 0, r2: 0, r3: 0 },
    memory: Array(64).fill(0),
    status: "idle",
    messages: [],
  };
}

export const validRegisters = new Set(["r0", "r1", "r2", "r3"]);

export function isRegister(s: string): boolean {
  return validRegisters.has(s);
}

export interface ParsedLine {
  opcode: string;
  dest: string | undefined;
  src: string | undefined;
}

export type InstructionHandler = (state: State, dest: string, srcVal: number) => void;
