declare module "@google/genai" {
  export class GoogleGenAI {
    constructor(opts: any);
    // minimal typing for compile-time only
    embeddings: any;
    models: any;
  }
  export const Type: any;
}
