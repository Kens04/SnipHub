import { z } from "zod";

export const CreateSnippetSchema = z.object({
  title: z
    .string()
    .min(1, { message: "タイトルは必須です" })
    .max(100, { message: "タイトルは100文字以内で入力してください" }),
  description: z
    .string()
    .min(1, { message: "概要・使い方は必須です" })
    .max(500, { message: "概要・使い方は500文字以内で入力してください" }),
  category: z.string().min(1, { message: "カテゴリは必須です" }),
  tag: z.string().min(1, { message: "タグは必須です" }),
});