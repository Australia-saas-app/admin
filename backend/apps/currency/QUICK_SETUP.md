# Currency Service - Quick Setup Guide

## Prerequisites
1. Node.js 18+
2. PostgreSQL database
3. Postman (or any API client)

## Quick Start

### 1. Install Dependencies
```bash
cd apps/currency
npm install
```

### 2. Configure Environment
Edit `.env` file:
```env
PORT=3012
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=vero2
SKIP_JWT_VERIFICATION=true
```

### 3. Start Service
```bash
npm run start:dev
```

### 4. Import Postman Collection
1. Open Postman
2. Click "Import" → "File"
3. Select `Vero2-Currency-Service.postman_collection.json`

## Setup Steps (in order)

### Step 1: Create Base Currency
```json
POST {{baseUrl}}/api/currencies
{
  "code": "USD",
  "name": "US Dollar",
  "symbol": "$",
  "locale": "en-US",
  "decimalPlaces": 2,
  "exchangeRateToBase": 1,
  "isBase": true,
  "isCrypto": false
}
```

### Step 2: Add More Currencies
```json
POST {{baseUrl}}/api/currencies
{
  "code": "EUR",
  "name": "Euro",
  "symbol": "€",
  "locale": "de-DE",
  "decimalPlaces": 2,
  "exchangeRateToBase": 0.85
}
```

```json
POST {{baseUrl}}/api/currencies
{
  "code": "GBP",
  "name": "British Pound",
  "symbol": "£",
  "locale": "en-GB",
  "decimalPlaces": 2,
  "exchangeRateToBase": 0.75
}
```

### Step 3: Create Exchange Rate
```json
POST {{baseUrl}}/api/exchange-rates
{
  "fromCurrencyCode": "USD",
  "toCurrencyCode": "EUR",
  "rate": 0.92,
  "source": "manual"
}
```

### Step 4: Test Conversion
```json
POST {{baseUrl}}/api/conversion
{
  "fromCurrency": "USD",
  "toCurrency": "EUR",
  "amount": 100
}
```

Expected response:
```json
{
  "fromCurrency": "USD",
  "toCurrency": "EUR",
  "fromAmount": 100,
  "toAmount": 92,
  "exchangeRate": 92,
  "formatted": {
    "from": "$100.00",
    "to": "€92.00"
  }
}
```

## API Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /health | No | Health check |
| POST | /api/currencies | JWT | Create currency |
| GET | /api/currencies | No | List currencies |
| GET | /api/currencies/active | No | Get active currencies |
| GET | /api/currencies/base | No | Get base currency |
| GET | /api/currencies/:id | No | Get by ID |
| GET | /api/currencies/code/:code | No | Get by code |
| PUT | /api/currencies/:id | JWT | Update currency |
| DELETE | /api/currencies/:id | JWT | Delete currency |
| POST | /api/exchange-rates | JWT | Create rate |
| GET | /api/exchange-rates | No | List rates |
| GET | /api/exchange-rates/from/:from/to/:to | No | Get rate |
| GET | /api/exchange-rates/currency/:code | No | Rates for currency |
| GET | /api/exchange-rates/:id | No | Get rate by ID |
| PUT | /api/exchange-rates/:id | JWT | Update rate |
| DELETE | /api/exchange-rates/:id | JWT | Delete rate |
| POST | /api/conversion | No | Convert currency |
| GET | /api/conversion/history | JWT | Conversion history |
| GET | /api/conversion/stats | JWT | Conversion stats |

## Database Tables Created

1. **currencies** - Currency catalog
2. **exchange_rates** - Exchange rates
3. **currency_conversion_logs** - Conversion audit log
