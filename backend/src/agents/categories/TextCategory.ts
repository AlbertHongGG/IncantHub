import { AgentCategory } from '../models/AgentCategory';

export class TextCategory implements AgentCategory {
  public readonly id = 'text';
  public readonly name = 'Text Processing';
  public readonly inputExplanation = '你將會收到使用者提供的純文字輸入 (`input`)。請根據這些內容與你的 `role` 設定進行處理。';
  public readonly inputSchema = `{
  "input": "string"
}`;
  public readonly outputExplanation = '請嚴格遵守以下 JSON 格式輸出，不要包含任何 Markdown 標記，純粹返回 JSON 字串。';
  public readonly outputSchema = `{
  "thought": "string // 你處理這個任務的思考過程、摘要邏輯或是任何需要記錄的分析",
  "result": "any // 根據你的任務目標，產生的最終文字結果。這可能是一段總結、一篇文案或是一段分析報告。"
}`;
  public readonly hardRules = `- 你必須且只能使用 JSON 格式進行回覆。
- 絕對不要在回覆前後加上 \`\`\`json 或任何額外的文字。
- \`result\` 欄位必須精準滿足 \`taskInstruction\` 的要求。`;
}
