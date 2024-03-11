import { FastifyInstance } from "fastify";
import {
  uploadQuestions,
  getAllQuizCategories,
  getQuestions,
  submitAnswer,
} from "../controllers/quizController";
import { signUp, login } from "../controllers/userController";
async function routes(app: FastifyInstance) {
  // Upload Questions
  app.post("/upload", uploadQuestions);
  // User Signup
  app.post("/signup", signUp);
  // User Login
  app.post("/login", login);
  // Get all quizes
  app.get("/", getAllQuizCategories);
  // Participate a quiz
  app.get("/:id", getQuestions);
  // submit quizes
  app.post("/submit/:id", submitAnswer);
}

export default routes;
