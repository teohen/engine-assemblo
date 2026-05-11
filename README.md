# assemblo

A fake assembly language interpreter for learning how low-level programming works.

## About

Assemblo is a teaching tool. It simulates a minimal CPU in software so you can experiment with assembly-like instructions without needing real hardware or a full toolchain. Write instructions, run them, and see register and memory state printed after each step.

## Machine Specs

| Feature       | Value              |
|---------------|--------------------|
| Registers     | 4 (r0, r1, r2, r3) |
| Memory slots  | 64 (addresses 0–63) |
| Value range   | 0–125 per slot      |
| Execution     | Sequential, one instruction per line |

## Instructions

| Opcode | Operands           | Description                      |
|--------|--------------------|----------------------------------|
| `mov`  | `rd, literal`      | Load numeric literal into register |
| `mov`  | `rd, rs`           | Copy value from register to register |
| `add`  | `rd, literal`      | Add literal to register           |
| `add`  | `rd, rs`           | Add register value to register    |
| `sub`  | `rd, literal`      | Subtract literal from register    |
| `sub`  | `rd, rs`           | Subtract register value from register |

## Example

```
mov r0, 10
mov r1, 20
add r0, r1
sub r0, 5
```

## Usage

```bash
bun run src/cli.ts
```

Edit the program string in `src/cli.ts` to change what runs. No setup, no install steps beyond the runtime.

```bash
bun test        # run tests
bun run lint    # lint source
```

## Project Structure

```
src/
  types.ts         Domain types (State, ParsedLine, InstructionHandler)
                   and utilities (createState, isRegister, validRegisters)

  parser.ts        Pure function: line of text to structured representation.
                   Knows nothing about State or execution.

  errors.ts        Single halt() function. Centralizes the error flow
                   (push message, set status to errored). No I/O.

  io.ts            All console.log calls. printState() isolates I/O
                   from business logic.

  instructions/    One file per opcode, each as an isolated handler
    mov.ts         mov rd, src
    add.ts         add rd, src
    sub.ts         sub rd, src
    index.ts       Registry mapping opcode strings to handlers.
                   Add a new instruction here without touching runner code.

  runner.ts        run(program) orchestrator. Parses, validates,
                   dispatches to handlers, prints state.

  cli.ts           CLI entry point (import.meta.main). Edit the program
                   string here.

  index.ts         Public API re-exports. Tests import { run } from this.
```
