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

function printState(state: State): void {
  console.log(`registers: ${JSON.stringify(state.registers)}`);
  console.log(`memory: [${state.memory.join(", ")}]`);
  console.log(`status: ${state.status}`);
  console.log(`messages: [${state.messages.join(", ")}]`);
}

const validOpcodes = new Set(["mov", "add", "sub"]);
const validRegisters = new Set(["r0", "r1", "r2", "r3"]);

function isRegister(s: string): boolean {
  return validRegisters.has(s);
}

export function run(program: string): State {
  const state = createState();
  state.status = "running";

  const lines = program.split("\n");

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (trimmed === "" || trimmed.startsWith("#") || trimmed.startsWith(";")) {
      continue;
    }

    const parts = trimmed.replace(/,/g, " ").split(/\s+/).filter(Boolean);
    const opcode = parts[0];

    if (!validOpcodes.has(opcode)) {
      const msg = `unknown instruction: ${opcode}`;
      console.log(msg);
      state.messages.push(msg);
      state.status = "errored";
      printState(state);
      return state;
    }

    if (parts.length < 3) {
      const msg = `missing operand for ${opcode}`;
      console.log(msg);
      state.messages.push(msg);
      state.status = "errored";
      printState(state);
      return state;
    }

    const dest = parts[1]!;
    if (!isRegister(dest)) {
      const msg = `invalid register: ${dest}`;
      console.log(msg);
      state.messages.push(msg);
      state.status = "errored";
      printState(state);
      return state;
    }

    const src = parts[2]!;

    let srcVal: number;
    if (isRegister(src)) {
      srcVal = state.registers[src as keyof typeof state.registers];
    } else {
      const num = Number(src);
      if (isNaN(num)) {
        const msg = `invalid value: ${src}`;
        console.log(msg);
        state.messages.push(msg);
        state.status = "errored";
        printState(state);
        return state;
      }
      srcVal = num;
    }

    if (opcode === "mov") {
      state.registers[dest as keyof typeof state.registers] = srcVal;
    } else if (opcode === "add") {
      state.registers[dest as keyof typeof state.registers] += srcVal;
    } else if (opcode === "sub") {
      state.registers[dest as keyof typeof state.registers] -= srcVal;
    }

    printState(state);
  }

  state.status = "finished";
  printState(state);
  return state;
}

if (import.meta.main) {
  const program = "mov r0, 42";
  run(program);
}
