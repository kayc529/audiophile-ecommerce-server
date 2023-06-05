import jwt from 'jsonwebtoken';

export const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
};

export const isTokenValid = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const attachCookieToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const oneMonth = oneDay * 30;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge: oneDay,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge: oneMonth,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
};