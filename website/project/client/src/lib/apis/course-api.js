//const PUBLIC_API_URL = "http://localhost:8000";
import { PUBLIC_API_URL } from "$env/static/public";


const readCourses = async () => {
  const response = await fetch(`${PUBLIC_API_URL}/api/courses`);

  return await response.json();
}

const createCourse = async (course) => {

  const response = await fetch(`${PUBLIC_API_URL}/api/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(course),

  });
  return await response.json();
}

const readCourse = async (id) => {
  const response = await fetch (`${PUBLIC_API_URL}/api/courses/${id}`);
  return await response.json();
}

export { readCourses, createCourse, readCourse };