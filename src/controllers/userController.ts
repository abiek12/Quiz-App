import { FastifyReply, FastifyRequest } from "fastify";
import Quiz from "../models/quizModel";

export async function uploadQuestions(
  req: FastifyRequest,
  replay: FastifyReply
) {
  try {
    type incomingData = {
      Category: string;
      Question: string;
      Options: string[];
      Answer: string;
    };

    type quizDocument = {
      category: string;
      questions: [
        {
          question: string;
          options: string[];
          answer: string;
        }
      ];
    };

    const { Category, Question, Options, Answer } = req.body as incomingData;
    if (!(Category && Question && Options && Answer)) {
      replay.code(400).send("All Fields are compulsory!");
    }
    const existngCategory: quizDocument | null = await Quiz.findOne({
      category: Category,
    });

    if (existngCategory == null) {        
      await Quiz.create({
        category: Category,
        questions: [{ question: Question, options: Options, answer: Answer }],
      });
      replay.code(200).send("Uploaded successfully");
    } else {
      //   await existngCategory?.questions.push(...[{ Question, Options, Answer }]);
      replay.code(200).send("Question added successfully");
    }
  } catch (error) {}
}
export async function getAllQuizes(req: FastifyRequest, replay: FastifyReply) {}
export async function getQuestions(req: FastifyRequest, replay: FastifyReply) {}
export async function submitAnswer(req: FastifyRequest, replay: FastifyReply) {}
