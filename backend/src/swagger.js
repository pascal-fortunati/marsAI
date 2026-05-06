import swaggerJSDoc from "swagger-jsdoc";

// Service pour créer la spécification OpenAPI à partir des commentaires JSDoc
export function createOpenApiSpec() {
  return swaggerJSDoc({
    definition: {
      openapi: "3.0.3",
      info: {
        title: "marsAI API",
        version: "0.1.0",
      },
    },
    apis: ["./src/routes/*.js"],
  });
}