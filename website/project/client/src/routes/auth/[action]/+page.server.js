import { PUBLIC_INTERNAL_API_URL } from "$env/static/public";
import { redirect } from "@sveltejs/kit";
import { useUserState } from "$lib/states/userState.svelte";

const COOKIE_KEY = "token";
const userState = useUserState();

const apiRequest = async (url, data) => {
  return await fetch(`${PUBLIC_INTERNAL_API_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const actions = {
  login: async ({ request, cookies }) => {
    console.log(PUBLIC_INTERNAL_API_URL);
    const data = await request.formData();
    const response = await apiRequest(
      "/api/auth/login",
      Object.fromEntries(data),
    );
    console.log(response.status);

    if (response.ok) {
      console.log(response.message);
      const responseCookies = response.headers.getSetCookie();
      console.log(responseCookies);
      const cookie = responseCookies.find((cookie) =>
        cookie.startsWith(COOKIE_KEY),
      );
      console.log(cookie);
      const cookieValue = cookie.split("=")[1].split(";")[0];
      cookies.set(COOKIE_KEY, cookieValue, { path: "/", secure: false });
      userState.user = { email: "no email", id: 20};
      console.log(userState.user);
      throw redirect(302, "/");
    }

    return response;
  },
  register: async ({ request }) => {
    const data = await request.formData();
    console.log("ok");
    console.log(data);
    const response = await apiRequest(
      "/api/auth/register",
      Object.fromEntries(data),
    );
    console.log(response.status);
    if (response.ok) {
      throw redirect(302, "/auth/login");
    }

    return await response.json();
  },
};