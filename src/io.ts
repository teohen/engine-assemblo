import type { State } from "./types";

export function printState(state: State): void {
  console.log(`registers: ${JSON.stringify(state.registers)}`);
  console.log(`memory: [${state.memory.join(", ")}]`);
  console.log(`status: ${state.status}`);
  console.log(`messages: [${state.messages.join(", ")}]`);
}
