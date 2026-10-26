# MongoDB Login System

A simple Node.js authentication app built with Express and MongoDB. It supports user signup and login with password hashing using bcrypt, and stores user credentials in a MongoDB collection.

## Features

- User signup with email validation
- Secure password hashing with bcrypt
- Login with email/password verification
- MongoDB-backed user storage
- Static frontend served from the `public` folder

## Tech Stack

- Node.js
- Express
- MongoDB Node.js driver
- bcrypt
- dotenv

## Project Structure

```text
.
├── public/
│   └── ... frontend files
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- MongoDB database connection string

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
PORT=3000
```

Example:

```env
MONGODB_URI=mongodb+srv://admin:password@cluster0.mongodb.net/UserLoginDB
PORT=3000
```

## Run the App

Start the server:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## API Endpoints

### POST /signup
Creates a new user account.

Request body:

```json
{
  "email": "user@example.com",
  "password": "strongPassword123"
}
```

Validation rules:
- Email must be valid
- Password must be at least 12 characters and no more than 72 bytes

### POST /login
Authenticates an existing user.

Request body:

```json
{
  "email": "user@example.com",
  "password": "strongPassword123"
}
```

## Notes

- Emails are normalized to lowercase before storing and lookup.
- The app creates a unique index on the `email` field to prevent duplicate accounts.
- Passwords are never stored in plain text.

## License

This project is licensed under the ISC License.
