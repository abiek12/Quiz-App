"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("./routes/routes"));
const fastify = require("fastify");
const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_URI = process.env.DB_URI;
const app = fastify({
    logger: true,
});
// Connection
mongoose
    .connect(MONGODB_URI)
    .then(() => {
    console.log("Successfully connected to mongoDB");
})
    .catch((err) => {
    console.log(err);
});
// Plugins
app.register(require("@fastify/formbody"));
// Routes
app.register(routes_1.default, { prefix: "/quiz" });
// const PORT: string | number = process.env.PORT || 3000;
// Starting server
try {
    app.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
    });
}
catch (error) {
    app.log.error(error);
    process.exit(1);
}
// export default app;
