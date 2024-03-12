import mongoose, { ObjectId } from "mongoose";
import { Document, Schema, Model } from "mongoose";
import Quest from "./questionModel";

interface QuestionAndSelectedOpt {
  questionId: ObjectId;
  selectedOption: string;
}

interface CategoryScore {
  attendedQuestions: QuestionAndSelectedOpt[];
  score: number;
}

interface UserDocument extends Document {
  userName: string;
  email: string;
  password: string;
  categoryScores: CategoryScore[];
}

const QuestionAndSelectedOptSchema = new Schema<QuestionAndSelectedOpt>({
  questionId: {
    type: mongoose.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  selectedOption: {
    type: String,
    required: true,
  },
});

const categoryScoreSchema = new Schema<CategoryScore>({
  attendedQuestions: [QuestionAndSelectedOptSchema],
  score: {
    type: Number,
    required: true,
    default: 0, // Default score of 0 for each category
  },
});

const userSchema = new Schema<UserDocument>({
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
  categoryScores: [categoryScoreSchema],
});

const User = mongoose.model<UserDocument>("users", userSchema);
export default User;
