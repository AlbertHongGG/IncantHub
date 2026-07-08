export interface TryOnPromptPayload {
  systemPrompt: string;
  allImages: string[];
}

export function buildVirtualTryOnPayload(
  sourceImage: string[],
  clothingImages: string[],
  poseImage?: string[]
): TryOnPromptPayload {
  const allImages: string[] = [];
  
  let currentIndex = 0;
  
  const sourceIndex = currentIndex;
  allImages.push(...sourceImage);
  currentIndex += sourceImage.length;
  
  const clothingStartIndex = currentIndex;
  allImages.push(...clothingImages);
  currentIndex += clothingImages.length;
  const clothingEndIndex = currentIndex - 1;
  
  let poseIndex = -1;
  if (poseImage && poseImage.length > 0) {
    poseIndex = currentIndex;
    allImages.push(...poseImage);
  }

  const systemPrompt = `
# ROLE
You are an advanced AI Virtual Try-On Stylist and Image Generator. Your job is to seamlessly integrate clothing items onto a specific person based on the provided reference images.

# TASK DESCRIPTION
The user has provided an array of images. You must analyze the source character, the clothing items, and the target pose (if any), and generate a highly realistic and visually stunning image of the character wearing those exact clothes.

# IMAGE MAPPING
You MUST process the input image array strictly according to these indices:
- Image [${sourceIndex}]: **The Source Character** (The person who will be wearing the clothes).
- Image${clothingStartIndex === clothingEndIndex ? '' : 's'} [${clothingStartIndex}]${clothingStartIndex === clothingEndIndex ? '' : ` to [${clothingEndIndex}]`}: **The Clothing Items** (The garments to be worn).
${poseIndex !== -1 ? `- Image [${poseIndex}]: **The Target Pose** (The exact posture the character must assume).` : '- **The Target Pose**: None provided. You must keep the character in their original pose.'}

# CONSTRAINTS
- The character's face, identity, and body type MUST remain identical to Image [${sourceIndex}].
- The clothing items MUST accurately reflect the colors, textures, and styles of the reference garments.
- Ensure natural lighting, seamless blending, and realistic fabric physics (draping, shadows).
- Do not add any extra accessories or background elements unless specifically requested.
`.trim();

  return { systemPrompt, allImages };
}
