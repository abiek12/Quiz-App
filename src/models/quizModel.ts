import mongoose, { ObjectId } from "mongoose";
import { Document, Schema, Model } from "mongoose";
import Quest from "./questionModel";

interface QuizDocument extends Document {
  category: string;
  questions: ObjectId;
}

const quizSchema: Schema<QuizDocument> = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Please provide category!"],
  },
  questions: {
    type: mongoose.Types.ObjectId,
    ref: "Quest",
    required: true,
  },
});

const Quiz: Model<QuizDocument> = mongoose.model<QuizDocument>(
  "quiz",
  quizSchema
);
export default Quiz;
