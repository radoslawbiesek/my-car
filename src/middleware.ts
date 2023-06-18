import { defineMiddleware } from "astro/middleware";

import { AuthService } from "@services/auth";

export const onRequest = defineMiddleware(async function (context, next) {
  const authService = new AuthService(context.cookies);
  const isAuthenticated = authService.authenticate();
  context.locals.isLoggedIn = isAuthenticated;

  const isLogin = context.url.pathname === "/login";

  if (isAuthenticated) {
    if (isLogin) {
      return context.redirect("/");
    }

    return next();
  }

  if (isLogin) {
    return next();
  }

  return context.redirect("/login");
});
