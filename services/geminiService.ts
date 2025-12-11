import { GoogleGenAI, Type } from "@google/genai";
import { RoastResponse } from '../types';

/**
 * Initializes the GoogleGenAI client with the API key from environment variables.
 * CRITICAL: The API key must be obtained exclusively from process.env.API_KEY.
 * Do not generate UI elements for entering or managing the API key.
 */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Sends a code snippet to the Gemini API for a "roast" and correction.
 * The model acts as a grumpy, sarcastic senior software engineer.
 * It's instructed to provide a 2-3 sentence roast and then the corrected code.
 *
 * @param code The code snippet to be roasted.
 * @returns A promise that resolves to a RoastResponse object containing the roast and fixed code.
 * @throws Error if the API call fails or the response cannot be parsed.
 */
export async function roastCode(code: string): Promise<RoastResponse> {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API key is not configured. Please set process.env.API_KEY.");
  }

  const prompt = `You are a grumpy, sarcastic senior software engineer who hates bad code. Your job is to brutally roast the provided code snippet in 2-3 funny sentences. Then, provide the corrected, clean version of the code.

Here is the code to roast:
\`\`\`
${code}
\`\`\`
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Using a capable model for code analysis and reasoning
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are a grumpy, sarcastic senior software engineer who hates bad code. Your job is to brutally roast the provided code snippet in 2-3 funny sentences. Then, provide the corrected, clean version of the code, enclosed in a markdown code block. Make sure to present the roast and the fixed code as separate properties in a JSON object.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roast: {
              type: Type.STRING,
              description: "The sarcastic and brutal roast of the code snippet in 2-3 sentences.",
            },
            fixedCode: {
              type: Type.STRING,
              description: "The corrected and clean version of the code snippet, formatted as a markdown code block.",
            },
          },
          required: ["roast", "fixedCode"],
          propertyOrdering: ["roast", "fixedCode"],
        },
      },
    });

    const jsonString = response.text.trim();
    const parsedResponse: RoastResponse = JSON.parse(jsonString);

    // Basic validation to ensure the expected structure
    if (!parsedResponse.roast || !parsedResponse.fixedCode) {
      throw new Error("Invalid response format from API: Missing 'roast' or 'fixedCode'.");
    }

    return parsedResponse;

  } catch (error) {
    console.error("Error roasting code:", error);
    throw new Error(`Failed to roast code: ${error instanceof Error ? error.message : String(error)}`);
  }
}
