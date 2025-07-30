import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '../components';
import { useBranding } from '../providers/branding';
import type { TemplateConfirmationEmailProps } from '../template-components/template-confirmation-email';
import { TemplateFooter } from '../template-components/template-footer';
import TemplateImage from '../template-components/template-image';

export const OrganisationAccountCreateConfirmationTemplate = ({
  confirmationLink,
  assetBaseUrl = 'http://localhost:3002',
}: TemplateConfirmationEmailProps) => {
  const { _ } = useLingui();
  const branding = useBranding();

  const previewText = msg`A request has been made to create an organisation account`;

  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  const organisationName = 'Todo todo todo';
  const baseUrl = 'https://documenso.com'; // todotodotodotodotodotodotodo
  const token = 'todo';

  return (
    <Html>
      <Head />
      <Preview>{_(previewText)}</Preview>
      <Body className="mx-auto my-auto font-sans">
        <Section className="bg-white">
          <Container className="mx-auto mb-2 mt-8 max-w-xl rounded-lg border border-solid border-slate-200 px-2 pt-2 backdrop-blur-sm">
            {branding.brandingEnabled && branding.brandingLogo ? (
              <Img src={branding.brandingLogo} alt="Branding Logo" className="mb-4 h-6 p-2" />
            ) : (
              <TemplateImage
                assetBaseUrl={assetBaseUrl}
                className="mb-4 h-6 p-2"
                staticAsset="logo.png"
              />
            )}

            <Section>
              <TemplateImage
                className="mx-auto"
                assetBaseUrl={assetBaseUrl}
                staticAsset="mail-open.png"
              />
            </Section>

            <Section className="p-2 text-slate-500">
              <Text className="text-center text-lg font-medium text-black">
                <Trans>Create an organisation account</Trans>
              </Text>

              <Text className="text-center text-base">
                <Trans>
                  <span className="font-bold">{organisationName}</span> has requested to create an
                  organisation account on Documenso using your email address
                </Trans>
              </Text>

              <Section className="mt-6">
                <Text className="my-0 text-sm">
                  <Trans>
                    By accepting this request, you will be granting{' '}
                    <strong>{organisationName}</strong> full access to:
                  </Trans>
                </Text>

                <ul className="mb-0 mt-2">
                  <li className="text-sm">
                    <Trans>Create an account on your behalf</Trans>
                  </li>
                  <li className="mt-1 text-sm">
                    <Trans>Manage your account, and everything associated with it</Trans>
                  </li>
                </ul>

                <Text className="mt-2 text-sm">
                  <Trans>
                    You can delete your account at any time in your settings on Documenso{' '}
                    <Link href={`${baseUrl}/settings/profile`}>here.</Link>
                  </Trans>
                </Text>
              </Section>

              <Section className="mb-6 mt-8 text-center">
                <Button
                  className="bg-documenso-500 inline-flex items-center justify-center rounded-lg px-6 py-3 text-center text-sm font-medium text-black no-underline"
                  href={`${baseUrl}/organisation-account-create/${token}`}
                >
                  <Trans>Accept</Trans>
                </Button>
              </Section>
            </Section>

            <Text className="text-center text-xs text-slate-500">
              <Trans>Link expires in 1 hour.</Trans>
            </Text>
          </Container>

          <Hr className="mx-auto mt-12 max-w-xl" />

          <Container className="mx-auto max-w-xl">
            <TemplateFooter isDocument={false} />
          </Container>
        </Section>
      </Body>
    </Html>
  );
};

export default OrganisationAccountCreateConfirmationTemplate;
