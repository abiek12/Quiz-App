import { FastifyReply, FastifyRequest } from "fastify";
const jwt = require("jsonwebtoken");

export async function auth(req: FastifyRequest, reply: FastifyReply) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return reply
      .code(401)
      .send({ success: true, message: "You have to login!" });
  } else {
    try {
      const decode = await jwt.verify(token, process.env.SECRET_KEY);
      if (!decode) {
        return reply
          .code(403)
          .send({ success: true, message: "You have to login!" });
      } else {
        // req.user = decode;
        return;
      }
    } catch (error) {
      console.log(error);
      reply.code(500).send({
        success: false,
        message: error,
      });
    }
  }
}
