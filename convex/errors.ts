import { ConvexError } from 'convex/values'

// Custom error types for better frontend error handling
export interface AppError {
  code: string
  message: string
  field?: string
}

// Error codes for the application
export const ErrorCodes = {
  // Authentication errors
  NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',
  UNAUTHORIZED: 'UNAUTHORIZED',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',

  // Operation errors
  OPERATION_FAILED: 'OPERATION_FAILED',
} as const

// Czech error messages
export const ErrorMessages = {
  [ErrorCodes.NOT_AUTHENTICATED]: 'Pro tuto akci se musíte přihlásit',
  [ErrorCodes.UNAUTHORIZED]: 'Nemáte oprávnění k této akci',
  [ErrorCodes.VALIDATION_ERROR]: 'Neplatná data',
  [ErrorCodes.INVALID_INPUT]: 'Neplatný vstup',
  [ErrorCodes.NOT_FOUND]: 'Položka nebyla nalezena',
  [ErrorCodes.ALREADY_EXISTS]: 'Položka již existuje',
  [ErrorCodes.OPERATION_FAILED]: 'Operace se nezdařila',
} as const

// Helper to throw authentication error
export function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new ConvexError({
      code: ErrorCodes.NOT_AUTHENTICATED,
      message: ErrorMessages[ErrorCodes.NOT_AUTHENTICATED],
    })
  }
}

// Helper to throw not found error
export function throwNotFound(entity: string): never {
  throw new ConvexError({
    code: ErrorCodes.NOT_FOUND,
    message: `${entity} nebyla nalezena`,
  })
}

// Helper to throw validation error
export function throwValidationError(message: string, field?: string): never {
  throw new ConvexError({
    code: ErrorCodes.VALIDATION_ERROR,
    message,
    field,
  })
}

// Validator helpers
export function validatePositiveNumber(
  value: number | undefined,
  fieldName: string,
): void {
  if (value !== undefined && value < 0) {
    throwValidationError(`${fieldName} nemůže být záporné`, fieldName)
  }
}

export function validateNonEmptyString(value: string, fieldName: string): void {
  if (!value.trim()) {
    throwValidationError(`${fieldName} je povinné`, fieldName)
  }
}

export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string,
): void {
  if (value.length > maxLength) {
    throwValidationError(
      `${fieldName} je příliš dlouhé (max ${maxLength} znaků)`,
      fieldName,
    )
  }
}
