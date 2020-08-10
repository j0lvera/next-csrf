class HttpError extends Error {
  private status: number;

  constructor(status = 403, message: string, ...params: undefined[]) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }

    this.name = "HttpError";
    this.status = status;
    this.message = message;
  }
}

export { HttpError };
