const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const loadBtn = document.querySelector('#load-btn');
const statusEl = document.querySelector('#status');
const notesList = document.querySelector('#notes-list');
const noteForm = document.querySelector('#note-form');
const titleInput = document.querySelector('#title-input');
const bodyInput = document.querySelector('#body-input');
const submitBtn = document.querySelector('#submit-btn');

// Reusable request function
async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

// Render notes
function renderNotes(notes) {
  notesList.innerHTML = '';
  if (notes.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No notes available.';
    notesList.appendChild(li);
    return;
  }
  notes.forEach(note => {
    const li = document.createElement('li');
    const title = document.createElement('h3');
    title.textContent = note.title;
    const body = document.createElement('p');
    body.textContent = note.body;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deleteNote(note.id, li));

    li.appendChild(title);
    li.appendChild(body);
    li.appendChild(delBtn);
    notesList.appendChild(li);
  });
}

// GET: Load notes
async function loadNotes() {
  statusEl.textContent = 'Loading notes...';
  statusEl.className = '';
  loadBtn.disabled = true;
  try {
    const notes = await request(`${API_URL}?_limit=10`);
    renderNotes(notes);
    statusEl.textContent = `Loaded ${notes.length} notes from the server.`;
    statusEl.className = 'success';
  } catch (err) {
    statusEl.textContent = `Error loading notes: ${err.message}`;
    statusEl.className = 'error';
  } finally {
    loadBtn.disabled = false;
  }
}

// POST: Create note
async function createNote(title, body) {
  statusEl.textContent = 'Creating note...';
  statusEl.className = '';
  submitBtn.disabled = true;
  try {
    const newNote = await request(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, userId: 1 })
    });

    const li = document.createElement('li');
    const titleEl = document.createElement('h3');
    titleEl.textContent = newNote.title;
    const bodyEl = document.createElement('p');
    bodyEl.textContent = newNote.body;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deleteNote(newNote.id, li));

    li.appendChild(titleEl);
    li.appendChild(bodyEl);
    li.appendChild(delBtn);
    notesList.insertBefore(li, notesList.firstChild);

    statusEl.textContent = `Note created (status 201, id ${newNote.id}).`;
    statusEl.className = 'success';
  } catch (err) {
    statusEl.textContent = `Error creating note: ${err.message}`;
    statusEl.className = 'error';
  } finally {
    submitBtn.disabled = false;
    noteForm.reset();
  }
}

// DELETE: Remove note
async function deleteNote(id, li) {
  statusEl.textContent = 'Deleting note...';
  statusEl.className = '';
  try {
    await request(`${API_URL}/${id}`, { method: 'DELETE' });
    // JSONPlaceholder does not persist deletes, so we remove from UI only
    li.remove();
    statusEl.textContent = `Note ${id} deleted (status 200).`;
    statusEl.className = 'success';
  } catch (err) {
    statusEl.textContent = `Error deleting note: ${err.message}`;
    statusEl.className = 'error';
  }
}

// Event listeners
loadBtn.addEventListener('click', loadNotes);

noteForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  if (!title) {
    statusEl.textContent = 'Title is required.';
    statusEl.className = 'error';
    return;
  }
  if (title.length > 100) {
    statusEl.textContent = 'Title must be 100 characters or fewer.';
    statusEl.className = 'error';
    return;
  }
  createNote(title, body);
});
