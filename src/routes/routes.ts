import { FastifyInstance } from "fastify";
import {
  uploadQuestions,
  getAllQuizCategories,
  getQuestions,
  submitAnswer,
} from "../controllers/quizController";
async function routes(app: FastifyInstance) {
  // Upload Questions
  app.post("/upload", uploadQuestions);
  // Get all quizes
  app.get("/", getAllQuizCategories);
  // Participate a quiz
  app.get("/:id", getQuestions);
  // submit quizes
  app.post("/:id/submit", submitAnswer);
}

export default routes;
