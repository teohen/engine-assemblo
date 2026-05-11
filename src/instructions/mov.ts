import type { RegisterKey, State } from "../types";

export function mov(state: State, dest: RegisterKey, srcVal: number): void {
  state.registers[dest] = srcVal;
}
