import type { State } from "./types";
import { createState, isRegister } from "./types";
import { parseLine } from "./parser";
import { halt } from "./errors";
import { instructionHandlers } from "./instructions/index";

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
      return halt(state, `unknown instruction: ${opcode}`);
    }

    if (dest === undefined || src === undefined) {
      return halt(state, `missing operand for ${opcode}`);
    }

    if (!isRegister(dest)) {
      return halt(state, `invalid register: ${dest}`);
    }

    let srcVal: number;
    if (isRegister(src)) {
      srcVal = state.registers[src];
    } else {
      const num = Number(src);
      if (isNaN(num)) {
        return halt(state, `invalid value: ${src}`);
      }
      srcVal = num;
    }

    handler(state, dest, srcVal);
  }

  state.status = "finished";
  return state;
}
