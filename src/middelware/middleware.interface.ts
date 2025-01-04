export interface CustomError extends Error {
  statusCode: number;
  isOperational: boolean;
  stack: string;
  cause?: unknown;
  validator?: {
    schema?: {
      properties?: any;
    };
  };
}
