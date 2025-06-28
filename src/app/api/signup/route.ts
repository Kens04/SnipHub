import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

interface CreateUserRequestBody {
  supabaseUserId: string;
  iconUrl: string;
  userName: string;
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
