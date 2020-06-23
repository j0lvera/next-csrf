class HttpError extends Error {
  private status: number;

  constructor(status = 401, message: string, ...params: undefined[]) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }

    this.name = "AuthError";
    this.status = status;
    this.message = message;
  }
}

export { HttpError };
