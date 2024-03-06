"use strict";
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    else {
        console.log(`Server listening at ${address}`);
    }
});
