# Technology Project & Proposal Postman Testing Guide

## Overview
This guide provides instructions for testing the specific Project and Proposal routes in the Technology service. These routes allow for creating projects, filtering them, submitting proposals, and selecting the best proposal.

## Prerequisites
- **Technology Service**: Running on port 3011 (`http://localhost:3011`)
- **SSO Service**: Running on port 3001 (for authentication)
- **JWT Token**: Required for all routes

## Step 1: Postman Setup
1. Import `test postman collection/Technology Project & Proposal.postman_collection.json` into Postman.
2. Configure Collection Variables:
   - `base_url`: `http://localhost:3011` (Default)
   - `jwt_token`: Enter a valid JWT token obtained from the SSO Service.
   - `project_id`: (Will be populated after creating a project)
   - `proposal_id`: (Will be populated after filtering/finding a proposal)

## Step 2: Testing Routes

### 1. Project Management
- **Create New Project**:
  - `POST {{base_url}}/api/technical/projects`
  - Creates a new project with details like price, category, and skills.
  - *Response*: Captures the `projectId` for subsequent requests.

- **Find/Filter Project**:
  - `GET {{base_url}}/api/technical/projects`
  - Supports filtering by `search`, `category`, `paymentType`, `price`, and `skills`.
  - Use these filters to find the project you just created or existing ones.

### 2. Proposal Management
- **Create Proposal (Apply to Project)**:
  - `POST {{base_url}}/api/technical/projects/{{project_id}}/apply`
  - Submit a proposal for a specific project.
  - Requires `project_id` to be set in variables.

- **Filter Proposals**:
  - `GET {{base_url}}/api/technical/projects/{{project_id}}/proposals`
  - List and filter proposals submitted for a specific project.
  - Helps in identifying the `proposal_id` you want to accept.

- **Assign Proposal (Select Proposal)**:
  - `PATCH {{base_url}}/api/technical/projects/{{project_id}}/proposals/{{proposal_id}}/select`
  - Selects and assigns a specific proposal to the project.
  - Marks the project as having an accepted proposal.

## Troubleshooting
- **401 Unauthorized**: Ensure your `jwt_token` is valid and not expired.
- **403 Forbidden**: Verify that your user account type has permission to create or manage projects.
- **404 Not Found**: Ensure the `project_id` or `proposal_id` in your variables exists in the database.

## Notes
- These routes are part of the Technology Service (`apps/technology`).
- For full service documentation, refer to `apps/technology/API-DOCUMENTATION.md`.
