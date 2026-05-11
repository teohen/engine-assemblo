import type { State } from "../types";

export function sub(state: State, dest: string, srcVal: number): void {
  state.registers[dest as keyof typeof state.registers] -= srcVal;
}
