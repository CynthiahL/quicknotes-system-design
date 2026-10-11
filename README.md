# QuickNotes

QuickNotes is a demonstration project showing how a front‑end client can interact with a REST API. It uses the JSONPlaceholder practice API to prove that the browser client can perform GET, POST, and DELETE requests. Alongside the client, the project includes design documents for the real QuickNotes service, covering API design, data modeling, and system architecture for scaling to 1 million users.

---

## Features
- **Load notes (GET)**: Fetches 10 notes from the server and displays them.
- **Create notes (POST)**: Validates input, sends a POST request, and adds the new note to the list.
- **Delete notes (DELETE)**: Removes notes from the list after a DELETE request.
- **Status messages**: Shows loading, success, error, and empty states.
- **Validation**: Title is required and limited to 100 characters.
- **Disabled buttons**: Prevents duplicate requests while operations are running.
- **Safe rendering**: User text is inserted with `textContent` only.

---

## How to Run the API Client
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/quicknotes.git
