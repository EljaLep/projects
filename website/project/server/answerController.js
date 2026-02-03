import { zValidator } from "zValidator";

import * as answerRepository from "./answerRepository.js";
import { answerValidator } from "./validators.js";

const getAnswers = async (c) => {

  const qId = c.req.param("qId");
  const result = await answerRepository.readAll(qId);
  const data = result.map((row) => {
    return {
    "id": row.id, 
    "upvotes": row.upvotes, 
    "text": row.text, 
    "question_id": row.question_id
  };
  });
  return c.json(data);
};

const createAnswer =  async (c, user_id) => {
  const qId = c.req.param("qId");
  const body = await c.req.json();
  console.log(body.text);
  //const text = "testi";
  return c.json(await answerRepository.create(qId, user_id, body.text));
};

const upvoteAnswer = async (c) => {

  const qId = c.req.param("qId");
  const aId = c.req.param("aId");
  return c.json(await answerRepository.upvote(qId, aId));
} 

export { getAnswers, createAnswer, upvoteAnswer };