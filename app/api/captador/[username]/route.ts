import { NextResponse } from "next/server";
import { collection, addDoc } from "firebase/firestore";
import { getUser } from "@/app/[username]/action-get.user";
import { OdooClient } from "@/app/lib/odoo";

export async function POST(
  request: Request,
  props: { params: Promise<{ username: string }> }
) {
  const params = await props.params;
  const { username } = params;

  try {
    const body = await request.json();

    const userDoc = await getUser(username);

    if (!userDoc) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (!userDoc.referencia) {
      throw new Error("Referencia no encontrada");
    }

    // Guardar en Firebase
    const registrosRef = collection(userDoc.referencia, "registros");
    const respuesta = Object.entries(body).map(([key, value]) => ({
      campo: key,
      contenido: value,
    }));
    await addDoc(registrosRef, {
      respuesta,
      date: new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") || "Unknown",
    });

    // Si la empresa tiene configuración de Odoo, crear lead y contacto
    if (userDoc.empresa?.ODOO) {
      const odooClient = new OdooClient(userDoc.empresa.ODOO);
      const leadData: { [key: string]: string } = {};
      for (const [key, value] of Object.entries(body)) {
        const campo = userDoc.captador?.campos.find(
          (campo) => campo.nombre === key
        );
        if (campo) {
          leadData[campo.odoo_field_key || key] = value as string;
        }
      }

      try {
        // Crear lead
        const leadId = await odooClient.createLead(leadData);

        // Crear contacto si hay información suficiente
        const contactData: { [key: string]: string } = {};
        for (const [key, value] of Object.entries(body)) {
          const campo = userDoc.captador?.campos.find(
            (campo) => campo.nombre === key
          );
          if (campo) {
            contactData[
              (campo.odoo_field_key === "email_from"
                ? "email"
                : campo.odoo_field_key) || key
            ] = value as string;
          }
        }

        const contactId = await odooClient.createContact(contactData);
        await odooClient.assignLeadToContact(leadId, contactId);
      } catch (error) {
        console.error("Error al sincronizar con Odoo:", error);
        // No fallamos la petición si Odoo falla, solo registramos el error
      }
    }

    return NextResponse.json({ message: "Registro guardado exitosamente" });
  } catch (error) {
    console.error("Error al guardar el registro:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
