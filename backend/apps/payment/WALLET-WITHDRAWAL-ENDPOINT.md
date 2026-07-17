# Wallet Withdrawal Endpoint Documentation

## Overview
The `/wallet/withdraw` endpoint allows authenticated users with business or agency account types to withdraw funds from their wallet to external accounts (bank transfer, PayPal, or Stripe Connect).

## Endpoint Details
- **URL**: `POST {{base_url}}/wallet/withdraw`
- **Authentication**: JWT Bearer token required
- **Supported Account Types**: `user`, `business`, `agency`
- **Content-Type**: `application/json`

## Authentication Requirements

### JWT Token Structure
The endpoint requires a valid JWT token issued by the SSO service with the following payload structure:
```json
{
  "sub": "user-identifier",
  "userId": "uuid-string",
  "accountType": "user|business|agency",
  "scope": "payment:wallet:withdraw",
  "sessionId": "session-uuid",
  "clientId": "optional-client-id"
}
```

### Token Usage for Different Account Types

#### User Accounts
- **Token Variable**: `token` (general) or `user_token`
- **Account Type**: `"user"`
- **Permissions**: Full access to wallet operations including withdrawals
- **Usage**: Regular user accounts can withdraw funds from their wallet balance, typically earned through purchases, refunds, or platform rewards

#### Business Accounts
- **Token Variable**: `business_token`
- **Account Type**: `"business"`
- **Permissions**: Full access to wallet operations including withdrawals
- **Usage**: Business accounts can withdraw funds earned through platform transactions, commissions, or direct payments

#### Agency Accounts
- **Token Variable**: `agency_token`
- **Account Type**: `"agency"`
- **Permissions**: Full access to wallet operations including withdrawals
- **Usage**: Agency accounts can withdraw funds from their wallet balance, typically earned through service fees or affiliate commissions

### Token Acquisition
Tokens are obtained through the SSO service authentication endpoints:
- User accounts authenticate via SSO user login endpoints
- Business accounts authenticate via SSO business login endpoints
- Agency accounts authenticate via SSO agency login endpoints
- All account types receive JWT tokens with appropriate `accountType` claims

## Request Body

