export function UnprocessableEntity(message: string | string[]) {
  return {
    type: 'unprocessable entity',
    message,
  };
}

export function Unauthorized() {
  return {
    type: 'unauthorized',
  };
}

export function NotFound() {
  return {
    type: 'not found',
  };
}

export function Conflict(message: string) {
  return {
    type: 'unprocessable entity',
    message: `${message} already exists`,
  };
}

export function Forbidden(message: string) {
  return {
    type: 'forbidden',
    message: message,
  };
}
