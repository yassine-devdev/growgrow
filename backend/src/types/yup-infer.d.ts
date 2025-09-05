declare module "yup" {
  // Minimal, type-safe shim for `yup.InferType` used in the backend.
  // This maps a schema-like object into a conservative TypeScript type.
  export type InferType<T> = T extends { _type: infer U } ? U : unknown;
  // Provide a conservative `yup` default export signature used by the project.
  export function object<Shape extends Record<string, any>>(
    shape: Shape
  ): { _type: { [K in keyof Shape]: unknown } };
  const yup: {
    object: typeof object;
  };
  export default yup;
}
