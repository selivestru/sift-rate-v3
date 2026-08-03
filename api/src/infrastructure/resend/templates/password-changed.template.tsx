import {
  Body,
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

const BRAND = '#9F38FF'

export default function PasswordChanged() {
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
          <Preview>Your SiftRate password was changed</Preview>
          <Container className="mx-auto my-[24px] w-full max-w-[560px] px-4 sm:my-[40px] sm:px-0">
            <Section className="w-full rounded-[8px] border border-gray-200 border-solid bg-white px-6 py-2 sm:px-10 sm:py-4">
              <Section className="mb-2 text-center">
                <Text className="mx-auto block h-[48px] w-[48px] rounded-[10px] bg-brand" />
              </Section>
              <Hr className="mb-8 mt-4 border border-0 border-t border-solid border-gray-200" />
              <Heading
                as="h1"
                className="m-0 mb-1 text-[20px] font-bold leading-[28px] text-gray-900 sm:text-[24px] sm:leading-[30px] text-center"
              >
                Your password was changed
              </Heading>
              <Text className="m-0 mb-6 text-[14px] leading-[22px] text-gray-600 sm:text-[15px] sm:leading-[24px]">
                The password for your SiftRate account was changed. If you made this change, no
                further action is needed.
              </Text>

              <Hr className="my-8 border border-0 border-t border-solid border-gray-200" />

              <Text className="m-0 text-[13px] leading-[20px] text-gray-500">
                If you didn&apos;t change your password, someone may have accessed your account.
                Reset your password right away to secure it.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

PasswordChanged.PreviewProps = {}
