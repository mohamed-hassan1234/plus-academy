# Student Registration API Endpoints

Base URL: `http://localhost:5000/api`

## 1. POST - Register a New Student
**Endpoint:** `POST /api/register`

**Request Body:**
```json
{
  "fullName": "Ahmed Hassan",
  "email": "ahmed@example.com",
  "whatsappNumber": "+252611234567",
  "gender": "Male",
  "location": "Mogadishu",
  "educationLevel": "Bachelor's Degree",
  "institutionName": "Somali National University",
  "hasLaptop": "Yes"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "data": {
    "_id": "...",
    "fullName": "Ahmed Hassan",
    "email": "ahmed@example.com",
    ...
  }
}
```

---

## 2. GET - Get All Students (with Search & Filter)
**Endpoint:** `GET /api/students`

**Query Parameters (all optional):**
- `search` - Search in name, email, whatsapp, location, or institution
- `gender` - Filter by gender (Male/Female)
- `educationLevel` - Filter by education level
- `hasLaptop` - Filter by laptop status (Yes/No)
- `location` - Filter by location

**Examples:**
- `GET /api/students` - Get all students
- `GET /api/students?search=Ahmed` - Search for "Ahmed"
- `GET /api/students?gender=Male&hasLaptop=Yes` - Filter by gender and laptop
- `GET /api/students?location=Mogadishu` - Filter by location

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

---

## 3. GET - Get Single Student by ID
**Endpoint:** `GET /api/students/:id`

**Example:** `GET /api/students/507f1f77bcf86cd799439011`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "fullName": "Ahmed Hassan",
    ...
  }
}
```

---

## 4. PUT - Update Student by ID
**Endpoint:** `PUT /api/students/:id`

**Example:** `PUT /api/students/507f1f77bcf86cd799439011`

**Request Body (all fields optional):**
```json
{
  "fullName": "Ahmed Hassan Updated",
  "email": "newemail@example.com",
  "location": "Hargeisa"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {...}
}
```

---

## 5. DELETE - Delete Student by ID
**Endpoint:** `DELETE /api/students/:id`

**Example:** `DELETE /api/students/507f1f77bcf86cd799439011`

**Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": {...}
}
```

---

## 6. GET - Export Students to Excel
**Endpoint:** `GET /api/students/export/excel`

**Query Parameters (same as GET all students):**
- `search`, `gender`, `educationLevel`, `hasLaptop`, `location`

**Examples:**
- `GET /api/students/export/excel` - Export all students
- `GET /api/students/export/excel?gender=Female` - Export only female students
- `GET /api/students/export/excel?search=Ahmed` - Export filtered results

**Response:** Excel file download (.xlsx)

---

## Postman Testing Guide

### Setup:
1. Make sure MongoDB is running on `localhost:27017`
2. Start the server: `npm start` (in backend folder)
3. Server will run on `http://localhost:5000`

### Test Steps:
1. **Register a student** - Use POST `/api/register` with sample data
2. **Get all students** - Use GET `/api/students`
3. **Get single student** - Copy an ID from step 2, use GET `/api/students/:id`
4. **Update student** - Use PUT `/api/students/:id` with updated data
5. **Search/Filter** - Use GET `/api/students?search=name` or other filters
6. **Export to Excel** - Use GET `/api/students/export/excel` (will download file)
7. **Delete student** - Use DELETE `/api/students/:id`

### Notes:
- All endpoints return JSON except Excel export (returns file)
- Students can register multiple times (duplicates allowed)
- Search is case-insensitive
- Excel export includes all filtered/search results
