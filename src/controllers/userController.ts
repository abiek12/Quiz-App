import { FastifyReply, FastifyRequest } from "fastify";

export async function uploadQuestions(req: FastifyRequest, replay: FastifyReply) {
    const data=req.body
    if(!data){
        replay.code(400).send("Empty!")
    }
    
}
export async function getAllQuizes(req: FastifyRequest, replay: FastifyReply) {}
export async function getQuestions(req: FastifyRequest, replay: FastifyReply) {}
export async function submitAnswer(req: FastifyRequest, replay: FastifyReply) {}