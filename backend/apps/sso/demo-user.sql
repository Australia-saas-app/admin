-- Demo user seed for the SSO Postman collection
-- Default credentials:
--   email:    demo@vero.local
--   password: password
--
-- Usage:
--   docker cp sso/demo-user.sql vero2-postgres:/tmp/demo-user.sql
--   docker exec -it vero2-postgres psql -U postgres -d vero2 -f /tmp/demo-user.sql

INSERT INTO users (
  "userId",
  "accountType",
  "fullName",
  "email",
  "phone",
  "password",
  "currency",
  "profilePhoto",
  "dateOfBirth",
  "gender",
  "nationality",
  "passportNumber",
  "permanentAddress",
  "governmentId",
  "idDocument",
  "status",
  "emailVerified",
  "phoneVerified",
  "twoFactorEnabled",
  "twoFactorMethod",
  "agencyInfo",
  "businessInfo",
  "createdAt",
  "updatedAt"
) VALUES (
  'USER999999',
  'user',
  'Demo User',
  'demo@vero.local',
  NULL,
  '$2b$10$CwTycUXWue0Thq9StjUM0uJ8m6Bx/6CkXbkqUBgfHBlCkbSrxlKFe',
  'USD',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'active',
  true,
  false,
  false,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT ("userId") DO NOTHING;















