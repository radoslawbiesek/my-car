import type { AstroCookies } from "astro";
import jwt from "jsonwebtoken";

const AUTH_COOKIE = "Authorization";
const DEFAULT_EXPIRES_IN = 8 * 60 * 60; // 8 hours
const SHORT_EXPIRES_IN = 120; // 120 seconds

export class AuthService {
  private readonly expiresIn: number;
  private readonly secret: string;

  constructor(private readonly cookies: AstroCookies) {
    const expiresInRaw = import.meta.env.JWT_EXPIRES_IN as string | undefined;
    this.expiresIn = this.#parseInt(expiresInRaw) ?? DEFAULT_EXPIRES_IN;
    this.secret = import.meta.env.JWT_SECRET || "secret";
  }

  #parseInt(input?: unknown) {
    if (typeof input !== "string" || parseInt(input).toString() !== input) {
      return null;
    }

    return parseInt(input);
  }

  #validatePassword(password: string) {
    return password === import.meta.env.PASSWORD;
  }

  #createToken(expiresIn: number) {
    const token = jwt.sign({}, this.secret, { expiresIn });

    return token;
  }

  #validateToken(token: string) {
    try {
      jwt.verify(token, this.secret);
      return true;
    } catch {
      return false;
    }
  }

  authenticate() {
    const token = this.cookies.get(AUTH_COOKIE).value;
    if (!token) {
      return false;
    }

    const isValid = this.#validateToken(token);
    if (!isValid) {
      this.cookies.delete(AUTH_COOKIE);
    }

    return isValid;
  }

  login(password: string, remember = true) {
    const isValid = this.#validatePassword(password);

    if (!isValid) {
      return false;
    }

    const expiresInSeconds = remember ? this.expiresIn : SHORT_EXPIRES_IN;
    const token = this.#createToken(expiresInSeconds);

    const expiresDate = new Date();
    expiresDate.setSeconds(expiresDate.getSeconds() + expiresInSeconds);
    this.cookies.set(AUTH_COOKIE, token, { expires: expiresDate });

    return true;
  }

  logout() {
    this.cookies.delete(AUTH_COOKIE);
  }
}
