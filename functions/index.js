import '@ant-design/v5-patch-for-react-19';
const functions = require("firebase-functions");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

exports.next = functions.https.onRequest((req, res) => {
  return app.prepare().then(() => handle(req, res));
});
