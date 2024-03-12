"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitAnswer = exports.getQuestions = exports.getAllQuizCategories = exports.uploadQuestions = void 0;
const quizModel_1 = __importDefault(require("../models/quizModel"));
const questionModel_1 = __importDefault(require("../models/questionModel"));
const mongoose_1 = __importDefault(require("mongoose"));
function uploadQuestions(req, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { Category, Question, Options, Answer } = req.body;
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
            const existngCategory = yield quizModel_1.default.findOne({
                category: Category,
            });
            // Creating a new category
            if (existngCategory == null) {
                yield quizModel_1.default.create({
                    category: Category,
                    questions: [],
                });
                const questionId = yield questionModel_1.default.create({
                    question: Question,
                    options: Options,
                    answer: Answer,
                });
                yield quizModel_1.default.updateOne({ category: Category }, { $push: { questions: questionId._id } });
                return reply
                    .code(200)
                    .send({ success: true, message: "Quiz uploaded successfully" });
            }
            else {
                // checking incoming question is already exist
                const existingQuestion = yield quizModel_1.default.findOne({
                    questions: { $elemMatch: { question: Question } },
                });
                if (existingQuestion) {
                    return reply
                        .code(403)
                        .send({ success: false, message: "Question already Exist!" });
                }
                // pushing new questions to corresponding category
                yield quizModel_1.default.updateOne({ category: existngCategory.category }, {
                    $push: {
                        questions: [
                            { question: Question, options: Options, answer: Answer },
                        ],
                    },
                });
                return reply.code(200).send({
                    success: true,
                    message: `Question added to ${existngCategory.category} Category successfully`,
                });
            }
        }
        catch (error) {
            console.error("An error occurred:", error);
            reply.code(500).send({
                success: false,
                message: "An error occurred while uploading the quiz",
            });
        }
    });
}
exports.uploadQuestions = uploadQuestions;
function getAllQuizCategories(req, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Retreiving categories from the db
            const categories = yield quizModel_1.default.find({}, { category: 1 });
            return reply.code(200).send({ success: true, categories });
        }
        catch (error) {
            console.error("An error occurred:", error);
            reply.code(500).send({
                success: false,
                message: "An error occurred while fetching categories",
            });
        }
    });
}
exports.getAllQuizCategories = getAllQuizCategories;
function getQuestions(req, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Converting the id from params into object id
            const categoryId = new mongoose_1.default.Types.ObjectId(req.params.id);
            // Retrieving questions based on the category id
            const questions = yield quizModel_1.default.findById({
                _id: categoryId,
            }, { questions: 1 });
            reply.code(200).send({ success: true, questions });
        }
        catch (error) {
            console.error("An error occurred:", error);
            reply.code(500).send({
                success: false,
                message: "An error occurred while fetching questions!",
            });
        }
    });
}
exports.getQuestions = getQuestions;
function submitAnswer(req, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { Question, SelectedOption } = req.body;
            Question = Question.toLowerCase();
            SelectedOption = SelectedOption.toLowerCase();
            // Converting the id from params into object id
            const categoryId = new mongoose_1.default.Types.ObjectId(req.params.id);
            // Retrieve the answerData based on the category ID
            const answerData = yield quizModel_1.default.findById(categoryId);
            if (answerData) {
                // Find the matched question in the answerData
                const matchedQuestion = answerData.questions.find((questions) => questions.question === Question);
                if (matchedQuestion) {
                    // Check if the submitted answer matches the correct answer for the matched question
                    const correctAnswer = matchedQuestion.answer;
                    // Comparing the selected option and correct answer
                    const isCorrect = SelectedOption === correctAnswer;
                    reply.code(200).send({ isCorrect });
                }
                else {
                    // If no matching question is found, send an appropriate error response
                    reply
                        .code(404)
                        .send({ success: false, message: "Question not found/Incorrect!" });
                }
            }
            else {
                // If no matching category is found, send an appropriate error response
                reply
                    .code(404)
                    .send({ success: false, message: "Category not found/Incorrect!" });
            }
        }
        catch (error) {
            console.error("An error occurred:", error);
            reply.code(500).send({
                success: false,
                message: `An error occurred while submitting answer!, ${error}`,
            });
        }
    });
}
exports.submitAnswer = submitAnswer;
