import CustomApiError from './CustomApiError';
import { StatusCodes } from 'http-status-codes';

class UnauthenticatedError extends CustomApiError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthenticatedError;
