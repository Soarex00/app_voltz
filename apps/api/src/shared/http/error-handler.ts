import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";

import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";

export function registerErrorHandler(app: FastifyInstance) {
  app.setNotFoundHandler((request, reply) => {
    return reply.status(404).send({
      error: {
        code: "ROUTE_NOT_FOUND",
        message: "Route not found",
        requestId: request.id
      }
    });
  });

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
          requestId: request.id
        }
      });
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request data",
          details: error.flatten(),
          requestId: request.id
        }
      });
    }

    request.log.error(error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return reply.status(500).send({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: env.NODE_ENV === "production" ? "Internal server error" : message,
        requestId: request.id
      }
    });
  });
}
