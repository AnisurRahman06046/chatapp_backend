import { Response } from 'express';

export const setAuthCookie = (
  res: Response,
  token: string,
  isDevelopment: boolean,
) => {
  res.cookie('access_token', token, {
    httpOnly: true, // Ensure the cookie is only accessible by the web server
    sameSite: 'strict',
    secure: !isDevelopment, // Set to true if not in development
    maxAge: 3600000, // Cookie expiration time in milliseconds
  });
};
