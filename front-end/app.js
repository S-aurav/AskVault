let notes = [];
let currentNoteIndex = -1;

const noteList = document.getElementById('note-list');
const titleInput = document.getElementById('note-title');
const contentInput = document.getElementById('note-content');
const saveBtn = document.getElementById('save-note');
const addBtn = document.getElementById('add-note');
const askBtn = document.getElementById('ask-btn');
const questionInput = document.getElementById('question');
const answerDiv = document.getElementById('answer');
const themeToggle = document.getElementById('toggle-theme');
const sidebar = document.querySelector('aside');
const toggleSidebar = document.getElementById('toggle-sidebar');
const deleteBtn = document.getElementById('delete-note');
const logoutBtn = document.getElementById('logout-btn');

const BASE_URL = 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('token');
}

function isLoggedIn() {
  return !!getToken();
}

async function fetchNotes() {
  const res = await fetch(`${BASE_URL}/api/notes`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const data = await res.json();
  if (!res.ok) {
    alert(data.message || 'Failed to fetch notes');
    notes = [];
    renderNotes();
    return;
  }

  if (Array.isArray(data)) {
    notes = data;
  } else if (Array.isArray(data.notes)) {
    notes = data.notes;
  } else {
    notes = [];
  }
  console.log("Fetched notes:", notes);
  renderNotes();
}

async function createNote(title, content) {
  const res = await fetch(`${BASE_URL}/api/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ title, content })
  });

  const newNote = await res.json();
  notes.push(newNote);
  renderNotes();
}

async function updateNote(id, title, content) {
  const res = await fetch(`${BASE_URL}/api/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ title, content })
  });

  const updatedNote = await res.json();
  const index = notes.findIndex(n => n._id === id);
  if (index !== -1) {
    notes[index] = updatedNote;
  }
  renderNotes();
}




// Init
(async function () {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  } else {
    await fetchNotes();
  }
})();