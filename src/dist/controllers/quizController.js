"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinalResult = exports.submitAnswer = exports.getQuestions = exports.getAllQuizCategories = exports.uploadQuestions = void 0;
const quizModel_1 = __importDefault(require("../models/quizModel"));
const questionModel_1 = __importDefault(require("../models/questionModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../models/userModel"));
//-----------------Upload Questions handler-----------------
function uploadQuestions(req, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { Category, Question, Options, Answer } = req.body;
            // Checking all data is there
            if (!(Category && Question && Options && Answer)) {
                return reply
                    .code(400)
                    .send({ success: false, message: "All Fields are compulsory!" });
            }
            // Converting all data to lowercase
            Category = Category.toLowerCase();
            const modified_Category = Category.replace(/\s/g, "");
            Question = Question.toLowerCase();
            Options = Options.map((option) => option.toLowerCase());
            Answer = Answer.toLowerCase();
            // checking incoming question category allready exist
            const existngCategory = yield quizModel_1.default.findOne({
                category: modified_Category,
            });
            // Creating a new category
            if (existngCategory == null) {
                yield quizModel_1.default.create({
                    category: modified_Category,
                    questions: [],
                });
                const questionDetails = yield questionModel_1.default.create({
                    question: Question,
                    options: Options,
                    answer: Answer,
                });
                yield quizModel_1.default.updateOne({ category: modified_Category }, { $push: { questions: questionDetails._id } });
                return reply
                    .code(200)
                    .send({ success: true, message: `new ${Category} quiz created` });
            }
            else {
                // checking incoming question is already exist
                const existingQuestion = yield questionModel_1.default.findOne({
                    question: Question,
                });
                if (existingQuestion) {
                    return reply
                        .code(403)
                        .send({ success: false, message: "Question already Exist!" });
                }
                // pushing new questions to corresponding category
                const questionDetails = yield questionModel_1.default.create({
                    question: Question,
                    options: Options,
                    answer: Answer,
                });
                yield quizModel_1.default.updateOne({ category: existngCategory.category }, { $push: { questions: questionDetails._id } });
                return reply.code(200).send({
                    success: true,
                    message: `Question added to ${existngCategory.category} Category successfully`,
                });
            }
        }
        catch (error) {
            console.error("An error occurred:", error);
            reply.code(500).send({
                success: false,
                message: "An error occurred while uploading the quiz",
            });
        }
    });
}
exports.uploadQuestions = uploadQuestions;
//-----------------Get All Category Handlers-------------------
function getAllQuizCategories(req, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Retreiving categories from the db
            const categories = yield quizModel_1.default.find({}, { category: 1 });
            return reply.code(200).send({ success: true, categories });
        }
        catch (error) {
            reply.code(500).send({
                success: false,
                message: "An error occurred while fetching categories",
            });
        }
    });
}
exports.getAllQuizCategories = getAllQuizCategories;
//--------------- Get all Questions Handler----------------------
function getQuestions(req, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Converting the id from params into object id
            const categoryId = new mongoose_1.default.Types.ObjectId(req.params.id);
            // Retrieving questions based on the category id by populating
            const questionDetail = yield quizModel_1.default.findById({
                _id: categoryId,
            }).populate("questions");
            if (questionDetail !== null) {
                return reply.code(200).send({ success: true, questionDetail });
            }
            else {
                return reply.code(404).send({
                    success: false,
                    message: "No questions found! please make sure the category id is correct",
                });
            }
        }
        catch (error) {
            console.error("An error occurred:", error);
            reply.code(500).send({
                success: false,
                message: "An error occurred while fetching questions!",
            });
        }
    });
}
exports.getQuestions = getQuestions;
//-------------- Submit Answer handler-----------------------------
function submitAnswer(req, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { QuestionId, SelectedOption } = req.body;
            const catId = new mongoose_1.default.Types.ObjectId(req.params.id);
            const questId = new mongoose_1.default.Types.ObjectId(QuestionId);
            // const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(UserId);
            const userId = new mongoose_1.default.Types.ObjectId(req.userId);
            // Initialzing isCorrect as false
            let isCorrect = false;
            SelectedOption = SelectedOption.toLowerCase();
            // Retrieve the answerData based on the category ID
            const answerData = yield quizModel_1.default.findById(catId).populate("questions");
            const questStringId = questId.toString();
            if (answerData) {
                // Find the matched question in the answerData
                const matchedQuestion = answerData.questions.find((questions) => questions._id.toString() === questStringId);
                if (matchedQuestion) {
                    // Check if the submitted answer matches the correct answer for the matched question
                    const correctAnswer = matchedQuestion.answer;
                    // Comparing the selected option and correct answer and stores
                    isCorrect = SelectedOption === correctAnswer;
                }
                else {
                    // If no matching question is found, send an appropriate error response
                    return reply.code(404).send({
                        success: false,
                        message: "Question not found/Incorrect! make sure question id correct",
                    });
                }
            }
            else {
                // If no matching category is found, send an appropriate error response
                return reply.code(404).send({
                    success: false,
                    message: "Category not found/Incorrect! make sure category id is correct",
                });
            }
            // Update User
            const response = yield updateUser(userId, catId, questId, SelectedOption, isCorrect);
            const statuscode = response.statuscode;
            return reply.code(statuscode).send(response);
        }
        catch (error) {
            reply.code(500).send({
                success: false,
                message: `An error occurred while submitting answer!, ${error}`,
            });
        }
    });
}
exports.submitAnswer = submitAnswer;
//----------- User update helper function------------------------
function updateUser(userId, catId, questId, SelectedOption, isCorrect) {
    return __awaiter(this, void 0, void 0, function* () {
        // Retriving user from user collection
        const user = yield userModel_1.default.findOne({ _id: userId });
        if (user != null) {
            let Score = 0;
            // Checking wheather the category is exist
            const matchedCategory = yield user.attendedCategoryDetail.find((detail) => detail.categoryId.equals(catId));
            if (matchedCategory) {
                // Checking wheather the question is exist
                const matchedQuestion = yield userModel_1.default.findOne({
                    _id: userId,
                    "attendedCategoryDetail.attendedQuestions.questionId": questId,
                });
                if (matchedQuestion) {
                    return {
                        statuscode: 400,
                        success: true,
                        message: "You have already attended this question!",
                    };
                }
                else {
                    // Retriving existing score of the perticular category from the user document
                    const userCatScore = yield userModel_1.default.aggregate([
                        { $match: { _id: userId } }, // Match the user by ID
                        { $unwind: "$attendedCategoryDetail" }, // Unwind the attendedCategoryDetail array
                        { $match: { "attendedCategoryDetail.categoryId": catId } }, // Match the category by ID
                        { $project: { _id: 0, score: "$attendedCategoryDetail.score" } }, // Project only the score
                    ]);
                    // updating the score
                    if (userCatScore !== null) {
                        Score = userCatScore[0].score;
                        isCorrect ? Score++ : Score;
                    }
                    // Updating the user document with new data
                    yield userModel_1.default.findByIdAndUpdate({
                        _id: userId,
                        "attendedCategoryDetail.categoryId": catId,
                    }, {
                        $push: {
                            "attendedCategoryDetail.$[category].attendedQuestions": [
                                {
                                    questionId: questId,
                                    selectedOption: SelectedOption,
                                },
                            ],
                        },
                        $set: {
                            "attendedCategoryDetail.$[category].score": Score,
                        },
                    }, {
                        arrayFilters: [{ "category.categoryId": catId }],
                        new: true, // Return the modified document
                    });
                    // Retriving no of attended questions
                    const result = yield userModel_1.default.aggregate([
                        {
                            $match: { _id: userId }, // Filter by user ID
                        },
                        {
                            $unwind: "$attendedCategoryDetail", // Unwind attendedCategoryDetail array
                        },
                        {
                            $match: {
                                "attendedCategoryDetail.categoryId": catId,
                            }, // Filter by category ID
                        },
                        {
                            $project: {
                                numberOfQuestions: {
                                    $size: "$attendedCategoryDetail.attendedQuestions",
                                }, // Count the number of objects in attendedQuestions array
                            },
                        },
                    ]);
                    // Extract the count from the result
                    const UserQuestCount = result.length > 0 ? result[0].numberOfQuestions : 0;
                    // No of questions in category
                    const totalQuest = yield quizModel_1.default.aggregate([
                        {
                            $match: { _id: catId }, // Filter by category ID
                        },
                        {
                            $project: {
                                numberOfQuestions: { $size: "$questions" },
                            },
                        },
                    ]);
                    // Extract the count from the result
                    const QuizQuestCount = totalQuest.length > 0 ? totalQuest[0].numberOfQuestions : 0;
                    if (UserQuestCount === QuizQuestCount) {
                        return {
                            statuscode: 200,
                            success: true,
                            Result: isCorrect,
                            message: "Completed",
                            TotalScore: Score,
                        };
                    }
                    else {
                        return { success: true, statuscode: 200, Result: isCorrect };
                    }
                }
            }
            else {
                //Updating Score for the first time
                if (isCorrect)
                    Score++;
                yield userModel_1.default.findByIdAndUpdate(userId, {
                    $push: {
                        attendedCategoryDetail: {
                            categoryId: catId,
                            attendedQuestions: {
                                questionId: questId,
                                selectedOption: SelectedOption,
                            },
                            score: Score,
                        },
                    },
                });
                return { success: true, statuscode: 200, Result: isCorrect };
            }
        }
        else {
            return {
                statuscode: 401,
                success: false,
                message: "Unautherised! you have to login",
            };
        }
    });
}
// Final result and score handler
function getFinalResult(req, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = new mongoose_1.default.Types.ObjectId(req.userId);
            const catId = new mongoose_1.default.Types.ObjectId(req.params.id);
            // No of questions in category
            const quizScore = yield userModel_1.default.aggregate([
                {
                    $match: { _id: userId },
                },
                {
                    $unwind: "$attendedCategoryDetail",
                },
                {
                    $match: { "attendedCategoryDetail.categoryId": catId },
                },
                {
                    $lookup: {
                        from: "questions", // Replace with the name of your questions collection
                        localField: "attendedCategoryDetail.attendedQuestions.questionId",
                        foreignField: "_id",
                        as: "attendedCategoryDetail.question",
                    },
                },
                {
                    $addFields: {
                        "attendedCategoryDetail.attendedQuestions": {
                            $map: {
                                input: "$attendedCategoryDetail.attendedQuestions",
                                as: "aq",
                                in: {
                                    question: {
                                        $arrayElemAt: [
                                            "$attendedCategoryDetail.question.question",
                                            0,
                                        ],
                                    },
                                    selectedOption: "$$aq.selectedOption",
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        "attendedCategoryDetail.categoryId": 1,
                        "attendedCategoryDetail.attendedQuestions": 1,
                        "attendedCategoryDetail.score": 1,
                        "attendedCategoryDetail.question": "$question",
                    },
                },
            ]);
            if (quizScore.length !== 0) {
                return reply.code(200).send({ success: true, quizScore });
            }
            else {
                return reply.code(404).send({
                    success: false,
                    message: "There is no data regarding to the perticular quiz category!",
                });
            }
        }
        catch (error) {
            reply.code(500).send({
                success: false,
                message: `An error occurred while getting final result!, ${error}`,
            });
        }
    });
}
exports.getFinalResult = getFinalResult;
