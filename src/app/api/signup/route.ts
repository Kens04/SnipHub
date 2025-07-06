import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/utils/prisma";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

interface CreateUserRequestBody {
  supabaseUserId: string;
  iconUrl: string;
  userName: string;
}

export async function POST(req: NextRequest) {
  try {
    const { supabaseUserId, iconUrl, userName }: CreateUserRequestBody =
      await req.json();
    let path = iconUrl;

    if (path.startsWith("public/")) {
      const ext = path.slice(path.lastIndexOf(".") + 1);
      const newPath = `private/${uuidv4()}.${ext}`;
      const { error } = await supabaseAdmin.storage
        .from("avatar")
        .move(path, newPath);
      if (error) throw error;
      path = newPath;
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("avatar").getPublicUrl(path);

    const user = await prisma.user.create({
      data: { supabaseUserId, userName, iconUrl: publicUrl },
    });

    return NextResponse.json({ status: "OK", id: user.id }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
}
