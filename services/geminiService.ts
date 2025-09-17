
import { GoogleGenAI, Modality, Type, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
// FIX: Removed deprecated model creation. Model will be specified in each generateContent call.

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const parseApiResponse = (response: GenerateContentResponse): { text?: string; imageUrl?: string } => {
    let text, imageUrl;
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned from API.");
    }

    for (const part of response.candidates[0].content.parts) {
        if (part.text) {
            text = part.text;
        } else if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    return { text, imageUrl };
};

export const generateHeroPortrait = async (prompt: string, image: File) => {
    const imagePart = await fileToGenerativePart(image);
    // FIX: Use ai.models.generateContent and specify model directly.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                imagePart,
                { text: `Transform this person into a fantasy TTRPG character. Style: digital painting, fantasy art. Description: ${prompt}` },
            ],
        },
        config: {
            // FIX: responseModalities for gemini-2.5-flash-image-preview must include both IMAGE and TEXT.
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    const { imageUrl } = parseApiResponse(response);
    if (!imageUrl) throw new Error("API did not return an image.");
    return { imageUrl };
};

export const generateWorldview = async (prompt: string, baseCharacter?: { imageUrl: string }) => {
    const parts: any[] = [{ text: `Generate a rich, atmospheric TTRPG scene description for: "${prompt}". Then, create a cinematic, digital painting illustration of that scene.` }];
    
    if (baseCharacter) {
        const base64Data = baseCharacter.imageUrl.split(',')[1];
        parts.unshift({
            inlineData: {
                data: base64Data,
                mimeType: 'image/png' // Assuming PNG
            }
        });
        parts[1].text = `Generate a rich, atmospheric TTRPG scene description for: "${prompt}". Then, create a cinematic, digital painting illustration of that scene, featuring the character from the provided image.`
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts },
        config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
    });
    return parseApiResponse(response);
};

const generateStructuredAsset = async (concept: string, type: 'NPC' | 'Monster' | 'Item', baseCharacter?: { imageUrl: string }) => {
    let schema;
    let promptText;

    switch (type) {
        case 'NPC':
            schema = {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    dialogue: { type: Type.STRING, description: "A sample line of dialogue." },
                },
                required: ['name', 'description', 'dialogue']
            };
            promptText = `Generate a TTRPG Non-Player Character based on the concept: "${concept}". Provide a JSON object with a name, detailed description, and a sample line of dialogue.`;
            break;
        case 'Monster':
            schema = {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    abilities: { type: Type.STRING, description: "A summary of its key abilities." },
                },
                required: ['name', 'description', 'abilities']
            };
            promptText = `Generate a TTRPG monster based on the concept: "${concept}". Provide a JSON object with a name, detailed description, and a summary of its abilities.`;
            break;
        case 'Item':
            schema = {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    properties: { type: Type.STRING, description: "Magical properties or effects." },
                },
                required: ['name', 'description', 'properties']
            };
            promptText = `Generate a TTRPG magical item based on the concept: "${concept}". Provide a JSON object with a name, detailed description, and its magical properties.`;
            break;
    }
    
    // Step 1: Generate structured text (JSON)
    const textResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    const textData = textResponse.text;
    const jsonData = JSON.parse(textData.trim());
    const imagePrompt = jsonData.description || `An illustration of ${jsonData.name}`;

    // Step 2: Generate image based on description
    const imageParts: any[] = [{ text: `Create a fantasy art illustration for the following: ${imagePrompt}` }];

    if (baseCharacter && (type === 'Monster' || type === 'NPC' || type === 'Item')) {
        const base64Data = baseCharacter.imageUrl.split(',')[1];
        imageParts.unshift({
            inlineData: {
                data: base64Data,
                mimeType: 'image/png' // Assuming PNG
            }
        });

        let interactionPrompt = '';
        switch (type) {
            case 'Monster':
                interactionPrompt = `Incorporate the character from this image into a scene with the following monster: ${imagePrompt}. The character should be interacting with the monster.`;
                break;
            case 'NPC':
                interactionPrompt = `Incorporate the character from this image into a scene with the following NPC: ${imagePrompt}. The character should be interacting with the NPC.`;
                break;
            case 'Item':
                interactionPrompt = `Depict the character from this image holding, wearing, or using the following item: ${imagePrompt}.`;
                break;
        }
        imageParts[1].text = `${interactionPrompt} Style: cinematic, detailed, digital painting, cohesive.`
    }
    
    const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: imageParts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        }
    });

    const { imageUrl } = parseApiResponse(imageResponse);

    if (!imageUrl) throw new Error("API did not return an image.");
    
    return { jsonData, imageUrl };
};

export const generateNPC = (prompt: string, baseCharacter?: { imageUrl: string }) => generateStructuredAsset(prompt, 'NPC', baseCharacter);
export const generateMonster = (prompt: string, baseCharacter?: { imageUrl: string }) => generateStructuredAsset(prompt, 'Monster', baseCharacter);
export const generateArmouryItem = (prompt: string, baseCharacter?: { imageUrl: string }) => generateStructuredAsset(prompt, 'Item', baseCharacter);

export const generateCanvasScene = async (prompt: string, baseCharacter?: { imageUrl: string }) => {
    const parts: any[] = [{ text: `Create a complete TTRPG scene illustration based on this description: ${prompt}. Style: cinematic, detailed, digital painting.` }];
    
    if (baseCharacter) {
        const base64Data = baseCharacter.imageUrl.split(',')[1];
        parts.unshift({
            inlineData: {
                data: base64Data,
                mimeType: 'image/png' // Assuming PNG, might need to be more robust
            }
        });
        parts[1].text = `Incorporate the character from this image into the following scene: ${prompt}. Style: cinematic, detailed, digital painting, cohesive.`
    }
    
    // FIX: Use ai.models.generateContent and specify model directly.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts },
        config: {
            // FIX: responseModalities for gemini-2.5-flash-image-preview must include both IMAGE and TEXT.
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    const { imageUrl } = parseApiResponse(response);
    if (!imageUrl) throw new Error("API did not return an image.");
    return { imageUrl };
};
