import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "適切なメールアドレスを入力して下さい。" }),
  password: z
    .string()
    .min(6, { message: "パスワードは6文字以上入力して下さい。" }),
});
