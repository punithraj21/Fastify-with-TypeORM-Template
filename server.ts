import "reflect-metadata";
import Fastify, { FastifyInstance } from "fastify";

import { app } from "./src/bootstrap";
import { companyRoutes, userRoutes } from "./src/routes";

const server: FastifyInstance = Fastify({});

const preHandler = async (req: any, reply: any) => {
  req.user = { pong: "Hi Fastify Server is Up!" };
};

const pong = async (req, reply) => {
  return { pong: req.user.pong };
};

companyRoutes(server);
userRoutes(server);

server.get("/ping", { preHandler }, pong);

const start = async () => {
  try {
    await app();
    await server.listen({ port: 3000 });

    const address: any = server.server.address();
    const port = address.port;
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }
};

start();
