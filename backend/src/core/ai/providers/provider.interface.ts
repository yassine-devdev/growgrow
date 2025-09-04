export interface IAIProvider {
    generateStream(prompt: string): Promise<ReadableStream<string>>;
}
