import { FastifyInstance, RouteHandlerMethod } from "fastify";
import {
  uploadQuestions,
  getAllQuizCategories,
  getQuestions,
  submitAnswer,
} from "../controllers/quizController";
import { signUp, login } from "../controllers/userController";
import { auth } from "../middlewares/auth";
async function routes(app: FastifyInstance) {
  // Upload Questions
  app.post("/upload", uploadQuestions);
  // User Signup
  app.post("/user/signup", signUp);
  // User Login
  app.post("/user/login", login);
  // Get all quizes
  app.get("/", { preHandler: auth }, getAllQuizCategories);
  // Participate a quiz
  app.get("/:id", { preHandler: auth }, getQuestions as RouteHandlerMethod);
  // submit quizes
  app.post(
    "/submit/:id",
    { preHandler: auth },
    submitAnswer as RouteHandlerMethod
  );
}

export default routes;
