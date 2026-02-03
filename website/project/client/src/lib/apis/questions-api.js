//const PUBLIC_API_URL = "http://localhost:8000";
import { PUBLIC_API_URL } from "$env/static/public";

const readQuestions = async (courseId) => {
	const response = await fetch(`${PUBLIC_API_URL}/api/courses/${courseId}/questions`);
	if (await response.ok){
		return await response.json();
	} else {
		return {"status": "no worky"};
	}
	
	
};

const readQuestion = async (courseId, questionId) => {
	const response = await fetch(`${PUBLIC_API_URL}/api/courses/${courseId}/questions/${questionId}`);
	if (await response.ok){
		return await response.json();
	} else {
		return {"status": "no worky"};
	}
	
	
};

const createQuestion = async (title_, text_, courseId) => {

	const oldlist = await readQuestions(courseId);
	const newId = oldlist.length + 1;
	
	const newQuestion = {
		title: title_,
		text: text_,
	};


	const response = await fetch(`${PUBLIC_API_URL}/api/courses/${courseId}/questions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newQuestion),
	});
	const res = await response.json();
	
	return res;
};

const removeQuestion = async (id_, courseId) => {
	const response = await fetch(`${PUBLIC_API_URL}/api/courses/${courseId}/questions/${id_}`, {
		method: "DELETE",
	});
	
	return await response.json();
};

const upvoteQuestion = async (id_, courseId) => {
	const response = await fetch(`${PUBLIC_API_URL}/api/courses/${courseId}/questions/${id_}/upvote`, {
		method: "POST",
	});
	
	return await response.json();
} ;

export {readQuestions, createQuestion, removeQuestion, upvoteQuestion, readQuestion};