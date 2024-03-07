import { FastifyReply, FastifyRequest } from "fastify";
import Quiz from "../models/quizModel";

export async function uploadQuestions(
  req: FastifyRequest,
  replay: FastifyReply
) {
  try {
    type quizData = {
      Category: String;
      Question: String;
      Options: String[];
      Answer: String;
    };
    const { Category, Question, Options, Answer } = req.body as quizData;
    if (!(Category && Question && Options && Answer)) {
      replay.code(400).send("All Fields are compulsory!");
    }
    const existngCategory: quizData | null = await Quiz.findOne({
      category: Category,
    });
    if (typeof existngCategory == null) {
      await Quiz.create({
        category: Category,
        questions: [{ question: Question, options: Options, answer: Answer }],
      });
      replay.code(200).send("Succesfully uploaded");
    }
  } catch (error) {}
}
export async function getAllQuizes(req: FastifyRequest, replay: FastifyReply) {}
export async function getQuestions(req: FastifyRequest, replay: FastifyReply) {}
export async function submitAnswer(req: FastifyRequest, replay: FastifyReply) {}
