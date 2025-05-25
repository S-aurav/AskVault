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