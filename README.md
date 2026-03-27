# Teacher Portal — Full Stack Application

A full-stack application built with **CodeIgniter (PHP)** backend, **ReactJS** frontend, and **MySQL** database. Features token-based authentication and a teacher management system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | ReactJS |
| Backend | CodeIgniter (PHP) |
| Database | MySQL |
| Auth | Token-based Authentication |

---

## Project Structure

```
teacher-portal/
├── frontend/                # ReactJS application
├── teacher-portal-backend/  # CodeIgniter PHP backend
├── database/
│   └── schema.sql           # Database schema (import this first)
└── README.md
```

---

## Prerequisites

Make sure you have the following installed:
- **PHP** >= 7.4
- **Composer**
- **MySQL** >= 5.7
- **Node.js** >= 16 & **npm**
- **XAMPP / WAMP** (or any local server)

---

## Setup Instructions

### Step 1: Database Setup
1. Open **phpMyAdmin** or your MySQL client
2. Create a new database:
   ```sql
   CREATE DATABASE teacher_portal;
   ```
3. Import the schema:
   - Go to `database/schema.sql`
   - Import it into the `teacher_portal` database

---

### Step 2: Backend Setup (CodeIgniter)

1. Navigate to the backend folder:
   ```bash
   cd teacher-portal-backend
   ```

2. Install dependencies:
   ```bash
   composer install
   ```

3. Configure the database in `app/Config/Database.php`:
   ```php
   'hostname' => 'localhost',
   'username' => 'root',
   'password' => '',        // your MySQL password
   'database' => 'teacher_portal',
   ```

4. Start the CodeIgniter server:
   ```bash
   php spark serve
   ```
   > Backend runs at: `http://localhost:8080`

---

### Step 3: Frontend Setup (ReactJS)

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   > Frontend runs at: `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get token | No |
| POST | `/api/teachers` | Add teacher (inserts into both tables) | Yes |
| GET | `/api/teachers` | Get all teachers | Yes |
| GET | `/api/auth/users` | Get all users | Yes |

> All protected routes require `Authorization: Bearer <token>` header.

---

## Database Schema

### `auth_user` table
| Column | Type | Description |
|---|---|---|
| id | INT (PK) | Auto-increment primary key |
| email | VARCHAR | User email (unique) |
| first_name | VARCHAR | First name |
| last_name | VARCHAR | Last name |
| password | VARCHAR | Hashed password |

### `teachers` table
| Column | Type | Description |
|---|---|---|
| id | INT (PK) | Auto-increment primary key |
| user_id | INT (FK) | References `auth_user.id` |
| university_name | VARCHAR | University name |
| gender | VARCHAR | Gender |
| year_joined | YEAR | Year joined |

---

## Features

- ✅ Register & Login with token-based authentication
- ✅ Token validation on all protected API routes
- ✅ Single POST API inserts into both `auth_user` and `teachers` tables
- ✅ ReactJS frontend with Login, Register pages
- ✅ Datatable views for Auth Users and Teachers data
- ✅ 1-1 relationship between `auth_user` and `teachers`

---

## Author

**Harshwardhan Trivedi**
