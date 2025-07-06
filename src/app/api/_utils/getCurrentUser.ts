import { prisma } from "@/utils/prisma";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { NextRequest } from "next/server";

export const getCurrentUser = async (request: NextRequest) => {
  try {
    // 1) Authorization ヘッダーを取得
    const authHeader = request.headers.get("Authorization") ?? "";

    if (!authHeader.startsWith("Bearer ")) {
      return { user: null, error: { message: "認証トークンがありません" } };
    }

    // "Bearer xxx.yyy.zzz" → "xxx.yyy.zzz"
    const token = authHeader.split(" ")[1];

    // 2) JWT でユーザー取得
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) {
      return { user: null, error: { message: "認証に失敗しました" } };
    }

    const user = await prisma.user.findUnique({
      where: { supabaseUserId: data.user.id },
    });

    if (!user) {
      return { user: null, error: { message: "ユーザー情報が見つかりません" } };
    }

    return { user, error };
  } catch (error) {
    return {
      user: null,
      error: {
        message: error,
      },
    };
  }
};
