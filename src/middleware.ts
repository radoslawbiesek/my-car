import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async function (context, next) {
  const response = await next();
  return response;
});
