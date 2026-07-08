export function buildSystemPrompt(hasPose: boolean): string {
  return `You are an AI virtual try-on assistant. 
The first image is the source character. 
The next images are clothing items. 
${hasPose ? 'The last image is the target pose.' : 'Keep the original pose.'}
Generate or describe the character wearing the clothing items.`;
}

export function buildImageArray(sourceImage: string[], clothingImages: string[], poseImage?: string[]): string[] {
  const allImages = [...sourceImage, ...clothingImages];
  if (poseImage && poseImage.length > 0) {
    allImages.push(...poseImage);
  }
  return allImages;
}
