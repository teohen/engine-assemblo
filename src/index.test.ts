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

describe("add instruction", () => {
  test("add with register source", () => {
    const result = run("mov r0, 10\nmov r1, 20\nadd r0, r1");
    expect(result.registers.r0).toBe(30);
    expect(result.registers.r1).toBe(20);
    expect(result.status).toBe("finished");
  });

  test("add where target is also source", () => {
    const result = run("mov r0, 5\nadd r0, r0");
    expect(result.registers.r0).toBe(10);
    expect(result.status).toBe("finished");
  });

  test("add with all registers at zero", () => {
    const result = run("add r0, r1");
    expect(result.registers.r0).toBe(0);
    expect(result.status).toBe("finished");
  });

  test("add with literal source", () => {
    const result = run("mov r0, 7\nadd r0, 3");
    expect(result.registers.r0).toBe(10);
    expect(result.status).toBe("finished");
  });

  test("add invalid target register halts with error", () => {
    const result = run("add r5, r0");
    expect(result.status).toBe("errored");
  });

  test("add with literal target halts with error", () => {
    const result = run("add 5, r0");
    expect(result.status).toBe("errored");
  });

  test("add invalid source register halts with error", () => {
    const result = run("add r0, r5");
    expect(result.status).toBe("errored");
  });

  test("add missing operand halts with error", () => {
    const result = run("add r0");
    expect(result.status).toBe("errored");
  });

  test("add non-numeric literal halts with error", () => {
    const result = run("add r0, abc");
    expect(result.status).toBe("errored");
  });
});

describe("sub instruction", () => {
  test("sub with literal source", () => {
    const result = run("mov r0, 100\nsub r0, 30");
    expect(result.registers.r0).toBe(70);
    expect(result.status).toBe("finished");
  });

  test("sub with register source", () => {
    const result = run("mov r0, 10\nmov r1, 3\nsub r0, r1");
    expect(result.registers.r0).toBe(7);
    expect(result.status).toBe("finished");
  });

  test("sub produces negative result", () => {
    const result = run("mov r0, 7\nsub r0, 10");
    expect(result.registers.r0).toBe(-3);
    expect(result.status).toBe("finished");
  });

  test("sub zero minus register", () => {
    const result = run("mov r1, 5\nsub r0, r1");
    expect(result.registers.r0).toBe(-5);
    expect(result.status).toBe("finished");
  });

  test("sub invalid target register halts with error", () => {
    const result = run("sub r5, r0");
    expect(result.status).toBe("errored");
  });

  test("sub with literal target halts with error", () => {
    const result = run("sub 5, r0");
    expect(result.status).toBe("errored");
  });

  test("sub invalid source register halts with error", () => {
    const result = run("sub r0, r5");
    expect(result.status).toBe("errored");
  });

  test("sub missing operand halts with error", () => {
    const result = run("sub r0");
    expect(result.status).toBe("errored");
  });

  test("sub non-numeric literal halts with error", () => {
    const result = run("sub r0, abc");
    expect(result.status).toBe("errored");
  });
});
