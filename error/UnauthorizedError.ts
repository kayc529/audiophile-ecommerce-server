import CustomApiError from './CustomApiError';
import { StatusCodes } from 'http-status-codes';

class UnauthorizedError extends CustomApiError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthorizedError;
