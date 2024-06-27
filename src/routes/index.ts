import { FastifyInstance } from "fastify";

import { createCompany } from "../controllers/companyController";
import {
  createPost,
  createUser,
  deleteUser,
  getAllPosts,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userController";
import {
  createInvoice,
  getDashboardInvoices,
} from "../controllers/paymentController";

export const companyRoutes = async (server: FastifyInstance) => {
  server.post<{ Body: { Name: string; Address: string; Strength: number } }>(
    "/createCompany",
    createCompany
  );
};

export const paymentRoutes = async (server: FastifyInstance) => {
  server.post<{
    Body: {
      InvoiceNumber: string;
      TotalAmount: string;
      PaymentMethod: string;
      PaymentStatus: string;
    };
  }>("/createInvoice", createInvoice);
  server.get("/getDashboardInvoices", getDashboardInvoices);
};

export const userRoutes = async (server: FastifyInstance) => {
  server.get<{ Params: { id: string } }>("/user/:id", getUser);

  server.get("/users", getAllUsers);

  server.post<{
    Params: { id: number };
    Body: { page: number; pageSize: number };
  }>("/getAllPosts/:id", getAllPosts);

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
