import postgres from "postgres";

const sql = postgres();

const readAll = async (qId) => {
  const result = await sql`SELECT *
    FROM question_answers
    WHERE question_id = ${qId}`;
  return result;
};

const create = async (qId, user_id, text) => {
  const result = await sql`INSERT INTO question_answers (question_id, user_id, text)
    VALUES (${qId}, ${user_id}, ${text})
    RETURNING *`;
  return await result[0];
}

const upvote = async (qId, aId) => {
  const currentCountQuery = await sql`
    SELECT *
    FROM question_answers
    WHERE question_id = ${qId} AND id = ${aId};
  `;
  const currentCount = currentCountQuery[0];

  const result = await sql`
    UPDATE question_answers
    SET upvotes = ${currentCount.upvotes + 1}
    WHERE question_id = ${qId} AND id = ${aId}
    RETURNING *;
  `;

  return result[0];

}

export { readAll, create, upvote };