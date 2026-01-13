
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCampaignAdvice = async (campaignData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `As an expert AI Media Consultant for AdFlow (a premium advertising sales platform), analyze the following campaign proposal and provide strategic optimization advice.
      
      Campaign Details:
      - Name: ${campaignData.name}
      - Advertiser: ${campaignData.advertiser}
      - Budget: $${campaignData.budget}
      - Duration: From ${campaignData.startDate} to ${campaignData.endDate}
      - Selected Channels: ${campaignData.channels.join(', ')}

      Provide 3-4 professional, actionable tips focusing on:
      1. Inventory efficiency and budget allocation.
      2. Channel synergy (how the selected channels work together).
      3. Expected performance benchmarks.
      4. A specific recommendation for increasing reach.

      Also provide an estimated percentage for potential reach improvement if these tips are followed.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Strategic advice points"
            },
            estimatedReachBoost: { 
              type: Type.STRING,
              description: "Estimated reach improvement (e.g., '+15%')"
            }
          },
          required: ["advice", "estimatedReachBoost"]
        }
      }
    });

    const text = response.text;
    return JSON.parse(text || "{}");
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return { 
      advice: ["Identify high-performing inventory segments early.", "Optimize budget across digital channels for better ROI.", "Monitor frequency to prevent ad fatigue."], 
      estimatedReachBoost: "+12%" 
    };
  }
};

export const chatWithPlanner = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are the AdFlow Alliance AI Assistant. You help media sales teams optimize bookings, manage inventory across TV and Digital, and explain invoicing processes. Be professional, data-driven, and concise."
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
