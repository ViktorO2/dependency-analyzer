import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey=process.env.GEMINI_API_KEY;

if(!apiKey) throw new Error("Missing GEMINI_API_KEY in .env ");

const ai=new GoogleGenAI({
    apiKey
});


export const analyzeDependenciesWithLLM = async (summary: any) => {
    try {

        const prompt=`
        You are a TypeScript architecture expert.
Here is a JSON summary of module dependencies.

Task:
1. Detect circular dependencies.
2. Identify tightly coupled modules.
3. Estimate complexity (Low/Medium/High).
4. Suggest 2–3 refactoring recommendations.

Return your answer as a structured JSON with keys:
{
  "complexity": "...",
  "issues": [...],
  "recommendations": [...]
}

Dependency summary:
${JSON.stringify(summary,null,2)}`;

const response= await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
});
const text=response.text;
if(!text) return{error: "No text in response"};

const cleanText = text.replace(/```json|```/g, "").trim();
try{
    return JSON.parse(cleanText);
}catch{
    return { rawText:cleanText};
}
}catch(err){
console.error(" LLM error:", err);
return {error:"Gemini request failed"};
    }
};