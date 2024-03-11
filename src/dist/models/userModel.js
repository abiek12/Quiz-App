"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const categoryScoreSchema = new mongoose_2.Schema({
    category: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
        default: 0, // Default score of 0 for each category
    },
});
const userSchema = new mongoose_2.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});
const User = mongoose_1.default.model("users", userSchema);
