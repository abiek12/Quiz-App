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
      replay
        .code(400)
        .send({ success: false, message: "All Fields are compulsory!" });
    }
    const existngCategory: quizDocument | null = await Quiz.findOne({
      category: Category,
    });

    if (existngCategory == null) {
      await Quiz.create({
        category: Category,
        questions: [{ question: Question, options: Options, answer: Answer }],
      });
      replay
        .code(200)
        .send({ success: true, message: "Quiz uploaded successfully" });
    } else {
      const existingQuestion: quizDocument | null = await Quiz.findOne({
        questions: { $elemMatch: { question: Question } },
      });
      if (existingQuestion) {
        replay
          .code(403)
          .send({ success: false, message: "Question already Exist!" });
      }
      // await existngCategory?.questions.push(...[{ Question, Options, Answer }]);
      replay.code(200).send({
        success: true,
        message: `Question added to ${existingQuestion?.category} successfully`,
      });
    }
  } catch (error) {}
}
export async function getAllQuizes(req: FastifyRequest, replay: FastifyReply) {}
export async function getQuestions(req: FastifyRequest, replay: FastifyReply) {}
export async function submitAnswer(req: FastifyRequest, replay: FastifyReply) {}
