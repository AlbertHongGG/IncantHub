import { AgentCategory } from '../core/AgentCategory';

export const TextCategory: AgentCategory = {
  id: 'text',
  name: 'Text Processing',
  inputExplanation: `你將會收到使用者提供的一段或多段文字內容 (\`input\`)。
你的任務是身為專業的文本處理引擎，針對該段文字進行深度的語意分析、萃取或是生成。
請確保你完全理解上下文與言外之意，並依據具體的任務指示 (Task Instruction) 來處理這段輸入。`,
  inputSchema: `Format:
{
  "input": "string 表示使用者輸入的原始文字或具體需求"
}`,
  outputExplanation: `你的輸出將會直接被後端系統解析，因此格式的正確性至關重要。
在 \`thought\` 欄位中，請詳細記錄你的思考拆解過程、邏輯推演，這有助於提高你最終結果的品質（Chain of Thought）。
在 \`result\` 欄位中，請放置你最終處理完成、排版整齊的文字結果。`,
  outputSchema: `Format:
{
  "thought": "string 表示你的分析與思考過程（逐步拆解問題的邏輯）",
  "result": "string 表示最終生成或處理完成的文字結果"
}`,
  hardRules: `- 僅可輸出純 JSON 格式，絕對不可輸出任何 Markdown 標記（如 \`\`\`json 標籤）、敘述文字或註解。
- 輸出的 JSON 必須精確符合 OUTPUT_SCHEMA 的結構定義，所有鍵值名稱需大小寫一致。
- 嚴格維持單一的 JSON Object 回傳，不要在 JSON 前後夾雜任何說明或對話。
- 如果遇到無法解析或處理的輸入，請在 thought 中說明原因，並在 result 中回傳友善的錯誤提示。`
};
