import { Resend } from "resend";
import { NextResponse } from "next/server";
import NewsletterEmail from "@/app/emails/NewsletterTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    // Agregar a la audiencia de Resend
    await resend.contacts.create({
      email,
      audienceId: "bb0c94d5-f337-4273-a65f-e2a3dfb95238",
      firstName: name,
      unsubscribed: false,
    });

    // Enviar email de confirmación con el cupón
    await resend.emails.send({
      from: "Econecta <no-reply@econecta.io>",
      to: email,
      subject: "🎉 ¡Bienvenido a Econecta! Un regalo especial para ti 🚀",
      react: NewsletterEmail({ name }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
