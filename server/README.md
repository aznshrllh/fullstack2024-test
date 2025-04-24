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

#Server
PORT=3000

#Database
DB_USERNAME=postgres DB_PASSWORD=postgres DB_NAME=test_ASI_Asia_Pasific DB_HOST=127.0.0.1

#Redis
REDIS_HOST=localhost REDIS_PORT=6379

AWS S3
AWS_ACCESS_KEY_ID=your_access_key AWS_SECRET_ACCESS_KEY=your_secret_key AWS_BUCKET_NAME=your_bucket_name AWS_REGION=your_aws_region
