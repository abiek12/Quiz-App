import mongoose from "mongoose";
import { Document, Schema, Model } from "mongoose";

interface CategoryScore {
  category: string;
  score: number;
}

interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  categoryScores: CategoryScore[];
}

const categoryScoreSchema = new Schema<CategoryScore>({
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

const userSchema = new Schema({
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

const User = mongoose.model("users", userSchema);
