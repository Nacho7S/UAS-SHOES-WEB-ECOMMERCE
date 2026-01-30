# Shoe Store Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). A full-featured shoe store application with user authentication, cart functionality, and admin capabilities.

this website already deployed you can see on this Link:
[shoe-store](https://uas-shoes-web-ecommerce.vercel.app/home)

## Features

- **User Authentication**: Register, login, and logout functionality
- **Shoe Management**: Browse, search, and filter shoes
- **Shopping Cart**: Add/remove items, update quantities
- **Admin Panel**: Manage products, users, and inventory
- **Role-based Access Control**: Admin, moderator, and user roles

## API Documentation

Complete API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## Application Routes

The application follows the Next.js App Router structure with the following pages:

### Public Routes
- `/home` - Main product browsing page with search, filtering, and sorting capabilities
  ![Home Page](/public/images/home.png)
- `/login` - User authentication page
  ![Login Page](/public/images/login.png)
- `/register` - User registration page
  ![Register Page](/public/images/register.png)
- `/shoe/[id]` - Individual shoe detail page with options to add to cart
  ![Shoe Detail Page](/public/images/shoe⁄[id].png)

### User Routes (Requires Authentication)
- `/profile` - User profile management page
  ![Profile Page](/public/images/profile.png)
- `/cart` - Shopping cart page with item management
  ![Cart Page](/public/images/cart.png)
- `/checkout` - Checkout process page (currently under construction)

- `/orders` - Order history page (currently under construction)
  ![Orders Page](/public/images/cart.png)

### Admin Routes (Requires Admin/Moderator Role)
- `/admin` - Admin dashboard landing page
  ![Admin Dashboard](/public/images/admin-dahsboard.png)
- `/admin/shoe` - Shoe inventory management page
  ![Shoe Dashboard](/public/images/shoe-dashboard.png)
- `/admin/shoe/new` - Create new shoe form
  ![Add Shoe Form](/public/images/add-shoe-form.png)
- `/admin/shoe/[id]` - Edit existing shoe form
  ![Edit Shoe Form](/public/images/edit-shoe-form.png)
- `/admin/user` - User management page with CRUD operations
  ![User Management](/public/images/user-dashboard.png)
  ![Add User Form](/public/images/add-user.png)
  ![Edit User Form](/public/images/edit-user.png)

## Layout Structure

The application uses a single root layout located at `app/layout.tsx` which provides:
- Global metadata (title and description)
- Shared providers (Auth and Cart)
- Common UI elements (Navbar)
- Global styles and fonts (Geist and Geist Mono)
- Root HTML and body structure

All pages inherit from this root layout, ensuring consistent styling and functionality across the application.

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
