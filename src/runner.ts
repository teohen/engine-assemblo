import type { State } from "./types";
import { createState, isRegister } from "./types";
import { parseLine } from "./parser";
import { halt } from "./errors";
import { instructionHandlers } from "./instructions/index";
import { printState } from "./io";

export function run(program: string): State {
  const state = createState();
  state.status = "running";

  const lines = program.split("\n");

  for (const rawLine of lines) {
    const parsed = parseLine(rawLine);
    if (parsed === null) {
      continue;
    }

    const { opcode, dest, src } = parsed;

    const handler = instructionHandlers[opcode];
    if (!handler) {
      printState(halt(state, `unknown instruction: ${opcode}`));
      return state;
    }

    if (dest === undefined || src === undefined) {
      printState(halt(state, `missing operand for ${opcode}`));
      return state;
    }

    if (!isRegister(dest)) {
      printState(halt(state, `invalid register: ${dest}`));
      return state;
    }

    let srcVal: number;
    if (isRegister(src)) {
      srcVal = state.registers[src as keyof typeof state.registers];
    } else {
      const num = Number(src);
      if (isNaN(num)) {
        printState(halt(state, `invalid value: ${src}`));
        return state;
      }
      srcVal = num;
    }

    handler(state, dest, srcVal);
    printState(state);
  }

  state.status = "finished";
  printState(state);
  return state;
}
