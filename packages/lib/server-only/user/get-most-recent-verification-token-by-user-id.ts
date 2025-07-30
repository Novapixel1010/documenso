import { prisma } from '@documenso/prisma';

import { USER_SIGNUP_VERIFICATION_TOKEN_IDENTIFIER } from '../../constants/email';

export type GetMostRecentVerificationTokenByUserIdOptions = {
  userId: number;
};

export const getMostRecentVerificationTokenByUserId = async ({
  userId,
}: GetMostRecentVerificationTokenByUserIdOptions) => {
  return await prisma.verificationToken.findFirst({
    where: {
      userId,
      identifier: USER_SIGNUP_VERIFICATION_TOKEN_IDENTIFIER,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};
