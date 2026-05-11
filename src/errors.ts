import type { State } from "./types";

export function halt(state: State, msg: string): State {
  state.messages.push(msg);
  state.status = "errored";
  return state;
}
