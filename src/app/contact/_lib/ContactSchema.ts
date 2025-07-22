import { z } from "zod";

export const ContactSchema = z.object({
  name: z
    .string()
    .min(1, { message: "お名前を入力して下さい。" })
    .max(50, { message: "お名前は50文字以内で入力して下さい。" }),
  email: z
    .string()
    .min(1, { message: "メールアドレスを入力して下さい。" })
    .email({ message: "適切なメールアドレスを入力して下さい。" }),
  message: z
    .string()
    .min(1, { message: "お問い合わせ内容を入力して下さい。" })
    .max(1000, { message: "お問い合わせ内容は1000文字以内で入力して下さい。" }),
});
