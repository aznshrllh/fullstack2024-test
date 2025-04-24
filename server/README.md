# ASI Asia Pacific Fullstack Test 2024

A RESTful API server for client management with Redis caching and AWS S3 storage integration.

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- Redis (for caching)
- AWS S3 (for file storage)

## Prerequisites

- Node.js (v14+)
- PostgreSQL
- Redis
- AWS account with S3 access

## Environment Variables

Create a `.env` file in the root directory with the following variables:

# Server

PORT=3000

# Database

DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=test_ASI_Asia_Pasific
DB_HOST=127.0.0.1

# Redis

REDIS_HOST=localhost
REDIS_PORT=6379

# AWS S3

AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=your_aws_region

## Installation

1. Clone this repository

```
git clone https://github.com/your-username/fullstack2024-test.git cd fullstack2024-test/server
```

3. Set up the database

Create or modify `config/config.json`:
cd config/config.json

"username": "postgres",
"password": "postgres",
"database": "test_ASI_Asia_Pasific",
"host": "127.0.0.1",
"dialect": "postgres"

4. Start the server

```
npm run dev
```

## API Endpoints

### Clients

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| GET    | `/clients`            | Get all clients      |
| GET    | `/clients/:id`        | Get client by ID     |
| GET    | `/clients/slug/:slug` | Get client by slug   |
| POST   | `/clients`            | Create a new client  |
| PUT    | `/clients/:id`        | Update a client      |
| DELETE | `/clients/:id`        | Soft delete a client |

### Client Object Structure

```json
{
  "name": "Client Name",
  "slug": "client-name",
  "is_project": true,
  "self_capture": false,
  "client_prefix": "CN",
  "client_logo": "https://bucket.s3.region.amazonaws.com/image.jpg",
  "address": "Client Address",
  "phone_number": "+1234567890",
  "city": "Client City"
}
```
