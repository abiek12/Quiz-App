import { FastifyRequest, FastifyReply } from "fastify";
import User from "../models/userModel";
import bcrypt from "bcrypt";

type UserSignUpDataType = {
  Username?: string;
  Email: string;
  Password: string;
};

export async function signUp(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { Username, Email, Password } = req.body as UserSignUpDataType;
    if (!(Username && Email && Password)) {
      return reply
        .code(400)
        .send({ success: false, message: "All fields are compulsorry!" });
    }
    const existingUser = await User.findOne({ email: Email });
    if (existingUser) {
      return reply
        .code(403)
        .send({ success: false, message: "User Already Exist!" });
    } else {
      const hashedPassword = await bcrypt.hash(Password, 10);
      await User.create({
        userName: Username,
        email: Email,
        password: hashedPassword,
      });
      return reply
        .code(201)
        .send({ success: true, message: "User created succesfully" });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    reply.code(500).send({
      success: false,
      message: "An error occurred while user signup!",
    });
  }
}

export async function login(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { Email, Password } = req.body as UserSignUpDataType;
    if (!(Email && Password)) {
      return reply
        .code(400)
        .send({ success: false, message: "All fields are compulsorry!" });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    reply.code(500).send({
      success: false,
      message: "An error occurred while user login!",
    });
  }
}
