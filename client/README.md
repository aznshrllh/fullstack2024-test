# Client Management Application

A modern web application for managing client data, built with React, TypeScript, and Vite.

## Features

- 🔍 View and search clients
- ✨ Create new client profiles
- 📝 Update existing client information
- 🗑️ Soft delete functionality
- 🚀 Redis-cached slug lookups
- 🎨 Responsive UI design

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

## Development

```bash
# Start development server
npm run dev
# or
yarn dev

# Build for production
npm run build
# or
yarn build

# Preview production build
npm run preview
# or
yarn preview
```

The application runs at `http://localhost:5173` by default.

## Project Structure

```
client/
├── public/             # Static assets
├── src/
│   ├── assets/         # Media assets
│   ├── components/
│   │   ├── clients/    # Client-specific components
│   │   └── ui/         # UI components
│   ├── configs/        # Configuration files
│   ├── contexts/       # React context providers
│   ├── lib/            # Utility functions
│   ├── App.tsx         # Main application component
│   ├── App.css         # Global styles
│   ├── index.css       # Tailwind imports
│   └── main.tsx        # Entry point
└── [Config files...]   # Project configuration
```

## Environment Setup

Configure the API base URL in `axiosInstance.ts` for your environment.
