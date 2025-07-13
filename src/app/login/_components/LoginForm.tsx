"use client";

import { supabase } from "@/utils/supabase";
import { useForm } from "react-hook-form";
import { LoginFormType } from "../../_types/loginForm";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginSchema } from "../_lib/loginSchema";
import { Input } from "@/app/_components/Input";
import SubmitButton from "@/app/_components/SubmitButton";
import { Label } from "@/app/_components/Label";

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormType) => {
    const { email, password } = data;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("ログインに失敗しました");
    } else {
      toast.success("ログインに成功しました。");
      window.location.href = "/dashboard";
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[450px]">
      <div>
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          type="email"
          id="email"
          placeholder="メールアドレスを入力してください"
          required
          disabled={isSubmitting}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-color-danger">{errors.email.message}</p>
        )}
      </div>
      <div className="mt-4">
        <Label htmlFor="password">パスワード</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="パスワードを入力してください"
            required
            disabled={isSubmitting}
            {...register("password")}
          />
          {showPassword ? (
            <FaEye
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 ${
                isSubmitting
                  ? "cursor-auto pointer-events-none"
                  : "cursor-pointer"
              }`}
            />
          ) : (
            <FaEyeSlash
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 ${
                isSubmitting
                  ? "cursor-auto pointer-events-none"
                  : "cursor-pointer"
              }`}
            />
          )}
        </div>
        {errors.password && (
          <p className="text-color-danger">{errors.password.message}</p>
        )}
      </div>
      <div className="mt-8">
        <SubmitButton
          isSubmitting={isSubmitting}
          isSubmittingText="ログイン中..."
        >
          ログイン
        </SubmitButton>
      </div>
    </form>
  );
};
