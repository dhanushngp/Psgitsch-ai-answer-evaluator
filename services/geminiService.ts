
import { GoogleGenAI, Type } from "@google/genai";
import { EvaluationResult } from '../types';

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                // Handle ArrayBuffer case if necessary, though for data URLs it's usually a string
                resolve('');
            }
        };
        reader.readAsDataURL(file);
    });
    const data = await base64EncodedDataPromise;
    return {
        inlineData: {
            data,
            mimeType: file.type,
        },
    };
};

export const evaluateHandwriting = async (file: File): Promise<EvaluationResult> => {
    // Lazy check for API key so the app doesn't crash on load
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("API Key is missing. Please configure VITE_GEMINI_API_KEY.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash';

    const filePart = await fileToGenerativePart(file);

    const prompt = "Analyze the provided document (JPEG, PNG, or PDF of handwritten notes). Identify all distinct question-and-answer pairs. For each answer, focus your evaluation primarily on its logical soundness and factual accuracy in relation to the question. Perform a light check for major grammatical errors, but do not heavily penalize for them. The specific format of the answer is not important. Assign a score from 0 to 10 for each answer based on this criteria, provide constructive feedback, and then calculate an overall average score. Return your entire analysis in the specified JSON format.";

    const schema = {
        type: Type.OBJECT,
        properties: {
            overallScore: {
                type: Type.NUMBER,
                description: "The average score of all evaluated answers, from 0 to 10. Should be calculated from the individual scores.",
            },
            generalFeedback: {
                type: Type.STRING,
                description: "A high-level summary of the overall performance, highlighting strengths and key areas for improvement.",
            },
            evaluations: {
                type: Type.ARRAY,
                description: "A list of all the identified question-and-answer pairs with their individual evaluation.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: {
                            type: Type.STRING,
                            description: "The exact question identified from the document.",
                        },
                        answer: {
                            type: Type.STRING,
                            description: "The corresponding answer to the question, as written in the document.",
                        },
                        feedback: {
                            type: Type.STRING,
                            description: "Detailed, constructive feedback on the answer's correctness, quality, and areas for improvement.",
                        },
                        score: {
                            type: Type.NUMBER,
                            description: "An integer score from 0 to 10 for this specific answer.",
                        },
                    },
                    required: ["question", "answer", "feedback", "score"],
                },
            },
        },
        required: ["overallScore", "generalFeedback", "evaluations"],
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    { text: prompt },
                    filePart,
                ],
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
                temperature: 0.2,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as EvaluationResult;

        // Basic validation
        if (!result || !result.evaluations || typeof result.overallScore !== 'number') {
            throw new Error("Invalid JSON structure received from API.");
        }

        return result;

    } catch (error) {
        console.error("Error evaluating handwriting:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to evaluate document. API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during AI evaluation.");
    }
};
