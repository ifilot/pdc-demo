export interface TextBlock {
  type: "paragraph";
  text: string;
}

export interface PythonBlock {
  type: "python";
  code: string;
  caption?: string;
}

export type ContentBlock = TextBlock | PythonBlock;

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
