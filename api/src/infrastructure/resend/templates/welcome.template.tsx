import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  pixelBasedPreset,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'react-email'

interface WelcomeTemplateProps {
  verificationUrl: string
}

const BRAND = '#9F38FF'

export default function Welcome({ verificationUrl }: WelcomeTemplateProps) {
  const url = new URL(verificationUrl)
  const hostname = url.hostname

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
          <Preview>Confirm your email to start using SiftRate.</Preview>
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
                Welcome to SiftRate 👋
              </Heading>
              <Text className="m-0 mb-6 text-[14px] leading-[22px] text-gray-600 sm:text-[15px] sm:leading-[24px]">
                Confirm your email address to finish setting up your account. Then you can rate
                movies, games and books, discover picks, and share your taste with friends.
              </Text>

              <Section className="mb-8">
                <Row>
                  <Column className="pr-2 align-top">
                    <Text className="m-0 text-[16px] leading-[24px] text-brand">•</Text>
                  </Column>
                  <Column>
                    <Text className="m-0 text-[13px] leading-[20px] text-gray-700 sm:text-[14px] sm:leading-[24px]">
                      <span className="font-semibold text-gray-900">Rate</span> anything in seconds
                      — from blockbusters to deep cuts.
                    </Text>
                  </Column>
                </Row>
                <Row className="mt-3">
                  <Column className="pr-2 align-top">
                    <Text className="m-0 text-[16px] leading-[24px] text-brand">•</Text>
                  </Column>
                  <Column>
                    <Text className="m-0 text-[13px] leading-[20px] text-gray-700 sm:text-[14px] sm:leading-[24px]">
                      <span className="font-semibold text-gray-900">Discover</span> picks matched to
                      your taste, not the algorithm&apos;s noise.
                    </Text>
                  </Column>
                </Row>
                <Row className="mt-3">
                  <Column className="pr-2 align-top">
                    <Text className="m-0 text-[16px] leading-[24px] text-brand">•</Text>
                  </Column>
                  <Column>
                    <Text className="m-0 text-[13px] leading-[20px] text-gray-700 sm:text-[14px] sm:leading-[24px]">
                      <span className="font-semibold text-gray-900">Share</span> your lists and see
                      what your friends are loving right now.
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Button
                href={verificationUrl}
                className="box-border block w-full rounded-[6px] bg-brand px-6 py-3 text-center text-[15px] font-medium text-white no-underline sm:px-7"
              >
                Confirm email
              </Button>

              <Hr className="my-8 border border-0 border-t border-solid border-gray-200" />

              <Text className="m-0 text-[13px] leading-[20px] text-gray-500">
                You received this email because you created a SiftRate account. If this wasn&apos;t
                you, you can safely ignore it — or visit{' '}
                <Link href={verificationUrl} className="text-brand font-medium no-underline">
                  {hostname}
                </Link>{' '}
                to learn more.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

Welcome.PreviewProps = {
  verificationUrl: 'http://localhost:3000/auth/verify?token=abc123',
} satisfies WelcomeTemplateProps
