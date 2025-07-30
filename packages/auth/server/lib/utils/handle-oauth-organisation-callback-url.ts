import type { Context } from 'hono';

import { sendOrganisationAccountLinkConfirmationEmail } from '@documenso/ee/server-only/lib/send-organisation-account-link-confirmation-email';
import { onCreateUserHook } from '@documenso/lib/server-only/user/create-user';
import { formatOrganisationLoginUrl } from '@documenso/lib/utils/organisation-authentication-portal';
import { prisma } from '@documenso/prisma';

import { onAuthorize } from './authorizer';
import { validateOauth } from './handle-oauth-callback-url';
import { getOrganisationAuthenticationPortalOptions } from './organisation-portal';

type HandleOAuthOrganisationCallbackUrlOptions = {
  c: Context;
  orgUrl: string;
};

export const handleOAuthOrganisationCallbackUrl = async (
  options: HandleOAuthOrganisationCallbackUrlOptions,
) => {
  const { c, orgUrl } = options;

  const requestMeta = c.get('requestMetadata');

  const { organisation, clientOptions } = await getOrganisationAuthenticationPortalOptions({
    type: 'url',
    organisationUrl: orgUrl,
  });

  const { email, name, sub, accessToken, accessTokenExpiresAt, idToken } = await validateOauth({
    c,
    clientOptions,
  });

  console.log({
    email,
    name,
    sub,
    accessToken,
    accessTokenExpiresAt,
    idToken,
  });

  const allowedDomains = organisation.organisationAuthenticationPortal.allowedDomains;

  // Todo: Vunerable to email with multiple @.
  if (!allowedDomains.includes(email.split('@')[1])) {
    // Todo: Redirect to ?????????????
  }

  // Find the account if possible.
  const existingAccount = await prisma.account.findFirst({
    where: {
      provider: clientOptions.id,
      providerAccountId: sub,
    },
    include: {
      user: true,
    },
  });

  // Directly log in user if account already exists.
  if (existingAccount) {
    await onAuthorize({ userId: existingAccount.user.id }, c);

    return c.redirect(`/o/${orgUrl}`, 302);
  }

  const userWithSameEmail = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  // Handle existing user but no account.
  if (userWithSameEmail) {
    await sendOrganisationAccountLinkConfirmationEmail({
      type: 'link',
      userId: userWithSameEmail.id,
      organisationId: organisation.id,
      oauthConfig: {
        accessToken,
        idToken,
        providerAccountId: sub,
        expiresAt: Math.floor(accessTokenExpiresAt.getTime() / 1000),
      },
    });

    return c.redirect(`${formatOrganisationLoginUrl(orgUrl)}?action=verification-required`, 302);
  }

  if (!organisation.organisationAuthenticationPortal.autoProvisionUsers) {
    // Todo: Redirect to ?????????????
  }

  // Handle new user.
  const createdUser = await prisma.user.create({
    data: {
      email: email,
      name: name,
      emailVerified: null, // Do not verify email.
    },
  });

  await onCreateUserHook(createdUser).catch((err) => {
    // Todo: (RR7) Add logging.
    console.error(err);
  });

  // Todo
  // await sendOrganisationAccountLinkConfirmationEmail({
  //   userId: userWithSameEmail.id,
  // });

  return c.redirect(`${formatOrganisationLoginUrl(orgUrl)}?action=verification-required`, 302);
};

// await tx.account.create({
//   data: {
//     type: 'oauth',
//     provider: clientOptions.id,
//     providerAccountId: sub,
//     access_token: accessToken,
//     expires_at: Math.floor(accessTokenExpiresAt.getTime() / 1000),
//     token_type: 'Bearer',
//     id_token: idToken,
//     userId: user.id,
//   },
// });
