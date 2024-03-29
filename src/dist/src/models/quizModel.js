"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const questionModel_1 = __importDefault(require("./questionModel"));
const quizSchema = new mongoose_1.default.Schema({
    category: {
        type: String,
        required: true,
    },
    questions: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: questionModel_1.default,
        required: true,
    },
});
const Quiz = mongoose_1.default.model("quiz", quizSchema);
exports.default = Quiz;
