"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("./routes/routes"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const fastify = require("fastify");
const mongoose = require("mongoose");
require("dotenv").config();
const db_url = process.env.DB_URI;
const app = fastify({
    logger: true,
});
// Connection
mongoose
    .connect(db_url)
    .then(() => {
    console.log("Successfully connected to mongoDB");
})
    .catch((err) => {
    console.log(err);
});
// Plugins
app.register(cookie_1.default);
// Routes
app.register(routes_1.default, { prefix: "/api/quiz" });
const PORT = process.env.PORT || 3000;
// Starting server
try {
    app.listen(PORT, () => {
        console.log(`Server running at ${PORT}`);
    });
}
catch (error) {
    app.log.error(error);
    process.exit(1);
}
