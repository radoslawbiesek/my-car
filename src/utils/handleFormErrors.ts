import { ZodError } from 'zod';

export function handleFormErrors(errors: Record<string, string>, error: unknown) {
  if (error instanceof ZodError) {
    for (const err of error.errors) {
      errors[err.path[0] as keyof typeof errors] = err.message;
    }
  } else if (error instanceof Error) {
    errors._error = error.message || 'Coś poszło nie tak';
  }
}
