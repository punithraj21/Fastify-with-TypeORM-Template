import { FastifyInstance } from "fastify";

import { createCompany } from "../controllers/companyController";
import {
  createPost,
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userController";

export const companyRoutes = async (server: FastifyInstance) => {
  server.get<{ Params: { name: string } }>(
    "/createCompany/:name",
    createCompany
  );
};

export const userRoutes = async (server: FastifyInstance) => {
  server.get<{ Params: { id: string } }>("/user/:id", getUser);
  server.get("/users", getAllUsers);
  server.post<{ Body: { firstName: string; lastName: string; age: number } }>(
    "/createUser",
    createUser
  );
  server.post<{ Body: { title: string; content: string } }>(
    "/createPost",
    createPost
  );
  server.put<
    { Params: { id: string } },
    { Body: { firstName: string; lastName: string; age: number } }
  >("/updateUser/:id", updateUser);

  server.delete<{ Params: { name: string } }>("/deleteUser/:name", deleteUser);
};
