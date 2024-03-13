import { FastifyReply, FastifyRequest } from "fastify";
import Quiz from "../models/quizModel";
import Quest from "../models/questionModel";
import mongoose from "mongoose";
import User from "../models/userModel";

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
      _id: mongoose.Types.ObjectId;
      question: string;
      options: string[];
      answer: string;
    }
  ];
};

type ParamsType = {
  id: string;
};

type AnswerSubmitType = {
  UserId: mongoose.Types.ObjectId;
  QuestionId: mongoose.Types.ObjectId;
  SelectedOption: string;
};

type UserType = {
  userName: string;
  email: string;
  password: string;
  attendedCategoryDetail: string[];
};

// Upload Questions handler
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
        questions: [],
      });
      const questionDetails = await Quest.create({
        question: Question,
        options: Options,
        answer: Answer,
      });
      await Quiz.updateOne(
        { category: Category },
        { $push: { questions: questionDetails._id } }
      );
      return reply
        .code(200)
        .send({ success: true, message: "Quiz uploaded successfully" });
    } else {
      // checking incoming question is already exist
      const existingQuestion: QuizDocument | null = await Quest.findOne({
        question: Question,
      });
      if (existingQuestion) {
        return reply
          .code(403)
          .send({ success: false, message: "Question already Exist!" });
      }
      // pushing new questions to corresponding category
      const questionDetails = await Quest.create({
        question: Question,
        options: Options,
        answer: Answer,
      });
      await Quiz.updateOne(
        { category: existngCategory.category },
        { $push: { questions: questionDetails._id } }
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

// Get All Category Handlers
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

// Get all Questions Handler
export async function getQuestions(
  req: FastifyRequest<{ Params: ParamsType }>,
  reply: FastifyReply
) {
  try {
    // Converting the id from params into object id
    const categoryId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      req.params.id
    );
    // Retrieving questions based on the category id by populating
    const questionDetail: QuizDocument | null = await Quiz.findById({
      _id: categoryId,
    }).populate("questions");
    return reply.code(200).send({ success: true, questionDetail });
  } catch (error) {
    console.error("An error occurred:", error);
    reply.code(500).send({
      success: false,
      message: "An error occurred while fetching questions!",
    });
  }
}

// Submit Answer handler
export async function submitAnswer(
  req: FastifyRequest<{ Params: ParamsType }>,
  reply: FastifyReply
) {
  try {
    let { UserId, QuestionId, SelectedOption } = req.body as AnswerSubmitType;
    const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(UserId);
    const questId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      QuestionId
    );
    const catId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      req.params.id
    );
    // Initialzing isCorrect as false
    let isCorrect: boolean = false;
    SelectedOption = SelectedOption.toLowerCase();
    // Retrieve the answerData based on the category ID
    const answerData: QuizDocument | null = await Quiz.findById(catId).populate(
      "questions"
    );
    const questStringId = questId.toString();
    if (answerData) {
      // Find the matched question in the answerData
      const matchedQuestion = answerData.questions.find(
        (questions) => questions._id.toString() === questStringId
      );

      if (matchedQuestion) {
        // Check if the submitted answer matches the correct answer for the matched question
        const correctAnswer: string = matchedQuestion.answer;
        // Comparing the selected option and correct answer
        isCorrect = SelectedOption === correctAnswer;
      } else {
        // If no matching question is found, send an appropriate error response
        return reply.code(404).send({
          success: false,
          message: "Question not found/Incorrect!",
        });
      }
    } else {
      // If no matching category is found, send an appropriate error response
      return reply.code(404).send({
        success: false,
        message: "Category not found/Incorrect!",
      });
    }
    const response = await updateUser(
      userId,
      catId,
      questId,
      SelectedOption,
      isCorrect
    );
    return reply.send(response);
  } catch (error) {
    console.error("An error occurred:", error);
    reply.code(500).send({
      success: false,
      message: `An error occurred while submitting answer!, ${error}`,
    });
  }
}

async function updateUser(
  userId: mongoose.Types.ObjectId,
  catId: mongoose.Types.ObjectId,
  questId: mongoose.Types.ObjectId,
  SelectedOption: string,
  isCorrect: boolean
) {
  let Score = 0;
  // Retriving user from user collection
  const user: UserType | null = await User.findOne({ _id: userId });
  if (user != null) {
    // Checking if the user already attended the question
    if (user.attendedCategoryDetail.length !== 0) {
      const matchedQuestion = await User.findOne({
        _id: userId,
        "attendedCategoryDetail.attendedQuestions.questionId": questId,
      });

      if (matchedQuestion) {
        return "You have already attended this question!";
      } else {
        // Retriving existing score from the db
        const userCatScore = await User.findOne(
          { _id: userId, "attendedCategoryDetail.categoryId": catId },
          { "attendedCategoryDetail.score": 1 }
        );
        // updating the score
        if (userCatScore !== null) {
          Score = userCatScore.attendedCategoryDetail[0].score;
          isCorrect ? Score++ : Score;
        }
        // Updating the user document with new data
        await User.findByIdAndUpdate(
          {
            _id: userId,
            "attendedCategoryDetail.categoryId": catId,
          },
          {
            $push: {
              "attendedCategoryDetail.$[category].attendedQuestions": [
                {
                  questionId: questId,
                  selectedOption: SelectedOption,
                },
              ],
            },
            $set: {
              "attendedCategoryDetail.$[category].score": Score,
            },
          },
          {
            arrayFilters: [{ "category.categoryId": catId }],
            new: true, // Return the modified document
          }
        );
        return isCorrect;
      }
    } else {
      //Updating Score for the first time
      isCorrect ? Score++ : Score;
      console.log(Score);
      await User.findByIdAndUpdate(
        { _id: userId },
        {
          $push: {
            attendedCategoryDetail: [
              {
                categoryId: catId,
                attendedQuestions: [
                  {
                    questionId: questId,
                    selectedOption: SelectedOption,
                  },
                ],
                score: Score,
              },
            ],
          },
        }
      );
      return isCorrect;
    }
  } else {
    return "Unautherised!";
  }
}
