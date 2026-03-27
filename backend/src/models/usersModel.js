import { db } from "../config/db.js";

// Récupère un utilisateur par son identifiant Google
export async function findUserByGoogleSubId(googleSubId) {
  const [rows] = await db.execute(
    "SELECT id, google_sub_id, email, name, role FROM users WHERE google_sub_id = ? LIMIT 1",
    [googleSubId],
  );
  return rows?.[0] || null;
}

// Récupère un utilisateur par son adresse email
export async function findUserByEmail(email) {
  const [rows] = await db.execute(
    "SELECT id, google_sub_id, email, name, role FROM users WHERE email = ? LIMIT 1",
    [email],
  );
  return rows?.[0] || null;
}

// Récupère un utilisateur par son identifiant
export async function findUserById(userId) {
  const [rows] = await db.execute("SELECT id, google_sub_id, email, name, role FROM users WHERE id = ? LIMIT 1", [
    userId,
  ]);
  return rows?.[0] || null;
}

// Insère un utilisateur pré-inscrit dans la base de données
export async function insertPreRegisteredUser({ email, name, role }) {
  const [result] = await db.execute(
    "INSERT INTO users (google_sub_id, email, name, role, created_at) VALUES (NULL, ?, ?, ?, NOW())",
    [email, name, role],
  );
  return {
    id: result.insertId,
    google_sub_id: null,
    email,
    name,
    role,
  };
}

// Met à jour les informations d'identité Google d'un utilisateur pré-inscrit
export async function updateUserGoogleIdentity({ userId, googleSubId, name }) {
  await db.execute("UPDATE users SET google_sub_id = ?, name = ? WHERE id = ?", [googleSubId, name, userId]);
}

// Récupère une liste paginée d'utilisateurs triés par date de création
export async function listUsersLimit(limit) {
  const safeLimit = Math.max(1, Math.min(1000, Math.floor(Number(limit) || 0)));
  const [rows] = await db.execute(
    `SELECT id, google_sub_id, email, name, role, created_at FROM users ORDER BY created_at DESC LIMIT ${safeLimit}`,
  );
  return rows;
}

// Récupère une liste paginée d'utilisateurs par rôle triés par date de création
export async function listUsersByRoleLimit({ role, limit }) {
  const safeLimit = Math.max(1, Math.min(2000, Math.floor(Number(limit) || 0)));
  const [rows] = await db.execute(
    `SELECT id, google_sub_id, email, name, role, created_at FROM users WHERE role = ? ORDER BY created_at DESC LIMIT ${safeLimit}`,
    [role],
  );
  return rows;
}

// Met à jour le rôle d'un utilisateur
export async function updateUserRole({ userId, role }) {
  await db.execute("UPDATE users SET role = ? WHERE id = ?", [role, userId]);
}

// Supprime un utilisateur par son identifiant
export async function deleteUserById(userId) {
  await db.execute("DELETE FROM users WHERE id = ?", [userId]);
}
