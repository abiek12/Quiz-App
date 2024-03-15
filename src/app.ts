import { FastifyError, FastifyInstance } from "fastify";
import routes from "./routes/routes";
const fastify = require("fastify");
const mongoose = require("mongoose");

require("dotenv").config();
const MONGODB_URI = process.env.DB_URI as string;

const app: FastifyInstance = fastify({
  logger: true,
});

// Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Successfully connected to mongoDB");
  })
  .catch((err: Error) => {
    console.log(err);
  });

// Plugins
app.register(require("@fastify/formbody"));

// Routes
app.register(routes, { prefix: "/quiz" });

const PORT: string | number = process.env.PORT || 3000;

// Starting server
try {
  fastify.listen(
    { port: 3000, host: "0.0.0.0" },
    (err: FastifyError, address: any) => {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
    }
  );
} catch (error) {
  app.log.error(error);
  process.exit(1);
}

// export default app;
