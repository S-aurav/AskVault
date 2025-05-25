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

const BASE_URL = 'https://askvault.onrender.com';

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

async function deleteNote(id) {
  await fetch(`${BASE_URL}/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  notes = notes.filter(note => note._id !== id);
  renderNotes();
}

function renderNotes() {
  noteList.innerHTML = '';
  notes.forEach((note, idx) => {
    const li = document.createElement('li');
    li.textContent = note.title || `Note ${idx + 1}`;
    li.onclick = () => loadNote(idx);
    noteList.appendChild(li);
  });
}

function loadNote(index) {
  const note = notes[index];
  if (!note) return;
  titleInput.value = note.title;
  contentInput.value = note.content;
  currentNoteIndex = index;
}

saveBtn.onclick = async () => {
  const title = titleInput.value;
  const content = contentInput.value;

  if (currentNoteIndex >= 0) {
    const note = notes[currentNoteIndex];
    await updateNote(note._id, title, content);
  } else {
    await createNote(title, content);
  }

  currentNoteIndex = -1;
  titleInput.value = '';
  contentInput.value = '';
};

addBtn.onclick = () => {
  titleInput.value = '';
  contentInput.value = '';
  currentNoteIndex = -1;
};


function formatAIResponse(text) {
  // Escape HTML
  text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Code blocks (```code```)
  text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Inline code (`code`)
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold (**bold**)
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italics (_italic_)
  text = text.replace(/_(.*?)_/g, '<em>$1</em>');

  // Bullet points
  text = text.replace(/^- (.*)$/gm, '<li>$1</li>');
  text = text.replace(/<li>(.*?)<\/li>/g, '<ul>$&</ul>');

  // Paragraphs (convert double newlines to <p>)
  text = text.split('\n\n').map(p => `<p>${p}</p>`).join('');

  return text;
}

askBtn.onclick = async () => {
  const note = notes[currentNoteIndex];
  const question = questionInput.value;

  if (!note || !question) {
    alert('Please select a note and enter a question.');
    return;
  }

  answerDiv.textContent = 'Thinking...';

  try {
    const res = await fetch(`${BASE_URL}/api/ai/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        note: `${note.title}\n\n${note.content}`,
        question
      })
    });

    const data = await res.json();
    if (res.ok) {
      answerDiv.innerHTML = formatAIResponse(data.answer);
    } else {
      answerDiv.textContent = data.message || 'Error getting AI response.';
    }
  } catch (err) {
    answerDiv.textContent = 'Something went wrong while contacting AI.';
    console.error(err);
  }
};

toggleSidebar.onclick = () => {
  sidebar.classList.toggle('open');
};

themeToggle.onclick = () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
};

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️';
}

deleteBtn.onclick = async () => {
  if (currentNoteIndex < 0) {
    alert('No note selected to delete.');
    return;
  }

  const noteToDelete = notes[currentNoteIndex];

  if (!noteToDelete._id) {
    
    notes.splice(currentNoteIndex, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    currentNoteIndex = -1;
    renderNotes();
    titleInput.value = '';
    contentInput.value = '';
    return;
  }

  const confirmed = confirm(`Are you sure you want to delete "${noteToDelete.title}"?`);
  if (!confirmed) return;

  const result = await deleteNote(noteToDelete._id);
  if (result && result.success) {
    notes.splice(currentNoteIndex, 1);
    currentNoteIndex = -1;
    renderNotes();
    titleInput.value = '';
    contentInput.value = '';
  } else {
    alert(result.message || 'Failed to delete the note');
  }
};

logoutBtn.onclick = () => {
  localStorage.removeItem('token');
  alert('Logged out successfully!');
  window.location.href = 'login.html'; 
};


// Init
(async function () {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  } else {
    await fetchNotes();
  }
})();