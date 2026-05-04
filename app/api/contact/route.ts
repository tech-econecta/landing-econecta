import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { name, email, message, asunto } = await req.json();
    const headersList = headers();
    
    // Obtener información del dispositivo y navegador
    const userAgent = (await headersList).get('user-agent') || 'Desconocido';
    
    // Crear fecha y hora en formato Venezuela
    const timeZone = 'America/Caracas';
    const fecha = new Date().toLocaleString('es-VE', {
      timeZone,
      dateStyle: 'full',
      timeStyle: 'long',
    });

    const data = await resend.emails.send({
      from: 'Econecta Contact Form <no-reply@econecta.io>',
      to: 'ventasve@econecta.io',
      subject: `Nuevo mensaje de contacto de ${name}`,
      text: `
        📝 Detalles del Mensaje:
        ----------------------
        Nombre: ${name}
        Email: ${email}
        Asunto: ${asunto}
        Mensaje: ${message}

        📱 Información Técnica:
        ----------------------
        Fecha y Hora: ${fecha}
        Dispositivo: ${userAgent}
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
} 