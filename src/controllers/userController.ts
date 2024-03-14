import { FastifyRequest, FastifyReply } from "fastify";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
const jwt = require("jsonwebtoken");

type UserSignUpDataType = {
  Username: string;
  Email: string;
  Password: string;
};

type UserloginDataType = {
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
      const newUser = await User.create({
        userName: Username,
        email: Email,
        password: hashedPassword,
      });
      const newUserId: mongoose.Types.ObjectId = newUser._id;
      const stringNewUserId = newUserId.toString();
      // json web token creating
      const token = await jwt.sign(
        { id: stringNewUserId },
        process.env.SECRET_KEY,
        {
          expiresIn: "1hr",
        }
      );
      // cookie
      const options = {
        expiresIn: new Date(Date.now() + 1 * 60 * 60),
        httpOnly: true,
      };
      return reply
        .code(201)
        .cookie("token", token, options)
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
    const { Email, Password } = req.body as UserloginDataType;
    if (!(Email && Password)) {
      return reply
        .code(400)
        .send({ success: false, message: "All fields are compulsorry!" });
    }

    // finding user from the mongodb
    const user = await User.findOne({ email: Email });
    if (!user) {
      return reply
        .code(404)
        .send({ success: false, message: "User Not Found!" });
    } else {
      // Password Matching
      const passwordMatch = await bcrypt.compare(Password, user.password);
      if (!passwordMatch) {
        return reply
          .code(401)
          .send({ success: false, message: "Authentication Failed!" });
      } else {
        const newUserId: mongoose.Types.ObjectId = user._id;
        const stringUserId = newUserId.toString();

        // json web token creating
        const token = await jwt.sign(
          { id: stringUserId },
          process.env.SECRET_KEY,
          {
            expiresIn: "1hr",
          }
        );
        reply.header("Authorization", `Bearer ${token}`);
        return reply
          .code(200)
          .send({ success: true, message: "Signed in Succesfully" });
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
    reply.code(500).send({
      success: false,
      message: `An error occurred while user login! ${error}`,
    });
  }
}
