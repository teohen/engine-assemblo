import { describe, test, expect } from "bun:test";
import { run } from "./index";

describe("mov instruction", () => {
  test("literal to register", () => {
    const result = run("mov r0, 42");
    expect(result.registers.r0).toBe(42);
    expect(result.registers.r1).toBe(0);
    expect(result.registers.r2).toBe(0);
    expect(result.registers.r3).toBe(0);
    expect(result.status).toBe("finished");
    expect(result.messages).toEqual([]);
  });

  test("register to register copy", () => {
    const result = run("mov r0, 5\nmov r1, r0");
    expect(result.registers.r0).toBe(5);
    expect(result.registers.r1).toBe(5);
    expect(result.status).toBe("finished");
  });

  test("multiple literals in sequence", () => {
    const result = run("mov r1, 10\nmov r2, 20");
    expect(result.registers.r1).toBe(10);
    expect(result.registers.r2).toBe(20);
    expect(result.status).toBe("finished");
  });

  test("unknown opcode halts with error", () => {
    const result = run("xyz r0, 1");
    expect(result.status).toBe("errored");
    expect(result.messages).toEqual([]);
    expect(result.registers.r0).toBe(0);
  });

  test("missing operand halts with error", () => {
    const result = run("mov r0");
    expect(result.status).toBe("errored");
    expect(result.messages).toEqual([]);
  });

  test("invalid register halts with error", () => {
    const result = run("mov r5, 10");
    expect(result.status).toBe("errored");
    expect(result.messages).toEqual([]);
  });

  test("non-numeric literal halts with error", () => {
    const result = run("mov r0, abc");
    expect(result.status).toBe("errored");
    expect(result.messages).toEqual([]);
  });

  test("empty lines are skipped", () => {
    const result = run("\n\nmov r0, 7\n\n");
    expect(result.registers.r0).toBe(7);
    expect(result.status).toBe("finished");
  });

  test("comment lines are skipped", () => {
    const result = run("# comment\nmov r0, 3\n; another comment");
    expect(result.registers.r0).toBe(3);
    expect(result.status).toBe("finished");
  });
});
