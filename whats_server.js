const express = require("express");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

const app = express();
app.use(express.json());

const PORT = 3001;
const API_KEY = "623e92ea5a09e2f888bf76e4d2234bd27784ad8524b31af1e185e971676ed355";

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./sessions"
  }),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu"
    ]
  }
});

client.on("qr", qr => {
  console.log("Escaneie este QR Code:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("WhatsApp conectado e pronto.");
});

client.on("auth_failure", msg => {
  console.error("Falha de autenticação:", msg);
});

client.on("disconnected", reason => {
  console.log("WhatsApp desconectado:", reason);
});

client.initialize();

function validar(req, res, next) {
  const key = req.headers["x-api-key"];

  if (key !== API_KEY) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  next();
}

app.get("/status", validar, (req, res) => {
  res.json({
    status: "online",
    whatsapp: client.info ? "connected" : "starting"
  });
});

app.post("/send", validar, async (req, res) => {
  try {
    const { number, message } = req.body;

    if (!number || !message) {
      return res.status(400).json({
        error: "Campos obrigatórios: number, message"
      });
    }

    const chatId = number.includes("@c.us")
      ? number
      : `${number}@c.us`;

    await client.sendMessage(chatId, message);

    res.json({
      success: true,
      to: chatId
    });

  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Servidor WhatsApp rodando em http://127.0.0.1:${PORT}`);
});