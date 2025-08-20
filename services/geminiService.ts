import { GoogleGenAI, Type } from "@google/genai";
import { DescriptionFormData, DescriptionLength, MarketingAssetsData, FAQItem, CompetitorAnalysis, VideoScript, AudioAd } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function buildBasePrompt(formData: DescriptionFormData): string {
    const lengthInstruction = {
      [DescriptionLength.Short]: 'around 50 words, in a single paragraph',
      [DescriptionLength.Medium]: 'around 150 words, with a title, introduction, and a few bullet points',
      [DescriptionLength.Long]: 'over 250 words, very detailed, with a title, introduction, multiple sections with subheadings, and bullet points',
    };

    return `
      You are an expert e-commerce copywriter specializing in creating compelling, SEO-friendly product descriptions that convert.
      Your output language MUST be ${formData.language}. The entire response must be in that language.

      Generate ${formData.variations} unique product descriptions based on the following details.
      - Product Name: ${formData.productName}
      - Key Features & Keywords: ${formData.keywords}
      - Target Audience: ${formData.audience}
      - Tone of Voice: ${formData.tone}
      - Desired Length: ${lengthInstruction[formData.length]}

      Instructions:
      1. Each description must be engaging and highlight the product's key benefits.
      2. Naturally integrate the provided keywords for SEO.
      3. Tailor the language and style to the specified target audience and tone.
      4. For medium and long descriptions, structure them with a catchy title, introduction, and bullet points.
      5. Do not include placeholders like "[Your Brand Name]".
    `;
}

export async function generateContent(formData: DescriptionFormData): Promise<{descriptions: string[], analysis?: CompetitorAnalysis}> {
  let textPrompt: string;
  let responseSchema: any;

  if (formData.mode === 'analyze') {
      textPrompt = `
        You are a world-class marketing strategist and copywriter.
        Your task is to analyze a competitor's product description and then write a new set of SUPERIOR descriptions.
        Your output language MUST be ${formData.language}.

        **Step 1: Analyze the Competitor's Description**
        Analyze the following text for its strengths, weaknesses, and strategic opportunities for improvement.
        
        Competitor's Description:
        ---
        ${formData.competitorDescription}
        ---

        **Step 2: Write Superior Descriptions**
        Now, using your analysis, write ${formData.variations} new, much better product descriptions for our product.
        Use the following details to guide your writing:
        - Product Name: ${formData.productName}
        - Key Features & Keywords: ${formData.keywords}
        - Target Audience: ${formData.audience}
        - Tone of Voice: ${formData.tone}
        - Desired Length: Same as the competitor's, or as specified if available.
      `;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          analysis: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["strengths", "weaknesses", "opportunities"]
          },
          descriptions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["analysis", "descriptions"]
      };
  } else {
      textPrompt = buildBasePrompt(formData);
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          descriptions: {
            type: Type.ARRAY,
            items: { type: Type.STRING, description: "A complete and well-written product description in the requested language." }
          }
        },
        required: ["descriptions"]
      };
  }
  
  try {
    const textResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: textPrompt,
        config: { responseMimeType: "application/json", responseSchema }
    });
    
    const jsonString = textResponse.text.trim();
    const result = JSON.parse(jsonString);

    if (result && Array.isArray(result.descriptions)) {
      return { descriptions: result.descriptions, analysis: result.analysis };
    } else {
      throw new Error("Invalid response format from API for descriptions.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate content from Gemini API.");
  }
}

