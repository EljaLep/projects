import postgres from "postgres";

const sql = postgres();

const readAll = async (id) => {
  const result = await sql`
    SELECT *
    FROM questions
    WHERE course_id = ${id};
  `;

  return result;
};

const create = async (id, question) => {
  const result = await sql`
    INSERT INTO questions (course_id, title, text)
    VALUES (${id}, ${question.title}, ${question.text})
    RETURNING *;
  `;
  return result[0];
};

const readOne =async (courseId, questionId) => {
  const result = await sql`
    SELECT *
    FROM questions
    WHERE course_id = ${courseId} AND id = ${questionId};
  `;

  return result[0];
};

const upvote = async (courseId, questionId) => {

  const currentCountQuery = await sql`
    SELECT *
    FROM questions
    WHERE course_id = ${courseId} AND id = ${questionId};
  `;
  const currentCount = currentCountQuery[0];

  const result = await sql`
    UPDATE questions
    SET upvotes = ${currentCount.upvotes + 1}
    WHERE course_id = ${courseId} AND id = ${questionId}
    RETURNING *;
  `;

  return result[0];
};

const remove = async (courseId, questionId) => {
  const result = await sql`
    DELETE FROM questions
    WHERE course_id = ${courseId} AND id = ${questionId}
    RETURNING *;
  `;

  return result[0];
};

export { readAll, create, readOne, upvote, remove };