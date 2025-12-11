/**
 * Interface for the structured response expected from the Gemini API
 * after a code roasting request.
 */
export interface RoastResponse {
  roast: string;
  fixedCode: string;
}
