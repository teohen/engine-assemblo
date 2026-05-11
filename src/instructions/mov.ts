import type { State } from "../types";

export function mov(state: State, dest: string, srcVal: number): void {
  state.registers[dest as keyof typeof state.registers] = srcVal;
}
