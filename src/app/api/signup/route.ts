import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

// Service-Role キーで初期化
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { supabaseUserId, iconUrl: incomingPath, userName } = body;
    console.log("📩 /api/signup received:", {
      supabaseUserId,
      incomingPath,
      userName,
    });
    // ── 1) publicフォルダにあるときは private に移動 ──
    let storagePath = incomingPath;
    if (incomingPath && incomingPath.startsWith("public/")) {
      const ext = incomingPath.split(".").pop()!;
      const newPath = `private/${uuidv4()}.${ext}`;
      const { error: moveError } = await supabaseAdmin.storage
        .from("avatar")
        .move(incomingPath, newPath);

      if (moveError) {
        console.error("❌ storage.move failed:", moveError);
        throw moveError;
      }
      storagePath = newPath;
      console.log("✅ moved to:", newPath);
    }

    // ── 2) 署名付き URL を生成 ──
    //    (プライベートバケットの場合 createSignedUrl／
    //     パブリックなら getPublicUrl でも OK)
    const { data: signedData, error: signError } = await supabaseAdmin.storage
      .from("avatar")
      .createSignedUrl(storagePath, 60 * 60 * 24 * 7); // 有効期限 7 日

    if (signError) {
      console.error("❌ createSignedUrl failed:", signError);
      throw signError;
    }
    const publicUrl = signedData.signedUrl!;
    console.log("🔗 signedUrl:", publicUrl);

    // ── 3) DB に保存 ──
    const user = await prisma.user.create({
      data: {
        supabaseUserId,
        userName,
        iconUrl: publicUrl,
      },
    });

    return NextResponse.json(
      { status: "OK", message: "ユーザー作成成功", id: user.id },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ /api/signup error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ status: "ERROR", message }, { status: 500 });
  }
};
