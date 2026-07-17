# Payment Service - Security Deposit and Affiliate Income Routes

## Overview
This document outlines the new endpoints required for implementing security deposit functionality in business accounts and affiliate account income features in the Payment Service.

## User Types Supported
- **Business Account (Agency)**: Companies/businesses that provide services
- **Affiliate Account**: Users who earn income through referrals/commissions

## Security Deposit Features (Business Accounts Only)

### Core Functionality
- Agencies must pay a security deposit to become active
- Deposit amounts are set by admin
- Deposits can be refunded when account is closed and no outstanding dues
- Partial refunds possible for partial deposit returns

### Required Endpoints

#### 1. Pay Security Deposit
- **Method**: POST
- **Path**: `/security-deposit/pay`
- **Auth**: Required (Business account only)
- **Body**:
  ```json
  {
    "amount": "number",
    "currency": "string",
    "paymentMethod": "stripe|paypal"
  }
  ```
- **Response**: Payment intent/session

#### 2. Get Security Deposit Status
- **Method**: GET
- **Path**: `/security-deposit/status`
- **Auth**: Required (Business account only)
- **Response**:
  ```json
  {
    "totalDeposit": "number",
    "currentBalance": "number",
    "dueAmount": "number",
    "lastPaymentDate": "date",
    "penalties": "number"
  }
  ```

#### 3. Request Security Deposit Refund
- **Method**: POST
- **Path**: `/security-deposit/refund`
- **Auth**: Required (Business account only)
- **Body**:
  ```json
  {
    "amount": "number",
    "reason": "string"
  }
  ```
- **Response**: Refund request confirmation

#### 4. Get Security Deposit History
- **Method**: GET
- **Path**: `/security-deposit/history`
- **Auth**: Required (Business account only)
- **Query**: `page`, `limit`, `startDate`, `endDate`
- **Response**: List of deposit transactions

## Affiliate Income Features (Affiliate Accounts Only)

### Core Functionality
- Affiliates earn commission from referrals
- Income can be withdrawn to bank/wallet
- Commission rates set by admin per business type
- Monthly/quarterly payouts

### Required Endpoints

#### 1. Get Affiliate Income Balance
- **Method**: GET
- **Path**: `/affiliate/income/balance`
- **Auth**: Required (Affiliate account only)
- **Response**:
  ```json
  {
    "availableBalance": "number",
    "pendingBalance": "number",
    "totalEarned": "number",
    "lastPayout": "date",
    "currency": "string"
  }
  ```

#### 2. Get Affiliate Income History
- **Method**: GET
- **Path**: `/affiliate/income/history`
- **Auth**: Required (Affiliate account only)
- **Query**: `page`, `limit`, `startDate`, `endDate`, `type`
- **Response**: List of income transactions

#### 3. Request Affiliate Income Withdrawal
- **Method**: POST
- **Path**: `/affiliate/income/withdraw`
- **Auth**: Required (Affiliate account only)
- **Body**:
  ```json
  {
    "amount": "number",
    "bankDetails": {
      "accountNumber": "string",
      "routingNumber": "string",
      "bankName": "string"
    },
    "currency": "string"
  }
  ```
- **Response**: Withdrawal request confirmation

#### 4. Get Affiliate Commission Rates
- **Method**: GET
- **Path**: `/affiliate/commission-rates`
- **Auth**: Required (Affiliate account only)
- **Response**: List of commission rates by business type

#### 5. Get Affiliate Referrals
- **Method**: GET
- **Path**: `/affiliate/referrals`
- **Auth**: Required (Affiliate account only)
- **Query**: `page`, `limit`, `status`
- **Response**: List of referred users/businesses

## Admin Endpoints (For Managing Deposits and Income)

#### 1. Set Security Deposit Amount (Admin)
- **Method**: PUT
- **Path**: `/admin/security-deposit/{agencyId}`
- **Auth**: Admin only
- **Body**:
  ```json
  {
    "depositAmount": "number",
    "currency": "string"
  }
  ```

#### 2. Process Security Deposit Refund (Admin)
- **Method**: POST
- **Path**: `/admin/security-deposit/refund/{agencyId}`
- **Auth**: Admin only
- **Body**:
  ```json
  {
    "amount": "number",
    "reason": "string"
  }
  ```

#### 3. Set Affiliate Commission Rates (Admin)
- **Method**: PUT
- **Path**: `/admin/affiliate/commission-rates`
- **Auth**: Admin only
- **Body**:
  ```json
  [
    {
      "businessType": "string",
      "rate": "number",
      "description": "string"
    }
  ]
  ```

#### 4. Process Affiliate Payout (Admin)
- **Method**: POST
- **Path**: `/admin/affiliate/payout/{affiliateId}`
- **Auth**: Admin only
- **Body**:
  ```json
  {
    "amount": "number",
    "paymentMethod": "bank|wallet"
  }
  ```

## Database Entities Required

### Security Deposit Entity
```typescript
{
  id: string;
  agencyId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'refunded' | 'partial_refund';
  paymentDate: Date;
  refundDate?: Date;
  transactionId: string;
}
```

### Affiliate Income Entity
```typescript
{
  id: string;
  affiliateId: string;
  amount: number;
  currency: string;
  type: 'commission' | 'bonus' | 'withdrawal';
  referralId?: string;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: Date;
  paidAt?: Date;
}
```

## Implementation Notes
- All endpoints must validate user account type (business/affiliate)
- Use existing transaction and wallet entities where possible
- Implement proper authorization guards
- Add rate limiting for sensitive operations
- Ensure PCI compliance for payment operations
- Implement webhook handling for payment confirmations
- Add comprehensive logging for audit trails</content>
<parameter name="filePath">D:\vero2 new\apps\payment\SECURITY-DEPOSIT-AFFILIATE-INCOME-ROUTES.md