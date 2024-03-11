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
exports.login = exports.signUp = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function signUp(req, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { Username, Email, Password } = req.body;
            if (!(Username && Email && Password)) {
                return reply
                    .code(400)
                    .send({ success: false, message: "All fields are compulsorry!" });
            }
            const existingUser = yield userModel_1.default.findOne({ email: Email });
            if (existingUser) {
                return reply
                    .code(403)
                    .send({ success: false, message: "User Already Exist!" });
            }
            else {
                const hashedPassword = yield bcrypt_1.default.hash(Password, 10);
                yield userModel_1.default.create({
                    userName: Username,
                    email: Email,
                    password: hashedPassword,
                });
                return reply
                    .code(201)
                    .send({ success: true, message: "User created succesfully" });
            }
        }
        catch (error) {
            console.error("An error occurred:", error);
            reply.code(500).send({
                success: false,
                message: "An error occurred while user signup!",
            });
        }
    });
}
exports.signUp = signUp;
function login(req, reply) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.login = login;
