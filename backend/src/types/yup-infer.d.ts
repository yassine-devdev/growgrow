declare module "yup" {
  // Minimal shim for backend TypeScript when types are not installed.
  // Provides InferType as any to keep backend compilation happy.
  export type InferType<T> = any;
  const yup: any;
  export default yup;
}
