# Environment
- PORT=3004
- NODE_ENV=production
- DB_HOST=host.docker.internal
- DB_PORT=5432
- DB_USERNAME=postgres
- DB_PASSWORD=your_password
- DB_NAME=vero2
- SSO_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAodIqPNSrdGthc/gfd4ffczkIcMb4Bebl2+Mo6kqRVjx4g3llKr1c8P2ARLO4Xg9aqNJjyjfZ59Pm/aBz8OnFE9cTJW5RqnAoX1wWGgYbhvvpgAGGl8z0EYUn/jqbl5aFy5BSZCuy8zIguycQwPltl/ajhxp+Q9zJthCRy4kN5dZ7kpn0TnNpXEhopdk++e88y5CNHrnGWk6RamKucRD8A1EgUH/q+HzhXAl6QXHLfhxxfy1UHl60ldeAejMEsiUmb5snRADKliARUHwciphhhzMns3hNADJUR3vmUK5OeFwOnYTJvftJucmvEv4QmyJLfULtzbjr313KRIJJq/Tp5wIDAQAB-----END PUBLIC KEY-----
- SSO_ISSUER=http://localhost:3001/sso
- RATE_LIMIT_TTL=60
- RATE_LIMIT_MAX=100
- STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
- WALLET_DEFAULT_CURRENCY=USD

# Routes
- Base prefix: `/api/payment`
- Health: GET `/health`
- Wallet (JWT):
  - GET `/wallet`
  - POST `/wallet/cards`
  - GET `/wallet/cards`
  - POST `/wallet/cards/:cardId/default`
  - DELETE `/wallet/cards/:cardId`
  - POST `/wallet/buy`
  - POST `/wallet/refund`
  - GET `/wallet/transactions` (query filters)
  - POST `/wallet/stripe/buy`
  - POST `/wallet/stripe/refund`
  - POST `/wallet/pay/order/:orderCode`
  - POST `/wallet/withdraw`

