"use client";

import { ChangeEvent, useRef, useState } from "react";
import { SignUpFormType } from "../_types/signUpForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "../signup/_lib/SignUpSchema";
import { getNoAvatar } from "../signup/_utils/uploadAvatar";
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import avatar from "../public/images/avatar.png";

export const SignUpForm: React.FC = () => {
  const [iconUrl, setIconUrl] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      iconUrl: "",
      userName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (data: SignUpFormType) => {
    const { userName, email, password } = data;
    let iconPath = iconUrl ?? null;

    console.log("📌 iconUrl BEFORE processing:", iconPath);

    // 1. 自動生成 or アップロード済みチェック
    let originalPath = "";
    let finalStoragePath = "";

    if (!iconPath) {
      const svgString = getNoAvatar.toString();
      const svgBlob = new Blob([svgString], { type: "image/svg+xml" });

      originalPath = `public/${uuidv4()}.svg`;
      finalStoragePath = `private/${uuidv4()}.svg`;

      const { error: uploadError } = await supabase.storage
        .from("avatar")
        .upload(originalPath, svgBlob, {
          cacheControl: "3600",
          upsert: false,
          contentType: "image/svg+xml",
        });

      if (uploadError) {
        console.error("❌ uploadError", uploadError);
        toast.error("アイコンのアップロードに失敗しました");
        return;
      }

      console.log("✅ upload success:", originalPath);
      iconPath = originalPath;
    } else {
      if (!iconPath?.startsWith("public/")) {
        toast.error("iconUrl の形式が不正です (public/ から始まっていない)");
        return;
      }

      originalPath = iconPath; // ← そのまま使う
      const ext = originalPath.split(".").pop() || "png";
      finalStoragePath = `private/${uuidv4()}.${ext}`;

      console.log("🔄 originalPath:", originalPath);
      console.log("📦 finalStoragePath:", finalStoragePath);
    }

    // 2. サインアップ
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:3000/login",
        },
      }
    );

    if (signUpError || !signUpData.user) {
      console.error("❌ signUpError", signUpError);
      toast.error("登録に失敗しました");
      return;
    }

    // ② サーバーサイドにユーザー情報＋アイコンパスを送信
    //    ※/api/signup 内で move + DB 保存を行う
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        iconUrl: iconPath, // 空文字ならデフォルト画像扱い
        userName,
        supabaseUserId: signUpData.user.id,
      }),
    });

    if (res.ok) {
      toast.success("確認メールを送信しました。");
    } else {
      console.error("❌ /api/signup error", await res.text());
      toast.error("サーバー登録に失敗しました。");
    }
  };

  const handleIconChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      return;
    }
    setIsLoading(true);
    const file = event.target.files[0];
    const ext = file.name.split(".").pop();
    const filePath = `public/${uuidv4()}.${ext}`;
    const { data, error } = await supabase.storage
      .from("avatar")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error || !data) {
      console.error("❌ Upload error:", error);
      alert("アップロードに失敗しました");
      setIsLoading(false);
      return;
    }

    console.log("📝 Uploaded file path:", data.path);
    setValue("iconUrl", data.path); // ✅ path を form に保存
    setIconUrl(data.path); // ✅ path を state に保存

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[450px]">
      <div className="w-[100px] h-[100px] rounded-full m-auto cursor-pointer">
        <Image
          className="w-[100px] h-[100px] rounded-full m-auto"
          src={
            iconUrl
              ? supabase.storage.from("avatar").getPublicUrl(iconUrl).data
                  .publicUrl
              : avatar
          }
          width={100}
          height={100}
          alt="avatar"
          onClick={() => fileInputRef.current?.click()}
        />
        <input
          type="file"
          id="iconUrl"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleIconChange}
          disabled={isLoading || isSubmitting}
        />
      </div>
      <div className="mt-4">
        <label
          htmlFor="name"
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
      <div className="mt-4">
        <label
          htmlFor="passwordConfirm"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          パスワード(確認)
          <span className="text-color-danger inline-block ml-1">※</span>
        </label>
        <div className="relative">
          <input
            type={showPasswordConfirm ? "password" : "text"}
            id="passwordConfirm"
            placeholder="パスワード(確認)を入力してください"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            disabled={isSubmitting}
            {...register("passwordConfirm")}
          />
          {!showPasswordConfirm ? (
            <FaEye
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            />
          ) : (
            <FaEyeSlash
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            />
          )}
        </div>
        {errors.passwordConfirm && (
          <p className="text-color-danger">{errors.passwordConfirm.message}</p>
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
          登録する
        </button>
      </div>
    </form>
  );
};
