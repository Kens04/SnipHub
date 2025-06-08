"use client";

import { supabase } from "@/utils/supabase";
import { useForm } from "react-hook-form";
import { LoginFormType } from "../_types/loginForm";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginSchema } from "../login/_lib/loginSchema";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/navigation";

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const router = useRouter();
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
      router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[450px]">
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          メールアドレス
          <span className="text-color-danger inline-block ml-1">※</span>
        </label>
        <input
          type="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          パスワード
          <span className="text-color-danger inline-block ml-1">※</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "password" : "text"}
            id="password"
            placeholder="パスワードを入力してください"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            disabled={isSubmitting}
            {...register("password")}
          />
          {!showPassword ? (
            <FaEye
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            />
          ) : (
            <FaEyeSlash
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            />
          )}
        </div>
        {errors.password && (
          <p className="text-color-danger">{errors.password.message}</p>
        )}
      </div>
      <div className="mt-8">
        <button
          type="submit"
          className={`${
            isSubmitting
              ? "bg-gray-300 text-black pointer-events-none"
              : "bg-color-primary hover:bg-color-primary-hover text-white"
          } w-full font-bold rounded-lg text-sm px-5 py-2.5 text-center`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex justify-center items-center">
              <span className="mr-2">ログイン中...</span>
              <AiOutlineLoading3Quarters className="animate-spin w-4 h-4" />
            </span>
          ) : (
            "ログイン"
          )}
        </button>
      </div>
    </form>
  );
};
