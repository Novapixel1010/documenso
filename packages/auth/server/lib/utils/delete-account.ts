import { UserSecurityAuditLogType } from '@prisma/client';
import type { Context } from 'hono';

import { prisma } from '@documenso/prisma';

import { getSession } from './get-session';

export const deleteAccount = async (c: Context, accountId: string): Promise<void> => {
  const { user } = await getSession(c);

  const requestMeta = c.get('requestMetadata');

  const userAccounts = await prisma.account.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      userId: true,
      type: true,
      provider: true,
      providerAccountId: true,
      expires_at: true,
      created_at: true,
    },
  });

  // Todo: conditional

  await prisma.$transaction(async (tx) => {
    await tx.account.delete({
      where: {
        id: accountId,
      },
    });

    await tx.userSecurityAuditLog.create({
      data: {
        userId: user.id,
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
        type: UserSecurityAuditLogType.ACCOUNT_SSO_UNLINK, // TODO: CONDITIONAL DEPENDING ON SSO VS ORG_SSO
      },
    });
  });
};
