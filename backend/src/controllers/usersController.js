import { createUser, listUsers, removeUser, setUserRole } from "../services/usersService.js";

// Récupère la liste des utilisateurs
export async function getUsers(req, res, next) {
  try {
    const payload = await listUsers({ limit: req.query.limit });
    return res.json(payload);
  } catch (err) {
    next(err);
  }
}

// Crée un nouvel utilisateur
export async function postUser(req, res, next) {
  try {
    const payload = await createUser({
      name: req.body?.name,
      email: req.body?.email,
      role: req.body?.role,
      baseUrlOverride: req.body?.baseUrlOverride,
    });
    return res.status(201).json(payload);
  } catch (err) {
    next(err);
  }
}

// Met à jour le rôle d'un utilisateur
export async function putUserRole(req, res, next) {
  try {
    const payload = await setUserRole({
      userId: req.params.id,
      role: req.body?.role,
      baseUrlOverride: req.body?.baseUrlOverride,
    });
    return res.json(payload);
  } catch (err) {
    next(err);
  }
}

// Supprime un utilisateur
export async function deleteUser(req, res, next) {
  try {
    const payload = await removeUser({ userId: req.params.id });
    return res.json(payload);
  } catch (err) {
    next(err);
  }
}
