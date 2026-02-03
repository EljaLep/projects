import { zValidator } from "zValidator";

import * as questionsRepository from "./questionsRepository.js";
import { questionValidator } from "./validators.js";

const getQuestions = async (c) => {
  const id = c.req.param("id");

  return c.json(await questionsRepository.readAll(id));
};

const getQuestion = async (c) => {
  const id = c.req.param("id");
  const qId = c.req.param("qId");

  return c.json(await questionsRepository.readOne(id, qId));
}

const createQuestion = [zValidator("json", questionValidator), async (c) => {
  const id = c.req.param("id");
  const question = c.req.valid("json");

  return c.json(await questionsRepository.create(id, question));
}];

const upvoteQuestion = async (c) => {
  const courseId = c.req.param("id");
  const questionId = c.req.param("qId");

  return c.json(await questionsRepository.upvote(courseId, questionId));
};

const deleteQuestion = async (c) => {
  const courseId = c.req.param("id");
  const questionId = c.req.param("qId");

  return c.json(await questionsRepository.remove(courseId, questionId));
}

export { getQuestions, createQuestion, upvoteQuestion, deleteQuestion, getQuestion };