```json
{
  "amount": 15.0,
  "currency": "USD",
  "withdrawalMethod": "bank_transfer",
  "accountDetails": {
    "accountHolderName": "Jane Doe",
    "accountNumber": "123456789",
    "routingNumber": "110000",
    "bankName": "ABC Bank",
    "paypalEmail": null
  },
  "description": "Withdrawal test"
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | number | Yes | Withdrawal amount (minimum $0.01) |
| `currency` | string | No | Currency code (default: "USD") |
| `withdrawalMethod` | string | Yes | One of: "bank_transfer", "paypal", "stripe_connect" |
| `accountDetails` | object | Conditional | Required for bank_transfer and paypal methods |
| `description` | string | No | Optional description for the withdrawal |

## Withdrawal Methods

### Bank Transfer
- **Method**: `"bank_transfer"`
- **Required Fields**:
  - `accountHolderName`: Full name of account holder
  - `accountNumber`: Bank account number
  - `routingNumber`: Bank routing number (US banks)
  - `bankName`: Name of the bank

### PayPal
- **Method**: `"paypal"`
- **Required Fields**:
  - `paypalEmail`: PayPal account email address

### Stripe Connect
- **Method**: `"stripe_connect"`
- **Required Fields**: None (uses connected Stripe account)
- **Note**: Requires pre-configured Stripe Connect account

## Business Logic

### Balance Validation
- Minimum withdrawal amount: $50.00 (configurable via `WALLET_MIN_WITHDRAWAL`)
- Maximum withdrawal amount: $5,000.00 (configurable via `WALLET_MAX_WITHDRAWAL`)
- Must have sufficient available balance in wallet

### Transaction Processing
1. **Validation**: Verify authentication, balance, and withdrawal limits
2. **Transaction Creation**: Create pending withdrawal transaction record
3. **Payment Processing**:
   - **Test Mode**: Simulates successful withdrawal
   - **Production Mode**: Uses Stripe Connect for actual fund transfers
4. **Balance Update**: Deduct amount from wallet balance
5. **Status Update**: Mark transaction as completed

### Wallet Balance Impact
- **Balance Deduction**: Immediate deduction from `wallet.balance`
- **Available Balance**: Reduced by withdrawal amount
- **Transaction Record**: Full audit trail maintained

## Error Responses

### Common Errors
- `401 Unauthorized`: Invalid or missing JWT token
- `403 Forbidden`: Account type not supported (must be business or agency)
- `400 Bad Request`:
  - Insufficient wallet balance
  - Amount below minimum withdrawal limit
  - Amount above maximum withdrawal limit
  - Invalid withdrawal method
  - Missing required account details

### Example Error Response
```json
{
  "statusCode": 400,
  "message": "Insufficient wallet balance. Available: 100.00 USD, Required: 150.00 USD",
  "error": "Bad Request"
}
```

## Success Response

```json
{
  "transactionId": "WTH_1703123456789_ABC123DEF456",
  "walletId": 123,
  "userId": "business-uuid-123",
  "type": "withdrawal",
  "amount": 15.0,
  "currency": "USD",
  "status": "completed",
  "description": "Withdrawal to bank_transfer",
  "paymentMethod": "bank_transfer",
  "paymentProvider": "stripe",
  "balanceBefore": 100.0,
  "balanceAfter": 85.0,
  "createdAt": "2023-12-20T10:30:56.789Z",
  "updatedAt": "2023-12-20T10:30:56.789Z",
  "metadata": {
    "withdrawalMethod": "bank_transfer",
    "accountDetails": {
      "accountHolderName": "Jane Doe",
      "accountNumber": "123456789",
      "routingNumber": "110000",
      "bankName": "ABC Bank"
    }
  }
}
```

## Environment Configuration

### Required Environment Variables
- `STRIPE_SECRET_KEY`: Stripe API key for payment processing
- `WALLET_MIN_WITHDRAWAL`: Minimum withdrawal amount (default: "50.00")
- `WALLET_MAX_WITHDRAWAL`: Maximum withdrawal amount (default: "5000.00")

### Test vs Production Mode
- **Test Mode**: Uses `sk_test_` prefixed keys, simulates withdrawals
- **Production Mode**: Requires Stripe Connect setup for actual fund transfers

## Security Considerations

1. **Token Validation**: All requests validated against SSO public key
2. **Account Type Verification**: Only business and agency accounts allowed
3. **Rate Limiting**: Applied at application level
4. **Audit Trail**: All withdrawals logged with full transaction details
5. **PCI Compliance**: Payment data handled securely through Stripe

## Integration Examples

### Using with User Token
```bash
curl -X POST "{{base_url}}/wallet/withdraw" \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.00,
    "currency": "USD",
    "withdrawalMethod": "paypal",
    "accountDetails": {
      "paypalEmail": "user@example.com"
    },
    "description": "Personal wallet withdrawal"
  }'
```

### Using with Business Token
```bash
curl -X POST "{{base_url}}/wallet/withdraw" \
  -H "Authorization: Bearer {{business_token}}" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00,
    "currency": "USD",
    "withdrawalMethod": "bank_transfer",
    "accountDetails": {
      "accountHolderName": "Business Name LLC",
      "accountNumber": "987654321",
      "routingNumber": "021000021",
      "bankName": "Chase Bank"
    },
    "description": "Monthly business withdrawal"
  }'
```

### Using with Agency Token
```bash
curl -X POST "{{base_url}}/wallet/withdraw" \
  -H "Authorization: Bearer {{agency_token}}" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 250.00,
    "withdrawalMethod": "paypal",
    "accountDetails": {
      "paypalEmail": "agency@example.com"
    },
    "description": "Agency commission withdrawal"
  }'
```

## Related Endpoints
- `GET /wallet`: Check wallet balance and details
- `GET /wallet/transactions`: View transaction history
- `POST /wallet/cards`: Add payment methods
- `POST /wallet/buy`: Add funds to wallet</content>
<parameter name="filePath">apps/payment/WALLET-WITHDRAWAL-ENDPOINT.md