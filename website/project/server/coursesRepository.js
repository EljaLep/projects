import postgres from "postgres";

const sql = postgres();

const create = async (c) => {
  const result = await sql`
    INSERT INTO courses (name)
    VALUES (${c.name})
    RETURNING *;
  `;
  return result[0];
};

const readAll = async () => {
  const result = await sql`
    SELECT * 
    FROM courses;
  `;
  return result;
};


const readOne = async (id) => {
  const result = await sql`
    SELECT *
    FROM courses
    WHERE id = ${id};
  `;
  return result[0];
};

const remove = async (id) => {
  const result = await sql`
    DELETE FROM courses
    WHERE id = ${id}
    RETURNING *;
  `;
  return result[0];
};

export { create, readAll, readOne, remove };