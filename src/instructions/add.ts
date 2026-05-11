import type { RegisterKey, State } from "../types";

export function add(state: State, dest: RegisterKey, srcVal: number): void {
  state.registers[dest] += srcVal;
}
