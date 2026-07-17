# Vero2 Notification Service

A comprehensive notification service microservice built with NestJS that handles all notification-related operations including channels, templates, scheduling, delivery, and logging.

## Features

### ✅ Notification Generation
- Create notifications from templates
- Support for dynamic content replacement
- Bulk notification generation

### ✅ Notification Channels
- **Email**: SendGrid integration
- **SMS**: Twilio integration
- **Push Notifications**: Firebase integration
- **In-App**: Internal notifications

### ✅ User Preferences
- Per-user notification preferences
- Channel-specific settings
- Time-based scheduling preferences
- Notification type filtering

### ✅ Notification Scheduling
- Cron-based scheduling
- Recurring notifications
- Manual execution
- Active/inactive scheduling

### ✅ Delivery Service
- Multi-channel delivery
- Delivery status tracking
- Error handling and retries
- Provider-specific configurations

### ✅ Notification History & Logging
- Comprehensive delivery logs
- Status tracking (sent, delivered, read, failed)
- Analytics and reporting
- User-specific log retrieval

### ✅ Template Management
- Dynamic notification templates
- Variable substitution
- Template versioning
- Preview functionality

## API Endpoints

### Notifications
- `GET /notifications` - Get user notifications
- `POST /notifications` - Create notification
- `PUT /notifications/:id/read` - Mark as read
- `DELETE /notifications/:id` - Delete notification

### Channels
- `GET /channels` - Get all channels
- `POST /channels` - Create channel
- `PUT /channels/:id` - Update channel
- `POST /channels/:id/test` - Test channel

### Templates
- `GET /templates` - Get all templates
- `POST /templates` - Create template
- `PUT /templates/:id` - Update template
- `POST /templates/:id/preview` - Preview template

### Preferences
- `GET /preferences` - Get user preferences
- `PUT /preferences` - Update preferences
- `POST /preferences/reset` - Reset to defaults

### Schedules
- `GET /schedules` - Get all schedules
- `POST /schedules` - Create schedule
- `PUT /schedules/:id/toggle` - Toggle schedule

### Delivery
- `POST /delivery/send` - Send notification
- `POST /delivery/bulk-send` - Bulk send

### Logs
- `GET /logs` - Get notification logs
- `GET /logs/stats` - Get delivery statistics

## Installation

1. **Clone and navigate to the service:**
   ```bash
   cd apps/notification-service
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.template .env
   # Edit .env with your configuration
   ```

4. **Run database migrations:**
   ```bash
   npm run migration:run
   ```

5. **Start the service:**
   ```bash
   npm run start:dev
   ```

## Database Schema

The service uses PostgreSQL for relational data and MongoDB for logs/analytics. Key entities:

- `notification_channels` - Channel configurations
- `user_notification_preferences` - User preferences
- `notification_templates` - Message templates
- `notification_schedules` - Scheduled notifications
- `user_notifications` - User-specific notifications
- `notification_logs` - Delivery logs

## Docker

Build and run with Docker:

```bash
# Build
docker build -t vero2-notification-service .

# Run
docker run -p 3006:3006 --env-file .env vero2-notification-service
```

## Health Check

The service includes health check endpoints:
- `GET /notification-service/health` - Service health

## API Documentation

Access Swagger documentation at:
- `http://localhost:3006/notification-service/docs`

## Development

### Available Scripts
- `npm run start:dev` - Development server with hot reload
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Lint code

### Project Structure
```
src/
├── common/           # Shared utilities and guards
├── entities/         # Database entities
├── notifications/    # User notification management
├── channels/         # Notification channels
├── templates/        # Template management
├── preferences/      # User preferences
├── schedules/        # Notification scheduling
├── delivery/         # Message delivery
├── logs/            # Logging and analytics
└── health/          # Health checks
```

## Contributing

1. Follow the existing code structure
2. Add proper validation and error handling
3. Include API documentation
4. Add tests for new features
5. Update this README for new features