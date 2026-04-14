export interface TextBlock {
  type: "paragraph";
  text: string;
}

export interface HeadingBlock {
  type: "heading";
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface PythonBlock {
  type: "python";
  code: string;
  caption?: string;
}

export interface ImageBlock {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
  width?: string;
}

export interface CalloutBlock {
  type: "callout";
  blocks: ContentBlock[];
}

export interface ListBlock {
  type: "list";
  items: string[];
}

export type ContentBlock = TextBlock | HeadingBlock | PythonBlock | ImageBlock | CalloutBlock | ListBlock;

export interface ModuleQuestion {
  id: string;
  prompt: string;
  placeholder: string;
  helpText?: string;
  acceptedKeywords: string[];
  hint: string;
}

export interface ModuleCheckpoint {
  questions: ModuleQuestion[];
}

export interface ModuleContent {
  theory: ContentBlock[];
  summary: ContentBlock[];
  questions?: ModuleQuestion[];
}
