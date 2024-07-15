import "reflect-metadata";
import Fastify, { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySocket from "fastify-socket.io";
import { Server as SocketIOServer } from "socket.io";

import { app } from "./src/bootstrap";
import { companyRoutes, paymentRoutes, userRoutes } from "./src/routes";
import "./workers/bullWorker";
import "./workers/rabbitWorker";
import "./workers/kafkaConsumer";

const fastify: FastifyInstance = Fastify({});

declare module "fastify" {
  interface FastifyInstance {
    io: SocketIOServer;
  }
}

// This will log incoming requests
fastify.addHook("onRequest", async (request, reply) => {
  // console.log(`${request.method} ${request.url} ${request.body}`);
});

fastify.register(fastifyCors, {
  origin: "*", // Adjust according to your security needs
});
fastify.register(fastifySocket);

const preHandler = async (req: any, reply: any) => {
  req.user = { pong: "Hi Fastify Server is Up!" };
};

const pong = async (req, reply) => {
  return { pong: req.user.pong };
};

paymentRoutes(fastify);
companyRoutes(fastify);
userRoutes(fastify);

fastify.get("/ping", { preHandler }, pong);

fastify.ready((err) => {
  if (err) throw err;

  fastify.io.on("connection", (socket) => {
    console.log("Client connected");

    let count = 0;
    socket.on("customEvent", (data) => {
      setTimeout(() => {
        socket.emit(
          "messageFromServer1",
          `Hello from Fastify server! Count: ${count}`
        );
        count++;
      }, 3000);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
});

const start = async () => {
  try {
    await app();

    await fastify.listen({ port: 3000 });

    const address: any = fastify.server.address();
    const port = address.port;
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    console.log(err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
