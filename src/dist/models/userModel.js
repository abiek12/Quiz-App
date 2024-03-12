"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const questionModel_1 = __importDefault(require("./questionModel"));
const QuestionAndSelectedOptSchema = new mongoose_2.Schema({
    questionId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: questionModel_1.default,
        required: true,
    },
    selectedOption: {
        type: String,
        required: true,
    },
});
const categoryScoreSchema = new mongoose_2.Schema({
    attendedQuestions: [QuestionAndSelectedOptSchema],
    score: {
        type: Number,
        required: true,
        default: 0, // Default score of 0 for each category
    },
});
const userSchema = new mongoose_2.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    attendedCategoryDetail: [categoryScoreSchema],
});
const User = mongoose_1.default.model("users", userSchema);
exports.default = User;
