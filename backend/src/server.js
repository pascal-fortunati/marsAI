import { createApp } from "./app.js";
import { env } from "./config/env.js";

// Service pour créer une instance d'application Express
const app = createApp();

// Service pour démarrer le serveur Express sur le port spécifié
app.listen(env.port, "0.0.0.0", () => {
  console.log(`Serveur API démarré sur http://localhost:${env.port}`);
});
