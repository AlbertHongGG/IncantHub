export interface KoreanIDPhotoPayload {
  systemPrompt: string;
  allImages: string[];
}

export function buildKoreanIDPhotoPayload(
  sourceImage: string[],
  targetCharacterDescription?: string,
  stylePrompt?: string
): KoreanIDPhotoPayload {
  const allImages: string[] = [...sourceImage];
  
  const systemPrompt = `
# ROLE
You are an expert Portrait Photographer and AI Image Retoucher specializing in premium "Korean style" ID and passport photography. Your task is to transform the provided reference photo into a stunning, highly professional Korean-style ID photo.

# TASK DESCRIPTION
The user has provided a reference image (Image [0]). You must analyze this image and generate exactly ONE single portrait photo adhering to the strict guidelines below.

# LIGHTING & STYLE CONSTRAINTS
1. **Korean Photography Style**: Emulate the classic Korean ID photo aesthetic: professional bright studio light and evenly distributed soft lighting.
2. **Retouching**: Smooth out any facial imperfections (blemishes, uneven skin tones) while keeping the skin texture looking natural.
3. **Background**: Ensure a plain, seamless pure white or very light gray background.
4. **Composition**: The person MUST be facing straight forward, centered in the frame, with a neutral but pleasant expression (a very slight, professional hint of a smile is acceptable, but mostly neutral for official documents).

# IDENTITY RETENTION CONSTRAINTS
1. **Absolute Likeness (CRITICAL)**: The generated person MUST BE THE EXACT SAME PERSON as the reference image. You must use the reference image as an absolute structural blueprint for the face.
2. **Facial Features**: You MUST 100% preserve the exact eye shape, double/single eyelids, nose structure, mouth width, lips, jawline, face ratio, and all unique facial characteristics of the reference. Do NOT generate a "generic handsome/beautiful" face. Do NOT alter the person's identity or ethnicity.
3. **Flawless Retouching vs Identity**: You may smooth the skin texture and remove acne/blemishes, but you MUST NOT change the underlying bone structure or facial geometry.
# TARGET CHARACTER SELECTION
${targetCharacterDescription 
  ? `The reference image may contain multiple people. You MUST strictly extract the character matching this description: "${targetCharacterDescription}". Ignore all other characters in the image.` 
  : `Extract the primary character from the reference image.`}

# WARDROBE & MODIFICATION CONSTRAINTS
${stylePrompt 
  ? `The user has requested specific modifications: "${stylePrompt}". You MUST apply these styling choices (e.g., clothing, hairstyle, removing glasses, expression) to the generated photo. Ensure the overall style still aligns with a professional ID photo.` 
  : `Default Styling: Dress the person in a neat white shirt as formal attire. Apply minimal, professional makeup (if applicable) and remove distracting accessories. You MUST maintain the exact same hairstyle as the original photo, but ensure it looks neatly groomed and tidy.`}

# OUTPUT FORMAT
DO NOT generate any text, labels, or watermarks. The output MUST ONLY be the portrait image.
`.trim();

  return { systemPrompt, allImages };
}
