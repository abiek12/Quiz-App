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
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitAnswer = exports.getQuestions = exports.getAllQuizes = exports.uploadQuestions = void 0;
function uploadQuestions(req, replay) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        if (!data) {
            replay.code(400).send("Empty!");
        }
    });
}
exports.uploadQuestions = uploadQuestions;
function getAllQuizes(req, replay) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.getAllQuizes = getAllQuizes;
function getQuestions(req, replay) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.getQuestions = getQuestions;
function submitAnswer(req, replay) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.submitAnswer = submitAnswer;
