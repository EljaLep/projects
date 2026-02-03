import { zValidator } from "zValidator";

import * as coursesRepository from "./coursesRepository.js";
import { courseValidator   } from "./validators.js";

const getCourses = async (c) => {
  return c.json(await coursesRepository.readAll());
};

const getCourse = async (c) => {
  const id = c.req.param("id");
  return c.json(await coursesRepository.readOne(id));
};

const createCourse = [zValidator("json", courseValidator), async (c) => {
  const course = await c.req.valid("json");
  return c.json(await coursesRepository.create(course));
}];

const deleteCourse = async (c) => {
  const id = c.req.param("id");
  return c.json(await coursesRepository.remove(id));
};

export { getCourses, createCourse, getCourse, deleteCourse };