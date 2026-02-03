import * as answerApi from "$lib/apis/answers-api.js";

let answerState = $state([]);

const useAnswerState = () => {
  return {
    get answers() {
      return answerState;
    },
    add: async (course_id, question_id, answer) => {
      try {
        const response = await answerApi.createAnswer(course_id, question_id, answer);
        answerState = await answerApi.readAnswers(course_id, question_id);
      } catch {
        console.log("failed to add")
      }
    },
    upvote: async (course_id, question_id, answer_id) => {
      try {
        const response = await answerApi.upvoteAnswer(course_id, question_id, answer_id);
        answerState = await answerApi.readAnswers(course_id, question_id);
        return response;
      } catch {
        console.log("failed to upvote")
      }
      
    },
    update: async (course_id, question_id) => {
      try {
        const response = await answerApi.readAnswers(course_id, question_id);
        answerState = response;
      } catch {
        console.log("failed to upvote")
      }
    },
  };
};

export { useAnswerState };