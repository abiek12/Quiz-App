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
Object.defineProperty(exports, "__esModule", { value: true });
const quizController_1 = require("../controllers/quizController");
const userController_1 = require("../controllers/userController");
function routes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        // Upload Questions
        app.post("/upload", quizController_1.uploadQuestions);
        // User Signup
        app.post("/user/signup", userController_1.signUp);
        // User Login
        app.post("/user/login", userController_1.login);
        // Get all quizes
        app.get("/", quizController_1.getAllQuizCategories);
        // Participate a quiz
        app.get("/:id", quizController_1.getQuestions);
        // submit quizes
        app.post("/submit/:id", quizController_1.submitAnswer);
    });
}
exports.default = routes;
