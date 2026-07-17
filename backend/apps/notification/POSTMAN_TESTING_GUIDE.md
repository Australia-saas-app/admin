# Vero2 Notification Service - Postman Testing Guide

This guide will help you test the Vero2 Notification Service using the provided Postman collection.

## 📋 Prerequisites

1. **Notification Service Running**: Make sure the notification service is running on `http://localhost:3006`
2. **Database Setup**: Ensure PostgreSQL and MongoDB are running and configured
3. **JWT Token**: You need a valid JWT token from your SSO service
4. **Postman**: Latest version of Postman installed

## 🚀 Setup Instructions

### 1. Import the Collection
- Open Postman
- Click **Import** button
- Select **File**
- Choose `Vero2-Notification-Service.postman_collection.json`
- The collection will appear in your workspace

### 2. Configure Environment Variables
Create a new environment in Postman and set these variables:

```
base_url = http://localhost:3006/notification-service
JWT_TOKEN = your_jwt_token_here
user_id = test_user_id
notification_id = test_notification_id
channel_id = test_channel_id
template_id = test_template_id
schedule_id = test_schedule_id
```

**Important**: Replace `your_jwt_token_here` with an actual JWT token from your SSO service.

### 3. Authentication
The collection is configured with Bearer token authentication. Make sure to:
- Get a valid JWT token from your SSO service
- Set it in the `JWT_TOKEN` environment variable
- All requests will automatically include this token

## 🧪 Testing Workflow

Follow this order to test the notification service:

### 1. Health Check
Start with the health check to ensure the service is running:
- **Health Check > Service Health**
- Should return: `{"status": "ok", "service": "notification-service", ...}`

### 2. Set Up Channels
Create notification channels first:
- **Channels > Create Channel** (Email)
- **Channels > Create Channel** (SMS)
- **Channels > Create Channel** (Push)
- **Channels > Get All Channels** - Verify channels were created

### 3. Create Templates
Set up notification templates:
- **Templates > Create Template** - Create order confirmation template
- **Templates > Create Template** - Create welcome email template
- **Templates > Get All Templates** - Verify templates

### 4. Configure User Preferences
Set up user notification preferences:
- **Preferences > Create Preferences** - Create order update preferences
- **Preferences > Create Preferences** - Create promotional preferences
- **Preferences > Get User Preferences** - Verify preferences

### 5. Create Notifications
Test notification creation and management:
- **Notifications > Create Notification** - Create a test notification
- **Notifications > Get User Notifications** - View notifications
- **Notifications > Mark Notification as Read** - Mark as read
- **Notifications > Get Notification Statistics** - View stats

### 6. Test Delivery
Test notification delivery:
- **Delivery > Send Notification** - Send test email
- **Delivery > Send Notification** - Send test SMS
- **Delivery > Bulk Send Notifications** - Send multiple notifications

### 7. Set Up Schedules
Test scheduled notifications:
- **Schedules > Create Schedule** - Create weekly report schedule
- **Schedules > Get All Schedules** - View schedules
- **Schedules > Execute Schedule Manually** - Test execution

### 8. Check Logs
Verify delivery and system logs:
- **Logs > Get Notification Logs** - View delivery logs
- **Logs > Get Delivery Statistics** - View analytics
- **Logs > Get User Logs** - View user-specific logs

## 📊 Sample Request Bodies

### Creating a Channel (Email)
```json
{
  "name": "email",
  "description": "Email notification channel via SendGrid",
  "isActive": true,
  "config": {
    "apiKey": "your_sendgrid_api_key",
    "fromEmail": "noreply@vero2.com",
    "fromName": "Vero2 Platform"
  }
}
```

### Creating a Template
```json
{
  "name": "Order Confirmation",
  "type": "order_confirmation",
  "description": "Template for order confirmation emails",
  "subject": "Order Confirmation - Order #{{orderId}}",
  "content": "Dear {{userName}},\n\nThank you for your order! Your order #{{orderId}} has been confirmed.\n\nOrder Details:\n- Total: {{amount}}\n- Expected Delivery: {{deliveryDate}}\n\nBest regards,\nVero2 Team",
  "variables": ["userName", "orderId", "amount", "deliveryDate"],
  "isActive": true
}
```

### Creating User Preferences
```json
{
  "notificationType": "order_updates",
  "channels": {
    "email": true,
    "sms": false,
    "push": true,
    "inApp": true
  },
  "isEnabled": true,
  "schedule": {
    "startTime": "09:00",
    "endTime": "21:00",
    "daysOfWeek": [1, 2, 3, 4, 5, 6, 7]
  }
}
```

### Creating a Schedule
```json
{
  "name": "Weekly Report",
  "description": "Send weekly analytics report every Monday",
  "notificationType": "weekly_report",
  "templateData": {
    "reportType": "weekly",
    "metrics": ["users", "orders", "revenue"]
  },
  "targetUsers": ["admin_1", "admin_2"],
  "cronExpression": "0 9 * * 1",
  "channels": {
    "email": true,
    "sms": false,
    "push": false,
    "inApp": true
  },
  "isActive": true
}
```

## 🔍 Common Issues & Solutions

### 401 Unauthorized
- **Cause**: Invalid or expired JWT token
- **Solution**: Get a fresh token from SSO service and update `JWT_TOKEN` variable

### 400 Bad Request
- **Cause**: Invalid request body or missing required fields
- **Solution**: Check the request body matches the expected schema

### 404 Not Found
- **Cause**: Resource doesn't exist or wrong ID
- **Solution**: Verify the ID variables are set correctly

### 500 Internal Server Error
- **Cause**: Service error, database connection issues
- **Solution**: Check service logs and database connections

## 📈 Testing Checklist

- [ ] Health check passes
- [ ] Can create notification channels
- [ ] Can create notification templates
- [ ] Can set user preferences
- [ ] Can create and manage notifications
- [ ] Can send notifications via different channels
- [ ] Can schedule notifications
- [ ] Can view delivery logs and statistics
- [ ] Authentication works correctly
- [ ] Pagination works on list endpoints
- [ ] Filtering works on search endpoints

## 🎯 Next Steps

After testing the basic functionality:
1. Configure real provider API keys (SendGrid, Twilio, Firebase)
2. Test with actual email addresses and phone numbers
3. Set up automated tests
4. Monitor logs and analytics
5. Configure production environment

## 📞 Support

If you encounter issues:
1. Check the service logs in the terminal
2. Verify database connections
3. Ensure all environment variables are set
4. Check Postman console for detailed request/response information

The notification service is now ready for comprehensive testing! 🚀