# Admin Panel

Internal admin frontend for the subscription-based social media growth platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure API base URL (optional, defaults to `http://localhost:8000/api`):
```bash
# Create .env file
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
```

3. Run development server:
```bash
npm run dev
```

## Features

- Admin-only authentication
- Route protection middleware
- API composable for backend communication
- Tailwind CSS styling
- Internal operations focus

## Tech Stack

- Nuxt 3
- Tailwind CSS
- TypeScript

