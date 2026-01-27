# Shoe Store API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Shoes](#shoes)
3. [Admin](#admin)
4. [Users](#users)
5. [Cart](#cart)

## Authentication

### Register User
- **Endpoint**: `POST /api/v1/user/register`
- **Description**: Creates a new user account
- **Request Body**:
  ```json
  {
    "username": "string (required)",
    "email": "string (required)",
    "password": "string (required, min 6 chars)"
  }
  ```
- **Response**:
  ```json
  {
    "success": boolean,
    "message": "string",
    "token": "string (JWT token)",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
  ```

### Login User
- **Endpoint**: `POST /api/v1/user/login`
- **Description**: Authenticates user and returns JWT token
- **Request Body**:
  ```json
  {
    "username": "string (required)",
    "password": "string (required)"
  }
  ```
- **Response**:
  ```json
  {
    "success": boolean,
    "message": "string",
    "token": "string (JWT token)",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
  ```

### Logout User
- **Endpoint**: `POST /api/v1/user/logout`
- **Description**: Clears the auth token from cookies
- **Response**:
  ```json
  {
    "success": boolean
  }
  ```

### Current User (Me)
- **Endpoint**: `GET /api/v1/user/me`
- **Description**: Gets the currently authenticated user's information
- **Headers**: `Authorization: Bearer <token>` or `Cookie: auth-token=<token>`
- **Response**:
  ```json
  {
    "success": boolean,
    "user": {
      "userId": "string",
      "username": "string",
      "email": "string"
    }
  }
  ```

## Shoes

### Get All Shoes
- **Endpoint**: `GET /api/v1/shoe`
- **Description**: Retrieves all shoes with optional filtering, pagination, and sorting
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `brand`: Filter by brand
  - `minPrice`: Minimum price filter
  - `maxPrice`: Maximum price filter
  - `inStock`: Filter only in-stock items (`true`)
  - `search`: Search term for name/description
  - `sortBy`: Field to sort by (default: createdAt)
  - `order`: Sort order (`asc` or `desc`, default: desc)
- **Response**:
  ```json
  {
    "success": boolean,
    "message": "string",
    "data": [
      {
        "_id": "string",
        "name": "string",
        "releaseYear": "number",
        "description": "string",
        "price": "number",
        "stock": "number",
        "brand": "string",
        "size": ["array"],
        "color": ["array"],
        "images": ["array"],
        "createdAt": "date string",
        "updatedAt": "date string"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalShoes": "number",
      "limit": "number"
    }
  }
  ```

### Get Shoe by ID
- **Endpoint**: `GET /api/v1/shoe/:id`
- **Description**: Retrieves a specific shoe by ID
- **URL Parameter**: `id` - The ID of the shoe
- **Response**:
  ```json
  {
    "success": boolean,
    "message": "string",
    "data": {
      "_id": "string",
      "name": "string",
      "releaseYear": "number",
      "description": "string",
      "price": "number",
      "stock": "number",
      "brand": "string",
      "size": ["array"],
      "color": ["array"],
      "images": ["array"],
      "createdAt": "date string",
      "updatedAt": "date string"
    }
  }
  ```

## Admin

### Admin Middleware
- **adminOnly**: Allows access only to users with the `admin` role
- **adminAndModOnly**: Allows access to users with either `admin` or `moderator` role

### Admin Shoes

#### Add Shoe
- **Endpoint**: `POST /api/v1/admin/shoe`
- **Description**: Creates a new shoe (admin and moderator only)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "string (required)",
    "price": "number (required)",
    "releaseYear": "number",
    "description": "string",
    "stock": "number",
    "brand": "string",
    "size": ["array"],
    "color": ["array"],
    "images": ["array"]
  }
  ```
- **Response**:
  ```json
  {
    "success": boolean,
    "message": "string",
    "data": {
      "_id": "string",
      "name": "string",
      "releaseYear": "number",
      "description": "string",
      "price": "number",
      "stock": "number",
      "brand": "string",
      "size": ["array"],
      "color": ["array"],
      "images": ["array"],
      "createdAt": "date string",
      "updatedAt": "date string"
    }
  }
  ```

#### Edit Shoe
- **Endpoint**: `PUT /api/v1/admin/shoe/:id`
- **Description**: Updates an existing shoe (admin and moderator only)
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameter**: `id` - The ID of the shoe to update
- **Request Body**: Same as Add Shoe
- **Response**:
  ```json
  {
    "success": boolean,
    "message": "string",
    "data": {
      "_id": "string",
      "name": "string",
      "releaseYear": "number",
      "description": "string",
      "price": "number",
      "stock": "number",
      "brand": "string",
      "size": ["array"],
      "color": ["array"],
      "images": ["array"],
      "createdAt": "date string",
      "updatedAt": "date string"
    }
  }
  ```

#### Update Stock
- **Endpoint**: `PATCH /api/v1/admin/shoe/:id`
- **Description**: Updates the stock of a shoe (admin and moderator only)
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameter**: `id` - The ID of the shoe to update
- **Request Body**:
  ```json
  {
    "quantity": "number (positive to increase, negative to decrease)"
  }
  ```
- **Response**:
  ```json
  {
    "success": boolean,
    "message": "string",
    "data": {
      "shoe": { /* updated shoe object */ },
      "previousStock": "number",
      "newStock": "number"
    }
  }
  ```

#### Delete Shoe
- **Endpoint**: `DELETE /api/v1/admin/shoe/:id`
- **Description**: Deletes a shoe (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameter**: `id` - The ID of the shoe to delete
- **Response**:
  ```json
  {
    "success": boolean,
    "message": "string",
    "data": {
      "deletedShoeId": "string",
      "name": "string"
    }
  }
  ```

### Admin Users

#### Get All Users
- **Endpoint**: `GET /api/v1/admin/user`
- **Description**: Retrieves all users with optional filtering and pagination (admin and moderator only)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `role`: Filter by role
  - `search`: Search term for username/email
- **Response**:
  ```json
  {
    "success": boolean,
    "data": [
      {
        "_id": "string",
        "username": "string",
        "email": "string",
        "role": "string",
        "lastLogin": "date string",
        "createdAt": "date string",
        "updatedAt": "date string"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalUsers": "number",
      "limit": "number"
    }
  }
  ```

#### Get User by ID
- **Endpoint**: `GET /api/v1/admin/user/:id`
- **Description**: Retrieves a specific user by ID (admin and moderator only)
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameter**: `id` - The ID of the user
- **Response**:
  ```json
  {
    "success": boolean,
    "message": "string",
    "data": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "lastLogin": "date string",
      "createdAt": "date string",
      "updatedAt": "date string"
    }
  }
  ```

#### Create User
- **Endpoint**: `POST /api/v1/admin/user`
- **Description**: Creates a new user (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "username": "string (required)",
    "email": "string (required)",
    "password": "string (required, min 6 chars)",
    "role": "string (optional, only admin can specify)"
  }
  ```
- **Response**:
  ```json
  {
    "success": boolean,
    "message": "string",
    "token": "string",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
  ```

#### Update User
- **Endpoint**: `PUT /api/v1/admin/user/:id`
- **Description**: Updates a user's information (admin and user own profile)
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameter**: `id` - The ID of the user to update
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "role": "string (admin only)",
    "password": "string (min 6 chars)"
  }
  ```
- **Response**:
  ```json
  {
    "success": boolean,
    "message": "string",
    "data": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "lastLogin": "date string",
      "createdAt": "date string",
      "updatedAt": "date string"
    }
  }
  ```

#### Delete User
- **Endpoint**: `DELETE /api/v1/admin/user/:id`
- **Description**: Deletes a user (admin only, cannot delete self)
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameter**: `id` - The ID of the user to delete
- **Response**:
  ```json
  {
    "success": boolean,
    "message": "string",
    "data": {
      "deletedUserId": "string",
      "username": "string"
    }
  }
  ```

## Cart

### Get Cart
- **Endpoint**: `GET /api/v1/user/cart`
- **Description**: Retrieves the current user's cart
- **Headers**: `Authorization: Bearer <token>` or `Cookie: auth-token=<token>`
- **Response**:
  ```json
  {
    "success": boolean,
    "message": "string",
    "data": {
      "_id": "string",
      "userId": "string",
      "items": [
        {
          "shoeId": {
            "_id": "string",
            "name": "string",
            "brand": "string",
            "images": ["array"],
            "price": "number"
          },
          "quantity": "number",
          "size": "string",
          "color": "string",
          "priceAtAdd": "number",
          "_id": "string"
        }
      ],
      "totals": {
        "subtotal": "number",
        "discount": "number",
        "total": "number",
        "itemCount": "number"
      }
    }
  }
  ```

### Add to Cart
- **Endpoint**: `POST /api/v1/user/cart`
- **Description**: Adds an item to the cart
- **Headers**: `Authorization: Bearer <token>` or `Cookie: auth-token=<token>`
- **Request Body**:
  ```json
  {
    "shoeId": "string (required)",
    "size": "string (required)",
    "color": "string (required)",
    "quantity": "number (default: 1)"
  }
  ```
- **Response**:
  ```json
  {
    "success": boolean,
    "message": "string",
    "data": {
      "cart": { /* cart object */ },
      "totals": { /* totals object */ }
    }
  }
  ```

### Update Cart Item Quantity
- **Endpoint**: `PUT /api/v1/user/cart`
- **Description**: Updates the quantity of a specific item in the cart
- **Headers**: `Authorization: Bearer <token>` or `Cookie: auth-token=<token>`
- **Request Body**:
  ```json
  {
    "itemId": "string (required, item ID from cart)",
    "quantity": "number (minimum: 1)"
  }
  ```
- **Response**:
  ```json
  {
    "success": boolean,
    "message": "string",
    "data": {
      "cart": { /* cart object */ },
      "totals": { /* totals object */ }
    }
  }
  ```

### Clear Cart
- **Endpoint**: `DELETE /api/v1/user/cart`
- **Description**: Removes all items from the cart
- **Headers**: `Authorization: Bearer <token>` or `Cookie: auth-token=<token>`
- **Response**:
  ```json
  {
    "success": boolean,
    "message": "string"
  }
  ```

### Remove Cart Item
- **Endpoint**: `DELETE /api/v1/user/cart/:itemId`
- **Description**: Removes a specific item from the cart
- **Headers**: `Authorization: Bearer <token>` or `Cookie: auth-token=<token>`
- **URL Parameter**: `itemId` - The ID of the cart item to remove
- **Response**:
  ```json
  {
    "success": boolean,
    "message": "string",
    "data": { /* cart object with updated totals or empty cart data */}
  }
  ```

## Error Responses
Common error responses include:
```json
{
  "success": false,
  "message": "string",
  "error": "string (for internal server errors)"
}
```

Status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error