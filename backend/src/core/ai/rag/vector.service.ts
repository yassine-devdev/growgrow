export interface Vector {
    content: string;
    embedding: number[];
}

class VectorService {
    private store: Vector[] = [];

    // Cosine similarity function
    private cosineSimilarity(vecA: number[], vecB: number[]): number {
        const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
        const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
        if (magnitudeA === 0 || magnitudeB === 0) {
            return 0;
        }
        return dotProduct / (magnitudeA * magnitudeB);
    }

    public addVectors(vectors: Vector[]): void {
        this.store.push(...vectors);
    }

    public count(): number {
        return this.store.length;
    }

    public async similaritySearch(queryEmbedding: number[], topK: number): Promise<Vector[]> {
        if (this.store.length === 0) return [];

        const similarities = this.store.map(vector => ({
            vector,
            similarity: this.cosineSimilarity(queryEmbedding, vector.embedding),
        }));

        similarities.sort((a, b) => b.similarity - a.similarity);

        return similarities.slice(0, topK).map(s => s.vector);
    }
}

// Singleton instance for in-memory storage
export const vectorService = new VectorService();