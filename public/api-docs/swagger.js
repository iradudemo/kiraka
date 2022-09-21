const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "kiraka Platform api",
      version: "1.0.0",
      description:
        "kiraka-Platform API for kiraka Platform\n This API Will Manage:\n 1. Users Operations\n 2. User Authentication & Authorisation\n 3.Comments, Post & Announcements",
    },
    host: "kiraka-backend.herokuapp.com",

    paths: {},
    security: [
      {
        bearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          name: "bearerAuth",
          in: "header",
        },
      },
    },
  },
  apis: ["./**/*.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

module.exports = swaggerDocs;
