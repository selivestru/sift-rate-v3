# ADR-0001: Email verification after registration

Date: 2026-07-28
Status: Accepted

## Context

Регистрация создавала сессию и возвращала объект пользователя без подтверждения
email. Поле `User.isVerified` существовало в схеме с дефолтом `false`, но никогда
не проставлялось в `true`. Метод `ResendService.sendWelcomeEmail` и шаблон письма
`welcome.template.tsx` были написаны, но не вызывались. Отсутствовала
обработка сбоя отправки письма.

## Decision

1. **Регистрация не создаёт сессию** — возвращает `{ message }` и отправляет
   письмо с токеном через BullMQ-очередь. Пользователь не может войти до
   подтверждения.
2. **Email-отправка — через BullMQ-очередь `email`** с retry-политикой
   5 попыток, exponential backoff 5/10/20/40/80 s. И `register`, и `resend`
   используют одну очередь для всех (текущих и будущих) типов писем.
3. **Токен хранится в Redis** с TTL 24 h. Два ключа:
   - `email_verify:<userId>` → token (быстрый поиск для resend)
   - `email_verify_token:<token>` → userId (O(1) lookup для verify)
4. **Ссылка из письма ведёт на бэк** `GET /api/auth/verify?token=...`,
   бэк редиректит на `${ORIGIN}/auth/verify?success=true` или
   `?error=invalid_or_expired` (по образцу `googleCallback`).
5. **Логин неверифицированного пользователя → 401 `EMAIL_NOT_VERIFIED`**.
6. **`POST /api/auth/resend-verification { email }`** перевыпускает токен
   (старый удаляется), ставит новый job в очередь. Throttled: 3 req/min.
   Anti-enumeration: одинаковый ответ для всех сценариев (user не найден,
   уже verified, успешно отправлено).
7. **Google-пользователи получают `isVerified=true`** сразу в
   `createGoogleUser` (Google подтверждает email на своей стороне).
8. **Отказ Redis при `queue.add` → 503 без rollback** пользователя.
   Пользователь создан с `isVerified=false`, путь восстановления —
   `resend-verification`.

## Consequences

### Положительные
- Defence-in-depth от фейк-аккаунтов — без подтверждения email вход невозможен.
- Устойчивость к transient-сбоям Resend/сети за счёт автоматических retry в
  очереди без фрикции для пользователя.
- Совместимость с существующей инфраструктурой: Redis (сессии, 2FA),
  Resend (email), BullMQ (уже подключён в `app.module.ts`).
- Анти-enumeration на resend-эндпоинте — нельзя угадать существование email.

### Отрицательные и риски
- При отказе Redis в момент регистрации появляются orphan-unverified
  пользователи — приемлемо, путь восстановления через `resend-verification`.
- Email retry может маскировать хронический сбой Resend — логирование
  failed jobs в процессоре; мониторинг очереди — отдельная задача.
