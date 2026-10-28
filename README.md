# BookNest API

A RESTful Book Management API built with Node.js, Express.js, and MongoDB using Mongoose.

## Features

- Create new books
- Retrieve all books
- Retrieve a single book
- Update books using PUT
- Update books partially using PATCH
- Delete books
- Pagination
- JSON responses and HTTP status codes
- Request logging middleware
- Environment variable configuration

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Postman
- Git and GitHub

## Installation

1. Clone the repository:

   bash
   git clone https://github.com/chukkie1234/BACKENDNEST-API.git
   

2. Enter the project directory:

   bash
   cd BACKENDNEST-API
   

3. Install dependencies:

   bash
   npm install
   

4. Create a .env file in the project root and configure your environment variables:

   env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   

5. Start the development server using the script configured in package.json:

   bash
   npm run dev
   

## API Endpoints

Base URL: http://localhost:3000

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/books | Retrieve books |
| GET | /api/books/:id | Retrieve a book by ID |
| POST | /api/books | Create a book |
| PUT | /api/books/:id | Replace/update a book |
| PATCH | /api/books/:id | Partially update a book |
| DELETE | /api/books/:id | Delete a book |

## Pagination

The books endpoint supports pagination using query parameters.

Example:

GET /api/books?page=1&limit=2

## Testing

API endpoints can be tested using Postman.

## Security

- Keep .env out of GitHub.
- Never publish database credentials.
- Keep node_modules out of GitHub.
- Use .gitignore to exclude sensitive files.

## Author

BookNest API Project