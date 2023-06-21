import { defineMiddleware } from 'astro/middleware';

import { AuthService } from '@services/auth';

export const onRequest = defineMiddleware(async function (context, next) {
  const authService = new AuthService(context.cookies);
  const isAuthenticated = authService.authenticate();
  context.locals.isLoggedIn = isAuthenticated;

  const isLoginPage = context.url.pathname === '/login';

  if (isAuthenticated) {
    if (isLoginPage) {
      return context.redirect('/');
    }

    return next();
  }

  if (isLoginPage) {
    return next();
  }

  return context.redirect('/login');
});
