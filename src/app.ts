import { FastifyInstance } from "fastify";
import routes from "./routes/routes";
import fastifyCookie from "@fastify/cookie";
import type { FastifyCookieOptions } from "@fastify/cookie";
const fastify = require("fastify");
const mongoose = require("mongoose");

require("dotenv").config();
const db_url: string | undefined = process.env.DB_URI;

const app: FastifyInstance = fastify({
  logger: true,
});

// Connection
mongoose
  .connect(db_url)
  .then(() => {
    console.log("Successfully connected to mongoDB");
  })
  .catch((err: Error) => {
    console.log(err);
  });

// Plugins
app.register(require("@fastify/formbody"));

app.register(fastifyCookie, {
  secret: process.env.SECRET_KEY, // for cookies signature
  parseOptions: {}, // options for parsing cookies
} as FastifyCookieOptions);
// Routes
app.register(routes, { prefix: "/api/quiz" });

const PORT: string | number = process.env.PORT || 3000;

// Starting server
try {
  app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
  });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
