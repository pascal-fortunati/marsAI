import {
  deleteUserById,
  findUserById,
  insertPreRegisteredUser,
  listUsersLimit,
  updateUserRole,
} from "../models/usersModel.js";
import { clampInt } from "../utils/coerce.js";
import { isBrevoConfigured } from "./brevoService.js";
import { sendUserInvitationEmail } from "./notificationEmailService.js";

// Service pour lister les rôles autorisés
const allowedRoles = ["admin", "moderator", "jury"];

async function sendInvitationIfNeeded({ email, name, role, baseUrlOverride }) {
  if (role !== "jury" && role !== "moderator") {
    return {
      invitationSent: false,
      invitationSkipped: true,
      invitationError: null,
    };
  }
  if (!isBrevoConfigured()) {
    return {
      invitationSent: false,
      invitationSkipped: true,
      invitationError: "Brevo not configured",
    };
  }
  try {
    await sendUserInvitationEmail({
      to: email,
      name,
      role,
      baseUrlOverride,
    });
    return {
      invitationSent: true,
      invitationSkipped: false,
      invitationError: null,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Invitation email failed";
    return {
      invitationSent: false,
      invitationSkipped: false,
      invitationError: message,
    };
  }
}

// Service pour lister les utilisateurs avec pagination
export async function listUsers({ limit }) {
  const safeLimit = clampInt(limit, 200, { min: 1, max: 1000 });
  const rows = await listUsersLimit(safeLimit);
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

// Service pour créer un utilisateur pré-inscrit
export async function createUser({ name, email, role, baseUrlOverride }) {
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    const err = new Error("Invalid name");
    err.status = 400;
    throw err;
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    const err = new Error("Invalid email");
    err.status = 400;
    throw err;
  }
  if (
    !role ||
    typeof role !== "string" ||
    !allowedRoles.includes(role) ||
    role === "admin"
  ) {
    const err = new Error("Invalid role");
    err.status = 400;
    throw err;
  }

  const user = await insertPreRegisteredUser({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
  });
  const invitation = await sendInvitationIfNeeded({
    email: user.email,
    name: user.name,
    role: user.role,
    baseUrlOverride,
  });
  return {
    user: {
      id: String(user.id),
      googleSubId: null,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: new Date().toISOString(),
    },
    ...invitation,
  };
}

// Service pour mettre à jour le rôle d'un utilisateur
export async function setUserRole({ userId, role, baseUrlOverride }) {
  if (!userId || typeof userId !== "string") {
    const err = new Error("Invalid user id");
    err.status = 400;
    throw err;
  }
  if (!role || typeof role !== "string" || !allowedRoles.includes(role)) {
    const err = new Error("Invalid role");
    err.status = 400;
    throw err;
  }

  const user = await findUserById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  const previousRole = user.role;
  await updateUserRole({ userId, role });
  const roleChanged = previousRole !== role;
  const invitation = roleChanged
    ? await sendInvitationIfNeeded({
        email: user.email,
        name: user.name,
        role,
        baseUrlOverride,
      })
    : { invitationSent: false, invitationSkipped: true, invitationError: null };
  return { ok: true, roleChanged, ...invitation };
}

// Service pour supprimer un utilisateur
export async function removeUser({ userId }) {
  if (!userId || typeof userId !== "string") {
    const err = new Error("Invalid user id");
    err.status = 400;
    throw err;
  }
  await deleteUserById(userId);
  return { ok: true };
}
