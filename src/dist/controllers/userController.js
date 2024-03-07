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
function uploadQuestions(req, replay) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { Category, Question, Options, Answer } = req.body;
            if (!(Category && Question && Options && Answer)) {
                replay.code(400).send("All Fields are compulsory!");
            }
            const existngCategory = yield quizModel_1.default.findOne({
                category: Category,
            });
            if (typeof existngCategory == null) {
                yield quizModel_1.default.create({
                    category: Category,
                    questions: [{ question: Question, options: Options, answer: Answer }],
                });
                replay.code(200).send("Succesfully uploaded");
            }
        }
        catch (error) { }
    });
}
exports.uploadQuestions = uploadQuestions;
function getAllQuizes(req, replay) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.getAllQuizes = getAllQuizes;
function getQuestions(req, replay) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.getQuestions = getQuestions;
function submitAnswer(req, replay) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.submitAnswer = submitAnswer;
