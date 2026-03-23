import { app } from "./app.js";
import { db } from "./config/db.js";
import { env } from "./config/env.js";

async function start() {
  // Vérifie que MySQL répond avant d'accepter des requêtes
  try {
    await db.execute("SELECT 1");
    console.log("✅ MySQL connecté");
  } catch (err) {
    console.error("❌ Impossible de se connecter à MySQL :", err.message);
    process.exit(1);
  }

  app.listen(env.port, () => {
    console.log(`🚀 marsAI backend démarré sur http://localhost:${env.port}`);
  });
}

start();
