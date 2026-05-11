import { run } from "./runner";

if (import.meta.main) {
  const program = "mov r0, 42";
  run(program);
}
