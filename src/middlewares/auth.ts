import { FastifyReply, FastifyRequest } from "fastify";
const jwt = require("jsonwebtoken");

interface CustomRequest extends FastifyRequest {
  user?: any;
}

export async function auth(req: CustomRequest, reply: FastifyReply) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return reply.code(401).send({
        success: true,
        message: "Authentication failed you have to login!",
      });
    } else {
      const decode = await jwt.verify(token, process.env.SECRET_KEY);
      if (!decode) {
        return reply
          .code(403)
          .send({ success: true, message: "Invalid token!" });
      } else {
        req.user = decode;
        return;
      }
    }
  } catch (error) {
    reply.code(500).send({
      success: false,
      message: error,
    });
  }
}
