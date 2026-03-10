import mysql from "mysql2/promise";
import { env } from "./env.js";

// Crée un pool de connexions à la base de données MySQL
export const db = mysql.createPool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Intercepte les appels à db.execute pour gérer les paramètres manquants et numériques invalides
const originalExecute = db.execute.bind(db);
db.execute = async (sql, params = []) => {
  if (Array.isArray(params)) {
    for (let i = 0; i < params.length; i++) {
      const v = params[i];
      if (v === undefined) {
        const err = new Error("Paramètre manquant");
        err.status = 500;
        err.meta = { sql, index: i };
        throw err;
      }
      if (typeof v === "number" && !Number.isFinite(v)) {
        const err = new Error("Paramètre numérique invalide");
        err.status = 500;
        err.meta = { sql, index: i, value: v };
        throw err;
      }
    }
  }
  return originalExecute(sql, params);
};