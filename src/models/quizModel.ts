import mongoose from "mongoose";
import { Document, Schema, Model } from "mongoose";

interface Questions {
  question: string;
  options: string[];
  answer: string;
}

interface quizDocument extends Document {
  category: string;
  questions: Questions[];
}

const quizSchema: Schema<quizDocument> = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Please provide category!"],
  },
  questions: [
    {
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
    },
  ],
});

const Quiz: Model<quizDocument> = mongoose.model<quizDocument>(
  "quiz",
  quizSchema
);
export default Quiz;
