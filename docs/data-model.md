# QuickNotes Data Model

This document defines the entities, relationships, SQL schema, example queries, and design decisions for QuickNotes.

---

## Entities

### Users
- **Columns**:  
  - id (INT, PK, auto-increment)  
  - username (VARCHAR(50), unique, not null)  
  - email (VARCHAR(100), unique, not null)  
  - created_at (TIMESTAMP, default CURRENT_TIMESTAMP)

### Notes
- **Columns**:  
  - id (INT, PK, auto-increment)  
  - user_id (INT, FK → users.id)  
  - title (VARCHAR(100), not null)  
  - body (TEXT, nullable)  
  - created_at (TIMESTAMP, default CURRENT_TIMESTAMP)

### Tags
- **Columns**:  
  - id (INT, PK, auto-increment)  
  - name (VARCHAR(50), unique, not null)

### Note_Tags (join table)
- **Columns**:  
  - note_id (INT, FK → notes.id)  
  - tag_id (INT, FK → tags.id)  
- **Primary Key**: (note_id, tag_id)

---

## Relationships
- **Users → Notes**: One-to-many (a user can have many notes).  
- **Notes ↔ Tags**: Many-to-many (a note can have multiple tags, and a tag can apply to multiple notes). Implemented via the `note_tags` join table.

---

## SQL Schema

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  body TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE note_tags (
  note_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (note_id, tag_id),
  FOREIGN KEY (note_id) REFERENCES notes(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);
