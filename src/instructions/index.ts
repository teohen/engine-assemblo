import type { InstructionHandler } from "../types";
import { mov } from "./mov";
import { add } from "./add";
import { sub } from "./sub";

export const instructionHandlers: Record<string, InstructionHandler> = {
  mov,
  add,
  sub,
};
