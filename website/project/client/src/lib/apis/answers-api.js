import { PUBLIC_API_URL } from "$env/static/public";
import { text } from "@sveltejs/kit";


const readAnswers = async (course_id, question_id) => {
  const response = await fetch(`${PUBLIC_API_URL}/api/courses/${course_id}/questions/${question_id}/answers`);
  return await response.json();
  
  
};

const createAnswer = async (course_id, question_id, answer) => {
  const response = await fetch(`${PUBLIC_API_URL}/api/courses/${course_id}/questions/${question_id}/answers`, {
    method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(answer),
    credentials: "include",
  });

  return await response.json();
};

const upvoteAnswer = async (course_id, question_id, answer_id) => {
  const response = await fetch(`${PUBLIC_API_URL}/api/courses/${course_id}/questions/${question_id}/answers/${answer_id}/upvote`, {
    method: "POST",
    credentials: "include",
  });

  return await response.json();
};

export {readAnswers, createAnswer, upvoteAnswer};