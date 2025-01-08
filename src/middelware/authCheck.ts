import { bearer } from '@elysiajs/bearer';
import config from '../config/config';
import { HttpStatusEnum } from '../utils/httpStatusCode';

export const checkAuth = async ({ bearer, elysia_jwt, error }: any) => {
  // Check if the Authentication-Method header is present
  if (!bearer) {
    return error(401, 'Unauthorized. Access token not present');
  }

  const tokenUser = await elysia_jwt.verify(bearer);
  if (!tokenUser) {
    return error(401, 'Unauthorized. Access token not verified');
  }
};
