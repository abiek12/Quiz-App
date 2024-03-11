import mongoose from "mongoose";
import { Document, Schema, Model } from "mongoose";

interface CategoryScore {
  category: string;
  score: number;
}

interface UserDocument extends Document {
  userName: string;
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