export async function generateMarketingAssets(description: string, keywords: string, language: string): Promise<MarketingAssetsData> {
    const prompt = `
        As an expert digital marketer, analyze the following product description and generate a full suite of marketing assets in ${language}.

        Product Description:
        ---
        ${description}
        ---
        Keywords: ${keywords}

        Your task is to generate:
        1.  **SEO Title:** A concise, keyword-rich title under 60 characters.
        2.  **SEO Meta Description:** A compelling summary under 160 characters, with a call-to-action.
        3.  **Social Media Posts:**
            *   Facebook: An engaging post with emojis and a question to drive comments.
            *   Instagram: A visually-focused caption, suggesting an image type, and including relevant hashtags.
            *   Twitter (X): A short, punchy tweet under 280 characters with a strong hook and key hashtags.
        4.  **Ad Copy:**
            *   Google Ads: 3 distinct headlines (max 30 chars each) and 2 descriptions (max 90 chars each).
            *   Facebook Ads: 1 primary text (engaging, longer form) and 1 headline (short, punchy).

        The entire output must be in ${language}.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        seoTitle: { type: Type.STRING },
                        seoMetaDescription: { type: Type.STRING },
                        socialPosts: {
                            type: Type.OBJECT,
                            properties: {
                                facebook: { type: Type.STRING },
                                instagram: { type: Type.STRING },
                                twitter: { type: Type.STRING }
                            },
                            required: ["facebook", "instagram", "twitter"]
                        },
                        adCopy: {
                            type: Type.OBJECT,
                            properties: {
                                google: {
                                    type: Type.OBJECT,
                                    properties: {
                                        headlines: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        descriptions: { type: Type.ARRAY, items: { type: Type.STRING } }
                                    },
                                    required: ["headlines", "descriptions"]
                                },
                                facebook: {
                                    type: Type.OBJECT,
                                    properties: {
                                        primaryText: { type: Type.STRING },
                                        headline: { type: Type.STRING }
                                    },
                                    required: ["primaryText", "headline"]
                                }
                            },
                            required: ["google", "facebook"]
                        }
                    },
                    required: ["seoTitle", "seoMetaDescription", "socialPosts", "adCopy"]
                }
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error generating marketing assets:", error);
        throw new Error("Failed to generate marketing assets.");
    }
}

export async function generateFAQs(description: string, language: string): Promise<FAQItem[]> {
    const prompt = `
        Based on the following product description, generate a list of 5 frequently asked questions (FAQs) that a potential customer might have.
        Provide a clear and concise answer for each question.
        The entire output (questions and answers) must be in ${language}.

        Product Description:
        ---
        ${description}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        faqs: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    answer: { type: Type.STRING }
                                },
                                required: ["question", "answer"]
                            }
                        }
                    },
                    required: ["faqs"]
                }
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result.faqs;

    } catch (error) {
        console.error("Error generating FAQs:", error);
        throw new Error("Failed to generate FAQs.");
    }
}

export async function generateVideoScript(description: string, language: string): Promise<VideoScript> {
    const prompt = `
    You are an expert video scriptwriter for social media ads. Create a short, punchy video script based on the provided product description.
    The script should be for a video of approximately 30 seconds.
    The output must be in ${language}.

    Product Description:
    ---
    ${description}
    ---

    Create a storyboard-style script with distinct scenes. Each scene needs a "visual" description and the corresponding "narration" text.
    The tone should be engaging and direct.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        targetDuration: { type: Type.STRING },
                        scenes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    visual: { type: Type.STRING, description: "A description of the visuals for this scene." },
                                    narration: { type: Type.STRING, description: "The voiceover text for this scene." }
                                },
                                required: ["visual", "narration"]
                            }
                        }
                    },
                    required: ["title", "targetDuration", "scenes"]
                }
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating video script:", error);
        throw new Error("Failed to generate video script.");
    }
}


export async function generateAudioAd(description: string, language: string): Promise<AudioAd> {
    const prompt = `
    You are a professional audio ad producer. Create a script for a short audio ad (e.g., for a podcast or streaming service) based on the provided product description.
    The target duration is 15-20 seconds.
    The entire output must be in ${language}.

    Product Description:
    ---
    ${description}
    ---

    The script must include:
    1.  A strong "hook" to grab attention in the first 3 seconds.
    2.  The main "body" of the ad, highlighting key benefits.
    3.  A clear "callToAction".
    4.  Suggestions for "sfxSuggestions" (sound effects) to make the ad more immersive.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        targetDuration: { type: Type.STRING },
                        hook: { type: Type.STRING },
                        body: { type: Type.STRING },
                        callToAction: { type: Type.STRING },
                        sfxSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["title", "targetDuration", "hook", "body", "callToAction", "sfxSuggestions"]
                }
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating audio ad:", error);
        throw new Error("Failed to generate audio ad.");
    }
}