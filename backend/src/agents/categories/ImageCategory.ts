import { AgentCategory } from '../models/AgentCategory';

export class ImageCategory implements AgentCategory {
  public readonly id = 'image';
  public readonly name = 'Image Processing';
  public readonly inputExplanation = '你將會收到使用者提供的文字說明 (`input`)，且系統會在背後自動夾帶使用者上傳的圖片 (Images)。請綜合分析圖片內容與使用者的文字指示。';
  public readonly inputSchema = `{
  "input": "string // 使用者針對這張圖片提出的問題或指示 (若無特別指示可能為空字串)"
}`;
  public readonly outputExplanation = '請嚴格遵守以下 JSON 格式輸出，不要包含任何 Markdown 標記，純粹返回 JSON 字串。';
  public readonly outputSchema = `{
  "thought": "string // 分析圖片的思考過程，記錄你觀察到的關鍵細節與推論邏輯",
  "result": "any // 根據你的任務目標與圖片內容，產生的最終分析結果。"
}`;
  public readonly hardRules = `- 你必須且只能使用 JSON 格式進行回覆。
- 絕對不要在回覆前後加上 \`\`\`json 或任何額外的文字。
- \`result\` 欄位必須精準滿足 \`taskInstruction\` 的要求。
- 你的分析必須奠基於使用者提供的圖片內容，不要過度腦補不存在的細節。`;
}
