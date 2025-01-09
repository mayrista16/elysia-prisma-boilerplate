// src/utils/ApiError.ts

import config from '../config/config';

export default class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public stack?: string;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    stack: string = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack && config.env === 'development') {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
