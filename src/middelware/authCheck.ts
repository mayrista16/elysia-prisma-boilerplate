//authCheck.ts
import { bearer } from '@elysiajs/bearer';
import config from '../config/config';
import { HttpStatusEnum } from '../utils/httpStatusCode';
import { Roles } from '@prisma/client';
import type { userRole } from '../config/role';
import { db } from '../config/prisma';

export const checkAuth = async ({ bearer, elysia_jwt, error, request }: any) => {
  //console.log("Context in checkAuth:", { bearer, elysia_jwt, error }); // Log the context
  if (!bearer) {
    return error(HttpStatusEnum.HTTP_401_UNAUTHORIZED, 'Unauthorized. Access token not present');
  }

  const payload = await elysia_jwt.verify(bearer);

  const {sub, name, deptid, roles} = payload.payload

  if (!payload) {
    return error(HttpStatusEnum.HTTP_401_UNAUTHORIZED, 'Unauthorized. Access token not verified');
  }
  
  request.userAuth = {
    sub, name, deptid, roles
  }
};

export const checkEmailVerified = async ({ user, error }: any) => {
  if (!user) {
    return error(HttpStatusEnum.HTTP_403_FORBIDDEN, 'User session unavailable.');
  }

  if (!user.emailVerified) {
    return error(HttpStatusEnum.HTTP_403_FORBIDDEN, 'Your account is not email verified.');
  }
};

export const checkIsSuperAdmin = async ({ user, error }: any) => {
  if (user.role?.name !== 'SUPERADMIN') { // added optional chaining in case user.role is null
    return error(HttpStatusEnum.HTTP_403_FORBIDDEN, 'Superadmin access required');
  }
};

export const checkIsAdmin = async ({ user, error }: any) => {
  if (user.role?.name !== 'ADMIN') { // added optional chaining in case user.role is null
    return error(HttpStatusEnum.HTTP_403_FORBIDDEN, 'Admin access required');
  }
};

export const checkIsStaff = async ({ user, error }: any) => {
  if (user.role?.name !== 'STAFF') { // fixed to check for STAFF role and added optional chaining
    return error(HttpStatusEnum.HTTP_403_FORBIDDEN, 'Staff access required');
  }
};

export const checkIsUser = async ({ user, error }: any) => {
  if (user.role?.name !== 'USER') { // added optional chaining in case user.role is null
    return error(HttpStatusEnum.HTTP_403_FORBIDDEN, 'User access required');
  }
};

export const requireRoles = (...requiredRoles: string[]) => async ({ user, error }: any) => {
  if (!requiredRoles.some(r => user.role?.name === r)) { // fixed to check against user.role?.name and added optional chaining
    return error(HttpStatusEnum.HTTP_403_FORBIDDEN, `Requires roles: ${requiredRoles.join(', ')}`);
  }
};