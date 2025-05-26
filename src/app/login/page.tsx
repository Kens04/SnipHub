"use client"

import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoginForm } from "../_types/loginForm";
import { loginSchema } from "@/lib/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    const { email, password } = data;
    console.log(data);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("ログインに失敗しました");
    } else {
      // router.replace("/admin/posts");
      alert("ログインに成功しました。");
    }
  };

  return (
    <div className="pt-[188px]">
      <h2 className="text-center text-color-text-black text-3xl font-bold">
        ログイン
      </h2>
      <div className="flex justify-center mt-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[450px]"
        >
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
              placeholder="test@test.com"
              required
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
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              {...register("password")}
            />
            {errors.password && (
              <p className="text-color-danger">{errors.password.message}</p>
            )}
          </div>
          <div className="mt-8">
            <button
              type="submit"
              className="w-full text-white bg-color-primary hover:bg-color-primary-hover font-bold rounded-lg text-sm px-5 py-2.5 text-center"
            >
              ログイン
            </button>
          </div>
        </form>
      </div>
      <div className="text-center mt-5">
        <Link
          href="/signup"
          className="underline text-color-primary transition hover:text-color-primary-hover hover:no-underline"
        >
          アカウントをお持ちでない方はこちら
        </Link>
      </div>
    </div>
  );
};

export default Login;
