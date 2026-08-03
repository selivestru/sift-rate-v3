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

interface EmailChangeConfirmTemplateProps {
  confirmUrl: string
  expiresInLabel: string
}

const BRAND = '#9F38FF'

export default function EmailChangeConfirm({
  confirmUrl,
  expiresInLabel,
}: EmailChangeConfirmTemplateProps) {
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
          <Preview>Confirm your new SiftRate email address</Preview>
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
                Confirm your new email
              </Heading>
              <Text className="m-0 mb-6 text-[14px] leading-[22px] text-gray-600 sm:text-[15px] sm:leading-[24px]">
                You requested to change the email address on your SiftRate account. Click the button
                below to confirm this change and move your account to the new address.
              </Text>

              <Text className="m-0 mb-6 text-[13px] leading-[17px] text-gray-400">
                This link {expiresInLabel}.
              </Text>

              <Button
                href={confirmUrl}
                className="box-border block w-full rounded-[6px] bg-brand px-6 py-3 text-center text-[15px] font-medium text-white no-underline sm:px-7"
              >
                Confirm email change
              </Button>

              <Hr className="my-8 border border-0 border-t border-solid border-gray-200" />

              <Text className="m-0 text-[13px] leading-[20px] text-gray-500">
                If you didn&apos;t request this change, you can safely ignore this email — your
                email address won&apos;t be changed.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

EmailChangeConfirm.PreviewProps = {
  confirmUrl: 'http://localhost:5000/api/auth/confirm-email-change?token=abc123',
  expiresInLabel: 'expires in 24 hours',
} satisfies EmailChangeConfirmTemplateProps
