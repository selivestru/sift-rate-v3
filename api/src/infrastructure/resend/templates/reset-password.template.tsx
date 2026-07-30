import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  pixelBasedPreset,
  Preview,
  Section,
  Tailwind,
  Text,
} from 'react-email'

interface ResetPasswordTemplateProps {
  resetUrl: string
  expiresInLabel: string
}

const BRAND = '#9F38FF'

export default function ResetPassword({ resetUrl, expiresInLabel }: ResetPasswordTemplateProps) {
  return (
    <Html lang="en">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: BRAND,
              },
            },
          },
        }}
      >
        <Head />
        <Body className="bg-[#f6f5fb] font-sans text-gray-900">
          <Preview>Reset your SiftRate password</Preview>
          <Container className="mx-auto my-[24px] w-full max-w-[560px] px-4 sm:my-[40px] sm:px-0">
            <Section className="w-full rounded-[8px] border border-gray-200 border-solid bg-white px-6 py-2 sm:px-10 sm:py-4">
              <Section className="mb-2 text-center">
                <Text className="mx-auto block h-[48px] w-[48px] rounded-[10px] bg-brand" />
              </Section>
              <Hr className="mb-8 mt-4 border border-0 border-t border-solid border-gray-200" />
              <Heading
                as="h1"
                className="m-0 text-[20px] font-bold leading-[28px] text-gray-900 sm:text-[24px] sm:leading-[30px]"
              >
                Reset your password
              </Heading>
              <Text className="m-0 mb-6 text-[14px] leading-[22px] text-gray-600 sm:text-[15px] sm:leading-[24px]">
                We received a request to reset the password for your SiftRate account. Click the
                button below to choose a new password. This will sign you out of all other devices.
              </Text>

              <Text className="m-0 mb-6 text-[13px] leading-[17px] text-gray-400">
                This link {expiresInLabel}.
              </Text>

              <Button
                href={resetUrl}
                className="box-border block w-full rounded-[6px] bg-brand px-6 py-3 text-center text-[15px] font-medium text-white no-underline sm:px-7"
              >
                Reset password
              </Button>

              <Hr className="my-8 border border-0 border-t border-solid border-gray-200" />

              <Text className="m-0 text-[13px] leading-[20px] text-gray-500">
                If you didn&apos;t request a password reset, you can safely ignore this email — your
                password won&apos;t be changed.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ResetPassword.PreviewProps = {
  resetUrl: 'http://localhost:3000/auth/reset-password?token=abc123',
  expiresInLabel: 'expires in 1 hour',
} satisfies ResetPasswordTemplateProps
