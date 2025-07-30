import { createElement } from 'react';

import { msg } from '@lingui/core/macro';

import { mailer } from '@documenso/email/mailer';
import { OrganisationAccountLinkTemplate } from '@documenso/email/templates/organisation-account-link';
import { prisma } from '@documenso/prisma';

import { getI18nInstance } from '../../client-only/providers/i18n-server';
import { NEXT_PUBLIC_WEBAPP_URL } from '../../constants/app';
import { DOCUMENSO_INTERNAL_EMAIL } from '../../constants/email';
import { ORGANISATION_ACCOUNT_LINK_VERIFICATION_TOKEN_IDENTIFIER } from '../../constants/organisations';
import { AppError, AppErrorCode } from '../../errors/app-error';
import { renderEmailWithI18N } from '../../utils/render-email-with-i18n';

export interface SendOrganisationAccountLinkEmailProps {
  userId: number;
}

export const sendOrganisationAccountLinkEmail = async ({
  userId,
}: SendOrganisationAccountLinkEmailProps) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      verificationTokens: {
        where: {
          identifier: ORGANISATION_ACCOUNT_LINK_VERIFICATION_TOKEN_IDENTIFIER,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  });

  if (!user) {
    throw new AppError(AppErrorCode.NOT_FOUND);
  }

  const [verificationToken] = user.verificationTokens;

  if (!verificationToken?.token) {
    throw new Error('Verification token not found for the user');
  }

  const assetBaseUrl = NEXT_PUBLIC_WEBAPP_URL();

  const confirmationLink = `${assetBaseUrl}/link-organisation-account/${verificationToken.token}`;

  const confirmationTemplate = createElement(OrganisationAccountLinkTemplate, {
    assetBaseUrl,
    confirmationLink,
  });

  const [html, text] = await Promise.all([
    renderEmailWithI18N(confirmationTemplate),
    renderEmailWithI18N(confirmationTemplate, { plainText: true }),
  ]);

  const i18n = await getI18nInstance();

  return mailer.sendMail({
    to: {
      address: user.email,
      name: user.name || '',
    },
    from: DOCUMENSO_INTERNAL_EMAIL,
    subject: i18n._(msg`A request has been made to link your Documenso account`),
    html,
    text,
  });
};
