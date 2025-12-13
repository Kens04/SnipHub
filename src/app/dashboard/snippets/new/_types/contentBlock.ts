import { TemplateType } from "./template-type";

export interface ContentBlock {
  id: number;
  type: "markdown" | "preview" | "text";
  content: string;
  order: number;
  code?: string;
  template?: TemplateType;
  files?: Record<string, { code: string }>;
}
