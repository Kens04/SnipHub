import { z } from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(1, { message: "お名前を入力して下さい。" }),
  email: z
    .string()
    .email({ message: "適切なメールアドレスを入力して下さい。" }),
  password: z
    .string()
    .min(6, { message: "パスワードは6文字以上入力して下さい。" }),
  passwordConfirm: z
    .string()
    .min(6, { message: "パスワード(確認)は6文字以上入力して下さい。" }),
});
