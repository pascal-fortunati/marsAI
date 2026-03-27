import { listUsersByRoleLimit } from "../models/usersModel.js";
import { clampInt } from "../utils/coerce.js";

// Service pour lister les utilisateurs jury avec pagination sécurisée
export async function listJuryUsers({ limit }) {
  const safeLimit = clampInt(limit, 1000, { min: 1, max: 2000 });
  const rows = await listUsersByRoleLimit({ role: "jury", limit: safeLimit });
  const items = rows.map((r) => ({
    id: String(r.id),
    googleSubId: r.google_sub_id ?? null,
    email: r.email,
    name: r.name,
    role: r.role,
    createdAt: r.created_at,
  }));
  return { items };
}