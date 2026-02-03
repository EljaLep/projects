import { browser } from "$app/environment";
import * as courseApi from "$lib/apis/course-api.js";
import { json } from "@sveltejs/kit";

//const COURSES_KEY = "courses";
//let initialCourses = [];

let coursesState = $state([]);

if (browser) {
  coursesState = await courseApi.readCourses();
}





const useCoursesState = () => {
  return {
    get courses() {
      return coursesState;
    },
    update: async() => {
      coursesState = await courseApi.readCourses();
    },
    add: async (course) => {
      const newCourse = await courseApi.createCourse(course);
      coursesState = await courseApi.readCourses();
    },
  };
};

export { useCoursesState };