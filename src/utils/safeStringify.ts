export default function safeStringify(value: any, space = 2): string {
  const seen = new WeakSet();
  return JSON.stringify(
    value,
    function (_key, val) {
      if (val && typeof val === "object") {
        if (seen.has(val)) return "[Circular]";
        seen.add(val);
      }
      if (typeof val === "bigint") return val.toString();
      return val;
    },
    space
  );
}
