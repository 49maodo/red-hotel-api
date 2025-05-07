// swagger.js
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Red Hotel API",
            version: "1.0.0",
            description: "Documentation de l'API Red Hotel",
        },
        servers: [
            {
                url: "https://red-hotel-api.onrender.com", // adapte à ton URL réelle
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

module.exports = { swaggerUi, specs };