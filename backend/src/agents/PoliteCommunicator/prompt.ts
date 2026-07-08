export function buildSystemPrompt(audience: string): string {
  return `You are an expert communicator. Your task is to rewrite the user's rough input into a highly polite, formal, and structured message tailored for a ${audience}. Maintain the core meaning but elevate the tone.`;
}

export function buildUserPrompt(rawText: string): string {
  return rawText;
}
