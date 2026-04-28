# Full-Stack Notes App

## Tech Stack

**Frontend:**
* [React 18](https://react.dev/) - UI Library
* [Vite](https://vitejs.dev/) - Frontend Tooling & Bundler
* [TypeScript](https://www.typescriptlang.org/) - Static Typing
* [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework

**Backend:**
* [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) - Web framework for the REST API
* [MySQL](https://www.mysql.com/) - Relational Database
* `mysql2/promise` - Database driver

**Getting Started**

Prerequisites
* Node.js installed on your machine
* MySQL Server running (e.g., via XAMPP)

Installation
1. Clone the repository
2. Configure Environment

	Create a .env file in the backend/
```
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=notes_db
DB_PORT=3306
```
3. Install dependencies
```
npm install
npm run dev
```
* The backend will start at http://localhost:3000 
* The frontend will start at http://localhost:5173
