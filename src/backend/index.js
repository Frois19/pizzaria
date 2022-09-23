const express = require("express");
require("express-async-errors");
const cors = require("cors");
require("dotenv").config();

// Create express instance
const app = express();

// Require API routes
const routes = require("./routes");
const AppError = require("./errors/AppError");
const db = require("./database");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import API Routes
app.use("/api", routes);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Pizzaria application API!" });
});

db.connect()
    .then(() => {
        // eslint-disable-next-line no-unused-vars
        app.use(function (erro, request, response, next) {
            // AppError
            if (erro instanceof AppError) {
                return response.status(erro.statusCode).json({
                    message: erro.message,
                    error: erro.error,
                });
            }

            // Unknown error
            if (process.env.APP_DEBUG) {
                return response.status(500).json({
                    status: "Error",
                    message: erro.message,
                    stack: erro.stack,
                });
            } else {
                return response.status(500).json({
                    status: "Error",
                    message: `Internal server error`,
                });
            }
        });

        // Start standalone server if directly running
        if (require.main === module) {
            const port = process.env.NODE_PUBLIC_PORT || 3001;
            app.listen(port, () => {
                console.log(
                    `API server on ---> http://${process.env.NODE_APP_HOST}:${port}`
                );
            });
        }
    })
    .catch((error) => {
        console.log(error);
    });
