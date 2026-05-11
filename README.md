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

## Example

```
mov r0, 10
mov r1, 20
```

## Usage

```bash
bun run src/index.ts
```

Edit the program string in the source file to change what runs. No setup, no install steps beyond the runtime.
