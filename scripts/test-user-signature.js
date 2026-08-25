const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "../../app-econecta/serviceAccountKeyFirebase.json"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function inspectAndConfigure() {
  const uid = "B8ONHnkND4Nzft8ImpuG4GeKqmb2";
  console.log("Consultando usuario UID:", uid);
  const doc = await db.collection("users").doc(uid).get();
  if (!doc.exists) {
    console.log("Usuario no encontrado por UID:", uid);
    return;
  }
  const data = doc.data();
  console.log("Usuario encontrado con éxito:");
  console.log("- UID:", doc.id);
  console.log("- Username:", data.user_name);
  console.log("- Display Name:", data.display_name);
  console.log("- Email:", data.email);
  console.log("- Perfil Title:", data.perfil?.title);
  console.log("- Cantidad de botones existentes:", data.perfil?.buttons?.length || 0);
  console.log("- Botones:", JSON.stringify(data.perfil?.buttons || [], null, 2));
}

inspectAndConfigure().catch(console.error);
