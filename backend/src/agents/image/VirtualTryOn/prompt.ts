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
1. **BACKGROUND PRESERVATION**: The background MUST remain exactly the same as the Source Character image (Image [${sourceIndex}]). Do not change the environment, lighting context, or add a studio backdrop.
2. **IDENTITY PRESERVATION**: The character's face, hair style, hair color, skin tone, and body proportions MUST remain 100% identical to the Source Character (Image [${sourceIndex}]). Do NOT blend facial features or hair with the pose reference.
3. **CLOTHING REPLACEMENT**: Replace the character's original clothing with the reference garments. The new clothing MUST accurately reflect the colors, textures, patterns, and styles of the reference images.
4. **POSE ADAPTATION**: ${poseIndex !== -1 ? `The character MUST strike the exact posture shown in the Target Pose (Image [${poseIndex}]). However, the background and identity must still strictly follow the Source Character.` : `Since no pose image was provided, you MUST keep the character in their exact original pose from the Source Character (Image [${sourceIndex}]).`}
5. **REALISM**: Ensure seamless blending, natural shadows, and realistic fabric physics (draping, wrinkles) based on the pose.
`.trim();

  return { systemPrompt, allImages };
}
