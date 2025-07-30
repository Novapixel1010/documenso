import { NEXT_PUBLIC_WEBAPP_URL } from '../constants/app';

export const formatOrganisationLoginUrl = (organisationUrl: string) => {
  return `${NEXT_PUBLIC_WEBAPP_URL()}/o/${organisationUrl}/signin`;
};

export const formatOrganisationCallbackUrl = (organisationUrl: string) => {
  return `${NEXT_PUBLIC_WEBAPP_URL()}/api/auth/callback/oidc/org/${organisationUrl}`;
};
