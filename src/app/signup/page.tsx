"use client";

import { supabase } from "@/utils/supabase";
// import { createAvatar } from "@dicebear/core";
// import { identicon } from "@dicebear/collection";
import Image from "next/image";
import avatar from "../public/images/avatar.png";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpForm } from "../_types/signUpForm";
import { SignUpSchema } from "@/lib/SignUpSchema";
import { v4 as uuidv4 } from "uuid";
import { ChangeEvent, useEffect, useState } from "react";

const SignUp: React.FC = () => {
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (data: SignUpForm) => {
    const { email, password } = data;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `http://localhost:3000/login`,
      },
    });
    if (error) {
      alert("登録に失敗しました");
    } else {
      alert("確認メールを送信しました。");
    }
  };

  // const avatar = createAvatar(identicon, {
  //   seed: "Flizx",
  //   radius: 50,
  //   rowColor: ["00acc1","1e88e5","5e35b1"]
  // });

  // const svg = avatar.toDataUri();

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return;
    }

    const file = event.target.files[0]; // 選択された画像を取得
    console.log("ファイル", file);

    const filePath = `private/${uuidv4()}`; // ファイルパスを指定
    console.log("ファイルパス", filePath);

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

    // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    setThumbnailImageKey(data.path);
  };

  useEffect(() => {
    if (!thumbnailImageKey) return; // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage.from("avatar").getPublicUrl(thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [thumbnailImageKey]);

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
            <Image src={avatar} width={100} height={100} alt="avatar" />
            {thumbnailImageUrl && (
              <Image
                src={thumbnailImageUrl}
                width={100}
                height={100}
                alt="avatar"
              />
            )}
          </div>
          <div className="text-center mt-3">
            <input
              type="file"
              id="thumbnailImageKey"
              onChange={handleImageChange}
              accept="image/*"
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
              type="name"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="お名前を入力して下さい"
              required
              {...register("name")}
            />
            {errors.name && (
              <p className="text-color-danger">{errors.name.message}</p>
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
              placeholder="パスワードを入力してください"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              {...register("password")}
            />
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
            <input
              type="password"
              id="passwordConfirm"
              placeholder="パスワード(確認)を入力してください"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              {...register("passwordConfirm")}
            />
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
