"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const questionSchema = new mongoose_1.default.Schema({
    question: {
        type: String,
        required: [true, "Please provide question!"],
    },
    options: {
        type: [String],
        required: [true, "Please provide options!"],
    },
    answer: {
        type: String,
        required: [true, "Please provide answer!"],
    },
});
const Quest = mongoose_1.default.model("question", questionSchema);
exports.default = Quest;
