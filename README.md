# Shoe Store Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). A full-featured shoe store application with user authentication, cart functionality, and admin capabilities.

## Features

- **User Authentication**: Register, login, and logout functionality
- **Shoe Management**: Browse, search, and filter shoes
- **Shopping Cart**: Add/remove items, update quantities
- **Admin Panel**: Manage products, users, and inventory
- **Role-based Access Control**: Admin, moderator, and user roles

## API Documentation

Complete API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## Getting Started

First, you'll need to set up your environment variables. Create a `.env.local` file in the root directory with the following required variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

In the project directory, you can run:

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint for code quality
- `npm run seed:admin` - Seeds the database with an admin user
- `npm run seed:shoe` - Seeds the database with sample shoes

## Project Structure

- `app/api/v1` - REST API endpoints
  - `admin/` - Admin-specific endpoints
  - `shoe/` - Shoe-related endpoints
  - `user/` - User authentication and cart endpoints
- `app/controllers` - Business logic controllers
- `app/models` - Mongoose models
- `app/libs` - Utility libraries (database, authentication)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
