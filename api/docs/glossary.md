# Glossary

- **Verification token** — opaque random 32-byte base64url string stored in Redis.
  Single-use; invalidated on successful verification or resend (deleted and replaced).
  Stored under two keys:
  - `email_verify:<userId>` → token (lookup for resend — replace with new one)
  - `email_verify_token:<token>` → userId (O(1) lookup for verify endpoint)
    TTL: 24 hours.

- **isVerified** — boolean `User` flag. `false` after credentials registration;
  set `true` via `GET /api/auth/verify?token=...` endpoint, or immediately for
  Google OAuth users during `createGoogleUser`.

- **EMAIL_NOT_VERIFIED** — 401 response code returned on `POST /api/auth/login`
  when the user exists with valid credentials but `isVerified` is `false`.
  Frontend should show "check your email" screen with a resend button.

- **resend-verification** — public throttled endpoint
  `POST /api/auth/resend-verification { email }` that:
  1. Looks up the user by email.
  2. If not found or already verified — returns the same canned message
     (anti-enumeration).
  3. Otherwise deletes old Redis keys, generates a new token, enqueues a new
     welcome email job, and returns the canned message.
     Rate limit: 3 requests per 60 seconds per IP.
     Canned message: `"If your email is registered and not yet verified, a new email has been sent"`

- **email queue** — BullMQ queue named `email` for asynchronous email sending.
  Used for welcome and resend flows. Future email types reuse the same queue.
  Registered in `ResendModule` via `BullModule.registerQueue({ name: 'email' })`.
  Worker: `EmailProcessor` (`@Processor('email')`) in the same module.
  Retry policy: 5 attempts, exponential backoff 5/10/20/40/80 s.
  On exhaustion the job is marked failed and logged; user can trigger a new
  attempt via `resend-verification`.

- **Orphan unverified user** — `User` row with `isVerified=false` created when
  the email queue (`queue.add`) was unavailable at registration time.
  Recovery path: `POST /api/auth/resend-verification { email }`.

- **Anti-enumeration** — pattern where a public endpoint returns the same
  response regardless of whether the email exists, is verified, or is
  unverified. Prevents attackers from building email user bases.
