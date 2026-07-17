# Payment Service - Security Deposit Routes

## Overview
This document outlines the endpoints required for implementing security deposit functionality in business and agency accounts.

## User Types Supported
- **Business Account**: Companies that provide services
- **Agency Account**: Agencies that provide services

## Security Deposit for Business Accounts

### Features
- Businesses must pay a security deposit to become active
- Deposit amounts are set by admin
- Deposits can be refunded when account is closed and no outstanding dues
- Partial refunds possible for partial deposit returns

### Endpoints for Business Accounts

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

## Security Deposit for Agency Accounts

### Features
- Agencies must pay a security deposit to become active
- Deposit amounts are set by admin
- Deposits can be refunded when account is closed and no outstanding dues
- Partial refunds possible for partial deposit returns

### Endpoints for Agency Accounts

#### 1. Pay Security Deposit
- **Method**: POST
- **Path**: `/security-deposit/pay`
- **Auth**: Required (Agency account only)
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
- **Auth**: Required (Agency account only)
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
- **Auth**: Required (Agency account only)
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
- **Auth**: Required (Agency account only)
- **Query**: `page`, `limit`, `startDate`, `endDate`
- **Response**: List of deposit transactions

## Admin Endpoints (For Managing Deposits for Business and Agency Accounts)

#### 1. Set Security Deposit Amount (Admin)
- **Method**: PUT
- **Path**: `/admin/security-deposit/{businessOrAgencyId}`
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
- **Path**: `/admin/security-deposit/refund/{businessOrAgencyId}`
- **Auth**: Admin only
- **Body**:
  ```json
  {
    "amount": "number",
    "reason": "string"
  }
  ```

## Database Entities Required

### Security Deposit Entity
```typescript
{
  id: string;
  businessOrAgencyId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'refunded' | 'partial_refund';
  paymentDate: Date;
  refundDate?: Date;
  transactionId: string;
}
```

## Implementation Notes
- Business account endpoints must validate user account type (business)
- Agency account endpoints must validate user account type (agency)
- Use existing transaction and wallet entities where possible
- Implement proper authorization guards
- Add rate limiting for sensitive operations
- Ensure PCI compliance for payment operations
- Implement webhook handling for payment confirmations
- Add comprehensive logging for audit trails
- Use existing transaction and wallet entities where possible
- Implement proper authorization guards
- Add rate limiting for sensitive operations
- Ensure PCI compliance for payment operations
- Implement webhook handling for payment confirmations
- Add comprehensive logging for audit trails