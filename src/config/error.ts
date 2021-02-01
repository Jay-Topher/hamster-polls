interface IError {
  name?: string;
  message: string;
  errors?: string;
  status: number;
  stack?: string;
}

export class APIError extends Error {
  status: number;
  errors?: any;

  constructor(input: IError) {
    super(input.message);
    this.name = input.name || 'APIError';
    this.status = input.status;
    this.errors = input.errors || '';
    Error.captureStackTrace(this, APIError);
  }
}
