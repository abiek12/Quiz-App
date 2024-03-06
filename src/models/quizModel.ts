import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  questions: [
    {
      text: {
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

const QUIZ = mongoose.model("quiz", quizSchema);
export default QUIZ;
