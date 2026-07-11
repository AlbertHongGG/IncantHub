export type MessagePartType = 'text' | 'image' | 'gallery' | 'error' | 'loading';

export interface BaseMessagePart {
  id: string;
  type: MessagePartType;
}

export interface TextMessagePart extends BaseMessagePart {
  type: 'text';
  text: string;
}

export interface ImageMessagePart extends BaseMessagePart {
  type: 'image';
  url: string;
}

export interface GalleryMessagePart extends BaseMessagePart {
  type: 'gallery';
  urls: string[];
}

export interface ErrorMessagePart extends BaseMessagePart {
  type: 'error';
}

export interface LoadingMessagePart extends BaseMessagePart {
  type: 'loading';
}

export type MessagePart = TextMessagePart | ImageMessagePart | GalleryMessagePart | ErrorMessagePart | LoadingMessagePart;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts: MessagePart[];
  isGenerating?: boolean;
  timestamp: number;
}
