import { FastifyReply, FastifyRequest } from "fastify";
import Quiz from "../models/quizModel";

export async function uploadQuestions(
  req: FastifyRequest,
  reply: FastifyReply
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
      return reply
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
      return reply
        .code(200)
        .send({ success: true, message: "Quiz uploaded successfully" });
    } else {
      const existingQuestion: quizDocument | null = await Quiz.findOne({
        questions: { $elemMatch: { question: Question } },
      });
      if (existingQuestion) {
        return reply
          .code(403)
          .send({ success: false, message: "Question already Exist!" });
      }
      // await existngCategory?.questions.push(...[{ Question, Options, Answer }]);
      return reply.code(200).send({
        success: true,
        message: `Question added to ${existngCategory.category} Category successfully`,
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    reply
      .code(500)
      .send({
        success: false,
        message: "An error occurred while uploading the quiz",
      });
  }
}
export async function getAllQuizes(req: FastifyRequest, reply: FastifyReply) {}
export async function getQuestions(req: FastifyRequest, reply: FastifyReply) {}
export async function submitAnswer(req: FastifyRequest, reply: FastifyReply) {}
