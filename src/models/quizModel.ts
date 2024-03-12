import mongoose from "mongoose";
import { Document, Schema, Model } from "mongoose";
import Quest from "./questionModel";

interface QuizDocument extends Document {
  category: string;
  questions: mongoose.Types.ObjectId[];
}

const quizSchema: Schema<QuizDocument> = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  questions: {
    type: [mongoose.Types.ObjectId],
    ref: Quest,
    required: true,
  },
});

const Quiz: Model<QuizDocument> = mongoose.model<QuizDocument>(
  "quiz",
  quizSchema
);
export default Quiz;
