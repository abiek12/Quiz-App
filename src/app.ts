import { FastifyInstance } from "fastify";
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
// try {
//   app.listen(PORT, () => {
//     console.log(`Server running at ${PORT}`);
//   });
// } catch (error) {
//   app.log.error(error);
//   process.exit(1);
// }

export default app;
