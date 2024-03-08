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
const userController_1 = require("../controllers/userController");
function routes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        // Upload Questions
        app.post("/upload", userController_1.uploadQuestions);
        // Get all quizes
        app.get("/", userController_1.getAllQuizCategories);
        // Participate a quiz
        app.post("/:id", userController_1.getQuestions);
        // submit quizes
        app.post("/:id/submit", userController_1.submitAnswer);
    });
}
exports.default = routes;
