"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Input } from "@/app/_components/Input";
import SubmitButton from "@/app/_components/SubmitButton";
import { Label } from "@/app/_components/Label";
import { ContactSchema } from "../_lib/ContactSchema";
import { ContactFormType } from "@/app/_types/contactForm";

export const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormType>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormType) => {
    const { name, email, message } = data;
    const res = await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
      }),
    });

    if (res.ok) {
      toast.success("お問い合わせ送信に成功しました。");
      reset();
    } else {
      toast.error("お問い合わせ送信に失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[450px]">
      <div>
        <Label htmlFor="name">お名前</Label>
        <Input
          type="name"
          id="name"
          placeholder="お名前を入力してください"
          required
          disabled={isSubmitting}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-color-danger">{errors.name.message}</p>
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
        <Label htmlFor="message">お問い合わせ内容</Label>
        <textarea
          id="message"
          className="bg-gray-50 border border-gray-300 h-32 text-text-black text-sm rounded-lg focus:ring-color-primary focus:border-color-primary block w-full p-2.5"
          placeholder="お問い合わせ内容を入力してください"
          required
          disabled={isSubmitting}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-color-danger">{errors.message.message}</p>
        )}
      </div>
      <div className="mt-8">
        <SubmitButton isSubmitting={isSubmitting} isSubmittingText="送信中...">
          送信する
        </SubmitButton>
      </div>
    </form>
  );
};
