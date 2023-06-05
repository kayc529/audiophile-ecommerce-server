import { StatusCodes } from 'http-status-codes';
class CustomApiError extends Error {
  //default error code = 500
  statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor(message: string) {
    super(message);
  }
}

export default CustomApiError;
