const { test, expect } = require("@playwright/test");

test('Welcome is shown on the front page.', async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Welcome!")).toBeVisible();
});

test('Can click to courses-page', async ({page}) => {
  await page.goto("/");
  await page.getByRole("link", {name: "Courses"}).click();
  await expect(page.getByRole("heading", {name: "Courses"})).toBeVisible();
});

test('Can create a new course', async ({page}) => {
  await page.goto("/courses");
  const randomMessage = `Hello ${Math.floor(10000 + Math.random() * 90000)}`;
  await page.getByLabel("name").fill(randomMessage);
  await page.getByRole("button", {name: "New Course"}).click();
  await page.goto("/courses");  
  await expect(page.getByText(randomMessage)).toBeVisible();
});

test('Can create a new question', async ({page}) => {
  await page.goto("/courses/1");
  const randomMessage = `Hello ${Math.floor(10000 + Math.random() * 90000)}`;
  const randomMessage2 = `Hello ${Math.floor(10000 + Math.random() * 90000)}`;
  await page.getByLabel("title").fill(randomMessage);
  await page.getByLabel("text").fill(randomMessage2);
  await page.getByRole("button", {name: "Add Question"}).click();
  await expect(page.getByText(randomMessage)).toBeVisible();
});

test('Cannot create a new answer, as not logged in', async ({page}) => {
  await page.goto("/courses/1");
  const randomMessage = `Hello ${Math.floor(10000 + Math.random() * 90000)}`;
  const randomMessage2 = `Hello ${Math.floor(10000 + Math.random() * 90000)}`;
  await page.getByLabel("title").fill(randomMessage);
  await page.getByLabel("text").fill(randomMessage2);
  await page.getByRole("button", {name: "Add Question"}).click();
  await page.getByRole("link", {name: randomMessage}).click();
  await expect(page.getByRole("button", {name: "Add Answer"})).toHaveCount(0);
});

test('Can register', async ({page}) => {
  const randomMessage = `Hello${Math.floor(10000 + Math.random() * 90000)}@test.com`;
  const randomMessage2 = `Hello${Math.floor(10000 + Math.random() * 90000)}`;
  await page.goto("/auth/register");
  await page.getByLabel("Email").fill(randomMessage);
  await page.getByLabel("Password").fill(randomMessage2);
  await page.getByRole("button", {name: "Register"}).click();
  await expect(page.getByText("Login form")).toBeVisible();
});

test('Can register and log in', async ({page}) => {
  const randomMessage = `Hello${Math.floor(10000 + Math.random() * 90000)}@test.com`;
  const randomMessage2 = `Hello${Math.floor(10000 + Math.random() * 90000)}`;
  await page.goto("/auth/register");
  await page.getByLabel("Email").fill(randomMessage);
  await page.getByLabel("Password").fill(randomMessage2);
  await page.getByRole("button", {name: "Register"}).click();
  await expect(page.getByText("Login form")).toBeVisible();
  await page.getByLabel("Email").fill(randomMessage);
  await page.getByLabel("Password").fill(randomMessage2);
  await page.getByRole("button", {name: "Login"}).click();
  await expect(page.getByText(randomMessage)).toBeVisible();
});

test('Can register, log in, and see form for new answer', async ({page}) => {
  const randomMessage = `Hello${Math.floor(10000 + Math.random() * 90000)}@test.com`;
  const randomMessage2 = `Hello${Math.floor(10000 + Math.random() * 90000)}`;
  await page.goto("/auth/register");
  await page.getByLabel("Email").fill(randomMessage);
  await page.getByLabel("Password").fill(randomMessage2);
  await page.getByRole("button", {name: "Register"}).click();
  await expect(page.getByText("Login form")).toBeVisible();
  await page.getByLabel("Email").fill(randomMessage);
  await page.getByLabel("Password").fill(randomMessage2);
  await page.getByRole("button", {name: "Login"}).click();
  await page.goto("/courses/1");
  const randomMessage3 = `Hello ${Math.floor(10000 + Math.random() * 90000)}`;
  const randomMessage4 = `Hello ${Math.floor(10000 + Math.random() * 90000)}`;
  await page.getByLabel("title").fill(randomMessage3);
  await page.getByLabel("text").fill(randomMessage4);
  await page.getByRole("button", {name: "Add Question"}).click();
  await page.getByRole("link", {name: randomMessage}).click();
  await expect(page.getByText("Submit new Answer")).toBeVisible();
});

