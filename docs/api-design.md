# QuickNotes API Design

This document describes the RESTful API endpoints for QuickNotes, the online note‑taking service. It defines methods, paths, descriptions, success statuses, request/response examples, and error codes.

---

## Endpoints

| Method | Path             | Description                     | Success Status |
|--------|------------------|---------------------------------|----------------|
| GET    | /notes           | List all notes (with pagination)| 200 OK         |
| GET    | /notes/{id}      | Retrieve a single note by ID    | 200 OK         |
| POST   | /notes           | Create a new note               | 201 Created    |
| PUT    | /notes/{id}      | Update an existing note         | 200 OK         |
| DELETE | /notes/{id}      | Delete a note                   | 204 No Content |
| GET    | /users/{id}/notes| List notes for a specific user  | 200 OK         |

---

## Example: Create a Note (POST /notes)

**Request JSON**
```json
{
  "title": "Meeting notes",
  "body": "Discussed project milestones and deadlines.",
  "userId": 42
}
