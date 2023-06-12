import { attachSessionIdCookieToResponse, isTokenValid } from '../utils/jwt';
import { v4 as uuidv4 } from 'uuid';

export const getSession = (req, res, next) => {
  const { sid } = req.signedCookies;

  if (!sid) {
    //generate new session Id
    const newSessionId = generateSessionId();
    req.sessionId = newSessionId;
    attachSessionIdCookieToResponse({ res, sessionId: newSessionId });
    return next();
  }

  try {
    //validate sessionId;
    const payload = isTokenValid(sid);
    req.sessionId = payload.sessionId;
    attachSessionIdCookieToResponse({ res, sessionId: payload.sessionId });
    return next();
  } catch (error) {
    console.log('getSession', error);
    //generate new session Id
    const newSessionId = generateSessionId();
    req.sessionId = newSessionId;
    attachSessionIdCookieToResponse({ res, sessionId: newSessionId });
    return next();
  }
};

const generateSessionId = () => {
  return uuidv4();
};