test('Can register, log in, and add new answer', async ({page}) => {
  const randomMessage = `Hello${Math.floor(10000 + Math.random() * 90000)}@test.com`;
  const randomMessage2 = `Hello${Math.floor(10000 + Math.random() * 90000)}`;
  await page.goto("/auth/register");
  await page.getByLabel("Email").fill(randomMessage);
  await page.getByLabel("Password").fill(randomMessage2);
  await page.getByRole("button", {name: "Register"}).click();
  await expect(page.getByText("Login form")).toBeVisible();
  await page.getByLabel("Email").fill(randomMessage);
  await page.getByLabel("Password").fill(randomMessage2);
  await page.getByRole("button", {name: "Login"}).click();
  await page.goto("/courses/1");
  const randomMessage3 = `Hello ${Math.floor(10000 + Math.random() * 90000)}`;
  const randomMessage4 = `Hello ${Math.floor(10000 + Math.random() * 90000)}`;
  await page.getByLabel("title").fill(randomMessage3);
  await page.getByLabel("text").fill(randomMessage4);
  await page.getByRole("button", {name: "Add Question"}).click();
  await page.getByRole("link", {name: randomMessage}).click();
  const randomMessage5 = `Hello ${Math.floor(10000 + Math.random() * 90000)}`;
  await page.getByLabel("text").fill(randomMessage5);
  await page.getByRole("button", {name: "Add Answer"}).click();
  await expect(page.getByText(randomMessage5)).toBeVisible();
});

test('Can register, log in, add new answer, and see upvote-button', async ({page}) => {
  const randomMessage = `Hello${Math.floor(10000 + Math.random() * 90000)}@test.com`;
  const randomMessage2 = `Hello${Math.floor(10000 + Math.random() * 90000)}`;
  await page.goto("/auth/register");
  await page.getByLabel("Email").fill(randomMessage);
  await page.getByLabel("Password").fill(randomMessage2);
  await page.getByRole("button", {name: "Register"}).click();
  await expect(page.getByText("Login form")).toBeVisible();
  await page.getByLabel("Email").fill(randomMessage);
  await page.getByLabel("Password").fill(randomMessage2);
  await page.getByRole("button", {name: "Login"}).click();
  await page.goto("/courses/1");
  const randomMessage3 = `Hello ${Math.floor(10000 + Math.random() * 90000)}`;
  const randomMessage4 = `Hello ${Math.floor(10000 + Math.random() * 90000)}`;
  await page.getByLabel("title").fill(randomMessage3);
  await page.getByLabel("text").fill(randomMessage4);
  await page.getByRole("button", {name: "Add Question"}).click();
  await page.getByRole("link", {name: randomMessage}).click();
  const randomMessage5 = `Hello ${Math.floor(10000 + Math.random() * 90000)}`;
  await page.getByLabel("text").fill(randomMessage5);
  await page.getByRole("button", {name: "Add Answer"}).click();
  await expect(page.getByText("upvote")).toBeVisible();
});

test('Can register, log in, add new answer, and upvote answer', async ({page}) => {
  const randomMessage = `Hello${Math.floor(10000 + Math.random() * 90000)}@test.com`;
  const randomMessage2 = `Hello${Math.floor(10000 + Math.random() * 90000)}`;
  await page.goto("/auth/register");
  await page.getByLabel("Email").fill(randomMessage);
  await page.getByLabel("Password").fill(randomMessage2);
  await page.getByRole("button", {name: "Register"}).click();
  await expect(page.getByText("Login form")).toBeVisible();
  await page.getByLabel("Email").fill(randomMessage);
  await page.getByLabel("Password").fill(randomMessage2);
  await page.getByRole("button", {name: "Login"}).click();
  await page.goto("/courses/1");
  const randomMessage3 = `Hello ${Math.floor(10000 + Math.random() * 90000)}`;
  const randomMessage4 = `Hello ${Math.floor(10000 + Math.random() * 90000)}`;
  await page.getByLabel("title").fill(randomMessage3);
  await page.getByLabel("text").fill(randomMessage4);
  await page.getByRole("button", {name: "Add Question"}).click();
  await page.getByRole("link", {name: randomMessage}).click();
  const randomMessage5 = `Hello ${Math.floor(10000 + Math.random() * 90000)}`;
  await page.getByLabel("text").fill(randomMessage5);
  await page.getByRole("button", {name: "Add Answer"}).click();
  await page.getByRole("button", {name: "upvote"}).click();
  await expect(page.getByText("Upvotes: 1")).toBeVisible();
});