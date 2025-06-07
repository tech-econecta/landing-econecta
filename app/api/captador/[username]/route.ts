import { NextResponse } from "next/server";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { getUser } from "@/app/[username]/action-get.user"
import { OdooClient } from "@/app/lib/odoo";

export async function POST(request: Request, props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const { username } = params;

  try {
    const body = await request.json();

    const userDoc = await getUser(username);
  
    if (!userDoc) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (!userDoc.referencia) {
      throw new Error("Referencia no encontrada");
    }

    // Guardar en Firebase
    const registrosRef = collection(userDoc.referencia, "registros");
    const respuesta = Object.entries(body).map(([key, value]) => ({ campo: key, contenido: value }));
    await addDoc(registrosRef, {
      respuesta,
      date: new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") || "Unknown",
    });

    // Si la empresa tiene configuración de Odoo, crear lead y contacto
    if (userDoc.empresa?.ODOO) {
      const odooClient = new OdooClient(userDoc.empresa.ODOO);
      
      // Preparar datos para Odoo
      const leadData = {
        name: `Lead desde ${username}`,
        email_from: body.email || '',
        phone: body.telefono || body.phone || '',
        description: Object.entries(body)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n'),
      };

      try {
        // Crear lead
        const leadId = await odooClient.createLead(leadData);

        // Crear contacto si hay información suficiente
        if (body.nombre || body.name) {
          const contactData = {
            name: body.nombre || body.name,
            email: body.email || '',
            phone: body.telefono || body.phone || '',
          };

          const contactId = await odooClient.createContact(contactData);
          await odooClient.assignLeadToContact(leadId, contactId);
        }
      } catch (error) {
        console.error('Error al sincronizar con Odoo:', error);
        // No fallamos la petición si Odoo falla, solo registramos el error
      }
    }

    return NextResponse.json({ message: "Registro guardado exitosamente" });
  } catch (error) {
    console.error("Error al guardar el registro:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

