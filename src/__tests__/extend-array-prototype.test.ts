test("should extend Array's prototype after importing the module", () => {
  expect((Array.prototype as any).withFilter).not.toBeDefined();
  require("../extend-array-prototype");
  expect((Array.prototype as any).withFilter).toBeDefined();
});
