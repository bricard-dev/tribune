import { expect, test } from "vitest";

test("intentional failure to verify CI blocks merge", () => {
  expect(1 + 1).toBe(3);
});
