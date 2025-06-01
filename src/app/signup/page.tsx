"use client";

import { supabase } from "@/utils/supabase";
import { createAvatar } from "@dicebear/core";
import { identicon } from "@dicebear/collection";
import Image from "next/image";
import avatar from "../public/images/avatar.png";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpForm } from "../_types/signUpForm";
import { SignUpSchema } from "@/lib/SignUpSchema";
import { v4 as uuidv4 } from "uuid";
import { ChangeEvent, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const SignUp: React.FC = () => {
  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [iconUrl, setIconUrl] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState<boolean>(true);
  const [passwordConfirm, setPasswordConfirm] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      iconUrl: "",
      userName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const noAvatar = createAvatar(identicon, {
    seed: "Flizx",
    radius: 50,
    rowColor: ["00acc1", "1e88e5", "5e35b1"],
  });

  const onSubmit = async (data: SignUpForm) => {
    const { userName, email, password } = data;
    let iconPath = iconUrl;
    if (!iconPath) {
      const svgString = noAvatar.toString();
      const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
      const filePath = `private/${uuidv4()}.svg`;
      // Supabase Storageにアップロード
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatar")
        .upload(filePath, svgBlob, {
          cacheControl: "3600",
          upsert: false,
          contentType: "image/svg+xml",
        });

      if (uploadError) {
        console.log(svgString, svgBlob, filePath);
        alert("アイコンの自動生成に失敗しました");
        return;
      }
      const { data: publicData } = supabase.storage
        .from("avatar")
        .getPublicUrl(uploadData.path);
      iconPath = publicData.publicUrl;
    }
    try {
      await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `http://localhost:3000/login`,
        },
      });
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          iconUrl: iconPath,
          userName,
        }),
      });

      if (res.ok) {
        alert("確認メールを送信しました。");
      }
    } catch (error) {
      if (error) {
        alert("登録に失敗しました");
      }
    }
  };

  const handleIconChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return;
    }

    setIsLoading(true);
    const file = event.target.files[0]; // 選択された画像を取得
    const filePath = `private/${uuidv4()}`; // ファイルパスを指定
    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from("avatar") // ここでバケット名を指定
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message);
      return;
    }

    setValue("iconUrl", data.path);

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage.from("avatar").getPublicUrl(data.path);

      setIconUrl(publicUrl);
    };

    fetcher();

    setIsLoading(false);
  };

  return (
    <div className="pt-[188px]">
      <h2 className="text-center text-color-text-black text-3xl font-bold">
        新規登録
      </h2>
      <div className="flex justify-center mt-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[450px]"
        >
          <div className="w-[100px] h-[100px] rounded-full m-auto">
            {iconUrl ? (
              <Image
                className="w-[100px] h-[100px] rounded-full m-auto"
                src={iconUrl}
                width={100}
                height={100}
                alt="avatar"
              />
            ) : (
              <Image src={avatar} width={100} height={100} alt="avatar" />
            )}
          </div>
          <div className="text-center mt-3">
            <input
              type="file"
              id="iconUrl"
              {...register("iconUrl", {
                onChange: handleIconChange,
              })}
              accept="image/*"
              disabled={isLoading || isSubmitting}
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              お名前
              <span className="text-color-danger inline-block ml-1">※</span>
            </label>
            <input
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="お名前を入力して下さい"
              required
              disabled={isSubmitting}
              {...register("userName")}
            />
            {errors.userName && (
              <p className="text-color-danger">{errors.userName.message}</p>
            )}
          </div>
          <div className="mt-4">
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
                type={password ? "password" : "text"}
                id="password"
                placeholder="パスワードを入力してください"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
                disabled={isSubmitting}
                {...register("password")}
              />
              {!password ? (
                <FaEye
                  onClick={() => setPassword(!password)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                />
              ) : (
                <FaEyeSlash
                  onClick={() => setPassword(!password)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                />
              )}
            </div>
            {errors.password && (
              <p className="text-color-danger">{errors.password.message}</p>
            )}
          </div>
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              パスワード(確認)
              <span className="text-color-danger inline-block ml-1">※</span>
            </label>
            <div className="relative">
              <input
                type={passwordConfirm ? "password" : "text"}
                id="passwordConfirm"
                placeholder="パスワード(確認)を入力してください"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
                disabled={isSubmitting}
                {...register("passwordConfirm")}
              />
              {!passwordConfirm ? (
                <FaEye
                  onClick={() => setPasswordConfirm(!passwordConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                />
              ) : (
                <FaEyeSlash
                  onClick={() => setPasswordConfirm(!passwordConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                />
              )}
            </div>
            {errors.passwordConfirm && (
              <p className="text-color-danger">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>
          <div className="mt-8">
            <button
              type="submit"
              className="w-full text-white bg-color-primary hover:bg-color-primary-hover font-bold rounded-lg text-sm px-5 py-2.5 text-center"
              disabled={isSubmitting}
            >
              登録する
            </button>
          </div>
        </form>
      </div>
      <div className="text-center mt-5">
        <Link
          href="/login"
          className="underline text-color-primary transition hover:text-color-primary-hover hover:no-underline"
        >
          アカウントをお持ちの方はこちら
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
