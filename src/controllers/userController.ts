import { FastifyReply, FastifyRequest } from "fastify";
import Quiz from "../models/quizModel";
import mongoose from "mongoose";

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

type questionsType = {
  question: string;
  options: string[];
  answer: string;
};

type paramsType = {
  id: string;
};

export async function uploadQuestions(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    let { Category, Question, Options, Answer } = req.body as incomingData;
    // Checking all data is there
    if (!(Category && Question && Options && Answer)) {
      return reply
        .code(400)
        .send({ success: false, message: "All Fields are compulsory!" });
    }
    // Converting all data to lowercase
    Category = Category.toLowerCase();
    Question = Question.toLowerCase();
    Options = Options.map((option) => option.toLowerCase());
    Answer = Answer.toLowerCase();
    // checking incoming question category allready exist
    const existngCategory: quizDocument | null = await Quiz.findOne({
      category: Category,
    });
    // Creating a new category
    if (existngCategory == null) {
      await Quiz.create({
        category: Category,
        questions: [{ question: Question, options: Options, answer: Answer }],
      });
      return reply
        .code(200)
        .send({ success: true, message: "Quiz uploaded successfully" });
    } else {
      // checking incoming question is already exist
      const existingQuestion: quizDocument | null = await Quiz.findOne({
        questions: { $elemMatch: { question: Question } },
      });
      if (existingQuestion) {
        return reply
          .code(403)
          .send({ success: false, message: "Question already Exist!" });
      }
      // pushing new questions to corresponding category
      await Quiz.updateOne(
        { category: existngCategory.category },
        {
          $push: {
            questions: [
              { question: Question, options: Options, answer: Answer },
            ],
          },
        }
      );
      return reply.code(200).send({
        success: true,
        message: `Question added to ${existngCategory.category} Category successfully`,
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    reply.code(500).send({
      success: false,
      message: "An error occurred while uploading the quiz",
    });
  }
}

export async function getAllQuizCategories(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const categories = await Quiz.find({}, { category: 1 });
    return reply.code(200).send({ success: true, categories });
  } catch (error) {
    console.error("An error occurred:", error);
    reply.code(500).send({
      success: false,
      message: "An error occurred while fetching categories",
    });
  }
}

export async function getQuestions(
  req: FastifyRequest<{ Params: paramsType }>,
  reply: FastifyReply
) {
  try {
    const categoryId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      req.params.id
    );
    const questions: questionsType | null = await Quiz.findById(
      {
        _id: categoryId,
      },
      { questions: 1 }
    );
    console.log(questions);
  } catch (error) {
    console.error("An error occurred:", error);
    reply.code(500).send({
      success: false,
      message: `An error occurred while fetching questions! ${error}`,
    });
  }
}
export async function submitAnswer(req: FastifyRequest, reply: FastifyReply) {}
