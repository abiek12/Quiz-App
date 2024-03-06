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
  .catch((err: Error) => {
    console.log(err);
  });

const PORT = process.env.PORT || 3000;

// Starting server
try {
  app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
  });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
