import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import * as coursesController from "./coursesController.js";
import * as questionsController from "./questionsController.js";
import * as answerController from "./answerController.js";
import { hash, verify } from "jsr:@denorg/scrypt@4.4.4";
import postgres from "postgres";
import { getCookie, setCookie } from "jsr:@hono/hono@4.6.5/cookie";
import * as jwt from "jsr:@hono/hono@4.6.5/jwt";

const COOKIE_KEY = "token";
const JWT_SECRET = "wsd-project-secret";
const sql = postgres();
const app = new Hono();
app.use("/*",cors({
  origin: "http://localhost:5173",
  //allowCredentials: true,
  credentials: true,
}));



app.get("/api/courses", coursesController.getCourses);
app.get("/api/courses/:id", coursesController.getCourse);
app.post("/api/courses", ...coursesController.createCourse);
app.delete("/api/courses/:id", coursesController.deleteCourse);


app.get("/api/courses/:id/questions", questionsController.getQuestions);
app.post("/api/courses/:id/questions", ...questionsController.createQuestion);
app.post("/api/courses/:id/questions/:qId/upvote", questionsController.upvoteQuestion);
app.delete("/api/courses/:id/questions/:qId", questionsController.deleteQuestion);

app.get("/api/courses/:id/questions/:qId", questionsController.getQuestion);
app.get("/api/courses/:id/questions/:qId/answers", answerController.getAnswers);
/*
app.post("/insert/question", async (c) => {
  const result = await sql`INSERT INTO questions (course_id, title, text)
    VALUES (1, 'testi', 'testi')
    RETURNING *
  `;

  return c.json( result[0]);
})
*//*
app.post("/insert/answer", async (c) => {

  const result2 = await answerController.createAnswer(c, 1)

  return result2;
})
*/

app.post("/api/courses/:id/questions/:qId/answers", async (c) => {
  const token = getCookie(c, COOKIE_KEY);
  if (!token) {
    c.status(401);
    return c.json({
      "message": "No token found!",
    });
  }

  try {
    const payload = await jwt.verify(token, JWT_SECRET);
    console.log("verified");
    const user_id = payload.id;
    console.log(user_id);
    const response = await answerController.createAnswer(c, user_id);
    //console.log(await response.json());
    console.log(response);
    return response;
  } catch (e) {
    console.log(e);
    c.status(401);
    return c.json({
      "message": "Invalid token!",
    });
  }
});

app.post("/api/courses/:id/questions/:qId/answers/:aId/upvote", async (c) => {
  const token = getCookie(c, COOKIE_KEY);
  if (!token) {
    c.status(401);
    return c.json({
      "message": "No token found!",
    });
  }

  try {
    const payload = await jwt.verify(token, JWT_SECRET);
    const response = await answerController.upvoteAnswer(c);
    c.status(200);
    return response;
  } catch (e) {
    c.status(401);
    return c.json({
      "message": "Invalid token!",
    });
  }
})

const clean = (data) => {
  data.email = data.email.trim().toLowerCase();
  data.password = data.password.trim();
};

app.post("/api/auth/register", async (c) => {
  const data = await c.req.json();
  clean(data);

  const result = await sql`INSERT INTO users (email, password_hash)
    VALUES (${data.email},
    ${hash(data.password)}) RETURNING *`;
  return c.json({ "message": `Registered as user ${result[0].id}.` });
});

app.post("/api/auth/login", async (c) => {
  const data = await c.req.json();

  clean(data);

  const result = await sql`SELECT * FROM users
    WHERE email = ${data.email}`;

  if (result.length === 0) {
    return c.json({
      "message": "Incorrect email or password.",
    });
  }

  const user = result[0];

  const passwordValid = verify(data.password, user.password_hash);
  if (passwordValid) {

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = await jwt.sign(payload, JWT_SECRET);

    setCookie(c, COOKIE_KEY, token, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
      sameSite: "lax",
    });

    return c.json({
      "message": `Welcome!`,
    });
  } else {
    return c.json({
      "message": "Incorrect email or password.",
    });
  }
});

export default app;




