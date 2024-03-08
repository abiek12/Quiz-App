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
exports.submitAnswer = exports.getQuestions = exports.getAllQuizes = exports.uploadQuestions = void 0;
const quizModel_1 = __importDefault(require("../models/quizModel"));
function uploadQuestions(req, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { Category, Question, Options, Answer } = req.body;
            if (!(Category && Question && Options && Answer)) {
                return reply
                    .code(400)
                    .send({ success: false, message: "All Fields are compulsory!" });
            }
            const existngCategory = yield quizModel_1.default.findOne({
                category: Category,
            });
            if (existngCategory == null) {
                yield quizModel_1.default.create({
                    category: Category,
                    questions: [{ question: Question, options: Options, answer: Answer }],
                });
                return reply
                    .code(200)
                    .send({ success: true, message: "Quiz uploaded successfully" });
            }
            else {
                const existingQuestion = yield quizModel_1.default.findOne({
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
        }
        catch (error) {
            console.error("An error occurred:", error);
            reply
                .code(500)
                .send({
                success: false,
                message: "An error occurred while uploading the quiz",
            });
        }
    });
}
exports.uploadQuestions = uploadQuestions;
function getAllQuizes(req, reply) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.getAllQuizes = getAllQuizes;
function getQuestions(req, reply) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.getQuestions = getQuestions;
function submitAnswer(req, reply) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.submitAnswer = submitAnswer;
