"use client";

import { ChangeEvent, useRef, useState } from "react";
import { SignUpFormType } from "../../_types/signUpForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "../_lib/SignUpSchema";
import { getNoAvatar } from "../_utils/uploadAvatar";
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import avatar from "../../public/images/avatar.png";
import { Input } from "@/app/_components/Input";
import SubmitButton from "@/app/_components/SubmitButton";
import { Label } from "@/app/_components/Label";

export const SignUpForm: React.FC = () => {
  const [iconUrl, setIconUrl] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState<boolean>(false);
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
    let iconPath = iconUrl;

    // アイコン未設定時はデフォルトSVGを生成してアップロード
    if (!iconPath) {
      const svgString = getNoAvatar.toString();
      const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
      iconPath = `public/${uuidv4()}.svg`;

      const { error: uploadError } = await supabase.storage
        .from("avatar")
        .upload(iconPath, svgBlob, {
          cacheControl: "3600",
          upsert: false,
          contentType: "image/svg+xml",
        });

      if (uploadError) {
        toast.error("アイコンのアップロードに失敗しました");
        return;
      }
    }

    // サインアップ実行
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: { emailRedirectTo: "/dashboard" },
      }
    );
    if (signUpError || !signUpData.user) {
      toast.error("登録に失敗しました");
      return;
    }

    // サーバーにユーザー情報＋アイコンパスを送信
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supabaseUserId: signUpData.user.id,
        userName,
        iconUrl: iconPath,
      }),
    });

    if (res.ok) {
      toast.success("確認メールを送信しました。");
    } else {
      toast.error("すでに新規登録済みです");
    }
  };

  const handleIconChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `public/${uuidv4()}.${ext}`;
      const { data, error } = await supabase.storage
        .from("avatar")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error || !data) throw error;

      setValue("iconUrl", data.path);
      setIconUrl(data.path);
    } catch (err) {
      toast.error("アップロードに失敗しました");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[450px]">
      <div
        className={`w-[70px] h-[70px] md:w-[100px] md:h-[100px] rounded-full m-auto ${
          isSubmitting ? "cursor-auto pointer-events-none" : "cursor-pointer"
        }`}
      >
        <Image
          className="w-[70px] h-[70px] md:w-[100px] md:h-[100px] rounded-full m-auto"
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
        <Label htmlFor="name">お名前</Label>
        <Input
          type="text"
          id="name"
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
      <div className="mt-4">
        <Label htmlFor="passwordConfirm">パスワード(確認)</Label>
        <div className="relative">
          <Input
            type={showPasswordConfirm ? "text" : "password"}
            id="passwordConfirm"
            placeholder="パスワード(確認)を入力してください"
            required
            disabled={isSubmitting}
            {...register("passwordConfirm")}
          />
          {showPasswordConfirm ? (
            <FaEye
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 ${
                isSubmitting
                  ? "cursor-auto pointer-events-none"
                  : "cursor-pointer"
              }`}
            />
          ) : (
            <FaEyeSlash
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 ${
                isSubmitting
                  ? "cursor-auto pointer-events-none"
                  : "cursor-pointer"
              }`}
            />
          )}
        </div>
        {errors.passwordConfirm && (
          <p className="text-color-danger">{errors.passwordConfirm.message}</p>
        )}
      </div>
      <div className="mt-8">
        <SubmitButton isSubmitting={isSubmitting} isSubmittingText="登録中...">
          登録する
        </SubmitButton>
      </div>
    </form>
  );
};
