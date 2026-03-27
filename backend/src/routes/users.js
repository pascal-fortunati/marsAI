import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { deleteUser, getUsers, postUser, putUserRole } from "../controllers/usersController.js";

// Route GET pour récupérer les utilisateurs
export const usersRouter = Router();

// Route GET pour récupérer les utilisateurs
usersRouter.get("/users", requireAuth(["admin"]), getUsers);
// Route POST pour créer un utilisateur
usersRouter.post("/users", requireAuth(["admin"]), postUser);
// Route PUT pour mettre à jour le rôle d'un utilisateur
usersRouter.put("/users/:id/role", requireAuth(["admin"]), putUserRole);
// Route DELETE pour supprimer un utilisateur
usersRouter.delete("/users/:id", requireAuth(["admin"]), deleteUser);