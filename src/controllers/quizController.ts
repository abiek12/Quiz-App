import { FastifyReply, FastifyRequest } from "fastify";
import Quiz from "../models/quizModel";
import mongoose from "mongoose";

type IncomingData = {
  Category: string;
  Question: string;
  Options: string[];
  Answer: string;
};

type QuizDocument = {
  category: string;
  questions: [
    {
      question: string;
      options: string[];
      answer: string;
    }
  ];
};

type QuestionsType = {
  question: string;
  options: string[];
  answer: string;
};

type ParamsType = {
  id: string;
};

type AnswerSubmitType = {
  Question: string;
  SelectedOption: string;
};

export async function uploadQuestions(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    let { Category, Question, Options, Answer } = req.body as IncomingData;
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
    const existngCategory: QuizDocument | null = await Quiz.findOne({
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
      const existingQuestion: QuizDocument | null = await Quiz.findOne({
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
    // Retreiving categories from the db
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
  req: FastifyRequest<{ Params: ParamsType }>,
  reply: FastifyReply
) {
  try {
    // Converting the id from params into object id
    const categoryId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      req.params.id
    );
    // Retrieving questions based on the category id
    const questions: QuestionsType | null = await Quiz.findById(
      {
        _id: categoryId,
      },
      { questions: 1 }
    );
    reply.code(200).send({ success: true, questions });
  } catch (error) {
    console.error("An error occurred:", error);
    reply.code(500).send({
      success: false,
      message: "An error occurred while fetching questions!",
    });
  }
}
export async function submitAnswer(
  req: FastifyRequest<{ Params: ParamsType }>,
  reply: FastifyReply
) {
  try {
    let { Question, SelectedOption } = req.body as AnswerSubmitType;
    Question = Question.toLowerCase();
    SelectedOption = SelectedOption.toLowerCase();
    // Converting the id from params into object id
    const categoryId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      req.params.id
    );
    // Retrieve the answerData based on the category ID
    const answerData: QuizDocument | null = await Quiz.findById(categoryId);
    if (answerData) {
      // Find the matched question in the answerData
      const matchedQuestion = answerData.questions.find(
        (questions) => questions.question === Question
      );
      if (matchedQuestion) {
        // Check if the submitted answer matches the correct answer for the matched question
        const correctAnswer: string = matchedQuestion.answer;
        // Comparing the selected option and correct answer
        const isCorrect: boolean = SelectedOption === correctAnswer;
        reply.code(200).send({ isCorrect });
      } else {
        // If no matching question is found, send an appropriate error response
        reply
          .code(404)
          .send({ success: false, message: "Question not found/Incorrect!" });
      }
    } else {
      // If no matching category is found, send an appropriate error response
      reply
        .code(404)
        .send({ success: false, message: "Category not found/Incorrect!" });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    reply.code(500).send({
      success: false,
      message: `An error occurred while submitting answer!, ${error}`,
    });
  }
}
