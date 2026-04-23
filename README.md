# Plus Academy System

Plus Academy is a full-stack web system for managing students, classes, attendance, alumni, contact messages, hackathons, hackathon registrations, and dashboard users.

The project is split into two main applications:

- `frontend` - React and Vite web application
- `backend` - Node.js, Express, and MongoDB API server

## Features

- Public website pages for Home, About, Curriculum, Alumni, Contact, Get Started, and Hackathons
- Student registration form and dashboard student management
- Class management with class-based student lists
- Attendance marking, attendance summaries, and attendance export
- Alumni listing and alumni management with image upload support
- Contact form and admin contact message management
- Hackathon listing, details, registration, and dashboard management
- Protected dashboard area at `/waji`
- Dashboard user login and user management
- Excel export for student data

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- React Icons
- Heroicons

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Multer
- ExcelJS
- CORS
- dotenv

## Project Structure

```text
elivate/
  backend/
    Controller/          API controller logic
    Router/              Express route definitions
    model/               Mongoose data models
    uploads/             Uploaded files
    API_ENDPOINTS.md     Student API endpoint notes
    index.js             Backend server entry point
    package.json         Backend scripts and dependencies

  frontend/
    public/              Public assets
    src/
      Components/        Reusable UI components
      Dashboard/         Admin dashboard screens
      context/           Dashboard auth context
      pages/             Public pages
      utils/             API helpers
      App.jsx            Frontend route setup
    package.json         Frontend scripts and dependencies
```

## Requirements

- Node.js
- npm
- MongoDB running locally or a MongoDB connection string

## Environment Variables

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/elivateacademy
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_BASE_URL=http://localhost:5000
```

For production, set `VITE_API_BASE_URL` to the deployed backend domain.

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

## Running the System

Start the backend server:

```bash
cd backend
npm start
```

The backend runs on:

```text
http://localhost:5000
```

Start the frontend development server:

```bash
cd frontend
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

## Frontend Routes

Public routes:

- `/` - Home
- `/about` - About
- `/curriculum` - Curriculum
- `/alumni` - Alumni
- `/contact` - Contact
- `/getstarted` - Get Started
- `/hackathons` - Hackathons
- `/hackathons/:id` - Hackathon details
- `/hackathons/:id/register` - Hackathon registration

Dashboard routes:

- `/waji/login` - Dashboard login
- `/waji` - Dashboard home
- `/waji/manage-users` - Dashboard users
- `/waji/students` - Students
- `/waji/students/:id` - Student details
- `/waji/create` - Create student
- `/waji/classes` - Classes
- `/waji/classes/:className/students` - Students in class
- `/waji/attendance` - Attendance
- `/waji/alumni` - Alumni management
- `/waji/contacts` - Contact messages
- `/waji/hackathons` - Hackathon management
- `/waji/hackathon-registrations` - Hackathon registrations
- `/waji/hackathon-registrations/:id` - Hackathon registration details

## Backend API

Base URL:

```text
http://localhost:5000/api
```

Main API groups:

- `POST /api/register` - Register student
- `GET /api/students` - Get students with search and filters
- `GET /api/students/:id` - Get one student
- `PUT /api/students/:id` - Update student
- `PUT /api/students/:id/status` - Update student status
- `PUT /api/students/class/:className/status` - Bulk update student status by class
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/export/excel` - Export students to Excel
- `POST /api/classes` - Create class
- `GET /api/classes` - Get classes
- `GET /api/classes/:id` - Get one class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class
- `PUT /api/classes/:id/toggle-registration` - Open or close class registration
- `GET /api/classes/:className/students` - Get students by class
- `POST /api/attendance` - Mark attendance
- `POST /api/attendance/bulk` - Mark bulk attendance
- `GET /api/attendance/class/:className` - Get attendance by class
- `GET /api/attendance/class/:className/summary` - Get attendance summary
- `GET /api/attendance/student/:studentId` - Get attendance by student
- `PUT /api/attendance/:id` - Update attendance
- `DELETE /api/attendance/:id` - Delete attendance
- `GET /api/attendance/class/:className/export/google-sheets` - Export attendance format
- `POST /api/contact` - Create contact message
- `GET /api/contacts` - Get contact messages
- `GET /api/contacts/:id` - Get one contact message
- `PUT /api/contacts/:id/status` - Update contact status
- `DELETE /api/contacts/:id` - Delete contact message
- `POST /api/alumni` - Create alumni entry with image upload
- `GET /api/alumni` - Get alumni
- `GET /api/alumni/:id` - Get one alumni entry
- `PUT /api/alumni/:id` - Update alumni entry
- `DELETE /api/alumni/:id` - Delete alumni entry
- `POST /api/hackathons` - Create hackathon
- `GET /api/hackathons` - Get hackathons
- `GET /api/hackathons/:id` - Get one hackathon
- `PUT /api/hackathons/:id` - Update hackathon
- `DELETE /api/hackathons/:id` - Delete hackathon
- `POST /api/hackathon-registrations` - Create hackathon registration
- `GET /api/hackathon-registrations` - Get hackathon registrations
- `GET /api/hackathon-registrations/:id` - Get one hackathon registration
- `PUT /api/hackathon-registrations/:id/hackathon` - Assign or update registration hackathon
- `DELETE /api/hackathon-registrations/:id` - Delete hackathon registration
- `GET /api/dashboard-auth/status` - Dashboard auth status
- `POST /api/dashboard-auth/register` - Register dashboard user
- `POST /api/dashboard-auth/login` - Login dashboard user
- `GET /api/dashboard-auth/users` - List dashboard users
- `PATCH /api/dashboard-auth/users/:id/status` - Update dashboard user status
- `DELETE /api/dashboard-auth/users/:id` - Delete dashboard user

More student endpoint examples are available in:

```text
backend/API_ENDPOINTS.md
```

## Useful Scripts

Backend:

```bash
npm start
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Notes

- The backend serves uploaded files from `/uploads`.
- Alumni image uploads are saved under `backend/uploads/alumni`.
- Make sure MongoDB is running before starting the backend.
- Make sure the frontend `VITE_API_BASE_URL` matches the backend URL.
- The dashboard routes are protected and require dashboard login.
