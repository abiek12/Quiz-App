import mongoose from "mongoose";
import { Document, Schema, Model } from "mongoose";

interface Questions extends Document {
  question: string;
  options: string[];
  answer: string;
}

const questionSchema: Schema<Questions> = new mongoose.Schema({
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

const Quest: Model<Questions> = mongoose.model<Questions>(
  "question",
  questionSchema
);
export default Quest;
