import mongoose from "mongoose";
import { Document, Schema, Model } from "mongoose";

interface Questions {
  question: string;
  options: String[];
  answer: string;
}

interface quizDocument extends Document {
  category: string;
  questions: Questions[];
}

const quizSchema: Schema<quizDocument> = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [String],
      answer: {
        type: String,
        required: true,
      },
    },
  ],
});

const Quiz: Model<quizDocument> = mongoose.model<quizDocument>(
  "quiz",
  quizSchema
);
export default Quiz;
