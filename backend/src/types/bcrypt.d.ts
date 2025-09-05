/**
 * Type declarations for the 'bcrypt' library.
 * This provides TypeScript with the necessary type information for functions
 * like `hashSync` and `compare`, which are used for password management.
 */
declare module "bcrypt" {
  /**
   * Synchronously generates a hash for the given string.
   * @param s Data to be encrypted.
   * @param salt A salt to be used in hashing.
   * @returns The hashed string.
   */
  export function hashSync(s: string, salt: number | string): string;

  /**
   * Compares a string against a hash.
   * @param s Data to be compared.
   * @param hash Data to be compared against.
   * @returns A promise that resolves to true if the data and hash match, false otherwise.
   */
  export function compare(s: string, hash: string): Promise<boolean>;
}
