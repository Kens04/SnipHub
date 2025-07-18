"use client";

import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const GuestButton = () => {
  const router = useRouter();

  const handleAnonymousLogin = async () => {
    const { error } = await supabase.auth.signInAnonymously();

    if (error instanceof Error) {
      toast.error("ゲストログインに失敗しました");
    }

    router.push("/dashboard");
  };
  return (
    <button
      className="text-color-primary border border-color-primary text-sm sm:text-base py-2 md:py-3 px-5 md:px-8 rounded-full inline-block font-bold hover:bg-color-primary hover:text-color-white transition-colors"
      onClick={handleAnonymousLogin}
    >
      ゲストログイン
    </button>
  );
};
