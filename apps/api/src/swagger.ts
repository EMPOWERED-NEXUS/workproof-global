import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "WorkProof Global API",
      version: "1.0.0",
      description:
        "Worker-owned proof-of-work platform API. Verified Work Receipt lifecycle with customer confirmation.",
    },
    servers: [{ url: "http://localhost:4000", description: "Local development" }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "workproof_token",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errors: { type: "object", additionalProperties: { type: "array", items: { type: "string" } } },
          },
        },
      },
    },
    tags: [
      { name: "Auth" },
      { name: "Profile" },
      { name: "Receipts" },
      { name: "Verification" },
      { name: "Public" },
      { name: "Dashboard" },
      { name: "Admin" },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/swagger.docs.ts"],
});
