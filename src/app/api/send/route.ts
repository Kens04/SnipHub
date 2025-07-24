import { EmailTemplate } from "@/app/contact/_components/EmailTemplate";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactRequestBody {
  name: string;
  email: string;
  message: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL!;
const adminEmail = process.env.ADMIN_EMAIL!;

export async function POST(request: NextRequest) {
  const { name, email, message }: ContactRequestBody = await request.json();

  try {
    const [customerConfirmation, adminNotification] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: "お問い合わせありがとうございます",
        react: EmailTemplate({
          name,
          email,
          message,
        }),
      }),

      resend.emails.send({
        from: fromEmail,
        to: [adminEmail],
        subject: "新しいお問い合わせがあります",
        react: EmailTemplate({
          name,
          email,
          message,
        }),
      }),
    ]);

    if (customerConfirmation.error || adminNotification.error) {
      return NextResponse.json(
        {
          error: customerConfirmation.error || adminNotification.error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      data: "メール送信が成功しました。",
      customerEmailId: customerConfirmation.data.id,
      adminEmailId: adminNotification.data.id,
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 500 });
  }
}
