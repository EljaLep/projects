import { browser } from "$app/environment";

import * as questionsApi from "$lib/apis/questions-api.js";




//if (browser ) {
//  questionState.ques = await questionsApi.readQuestions(questionState.id);
//}

let questionState = $state([]);

const useQuestionState = () => {
  return {
    get questions() {
			console.log("request");
			return questionState;
		},
		update: async (courseId) => {
			console.log("updatae");
			questionState = await questionsApi.readQuestions(courseId);
		},
    add: async (question, courseId) => {
			const newQ = await questionsApi.createQuestion(question.title, question.text, courseId);
			questionState = await questionsApi.readQuestions(courseId);
    },
    upvote: async (id, courseId) => {
			console.log(id + " " + courseId);
			await questionsApi.upvoteQuestion(id, courseId);
			questionState = await questionsApi.readQuestions(courseId);
    },
    remove: async (id, courseId) => {
			const removedQuestion = await questionsApi.removeQuestion(id, courseId);
			questionState = await questionsApi.readQuestions(courseId);
    },
  };
};

export { useQuestionState };