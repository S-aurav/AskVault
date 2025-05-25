# 🧠 AskVault – AI-powered Note Vault

AskVault is a modern, secure, and intelligent note-taking web application that allows users to store notes privately and ask questions about their notes using AI. Built with Node.js, Express, MongoDB, and vanilla JS, AskVault also integrates Groq’s large language model for smart note analysis.

---

## 🚀 Live Demo

- 🔗 **Frontend:** [https://ask-vault.vercel.app](https://ask-vault.vercel.app)
- 🔗 **Backend API:** [https://askvault.onrender.com](https://askvault.onrender.com)

> Make sure to **sign up** before logging in and creating notes.

---


## ⚙️ Tech Stack

### Frontend
- HTML, CSS, JavaScript
- Responsive and accessible UI
- LocalStorage for theme and note caching

### Backend
- Node.js + Express.js
- MongoDB (with Mongoose)
- JWT-based Authentication
- AI Integration with Groq LLM

---

## 🔐 Authentication

- JWT-based login and signup
- Secure access to notes tied to the logged-in user
- Token stored in `localStorage` on frontend

---

## 📡 API Endpoints

### Auth Routes

#### `POST /api/auth/signup`
Register a new user  
**Body:**  
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

#### `POST /api/auth/login`
Log in and receive JWT  
**Body:**  
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

---

### Notes Routes (Protected)

All routes below require `Authorization: Bearer <token>` in headers.

#### `GET /api/notes`
Fetch all notes of the logged-in user  
**Response:**  
```json
{
  "notes": [
    { "_id": "...", "title": "...", "content": "..." }
  ]
}
```

#### `POST /api/notes`
Create a new note  
**Body:**
```json
{
  "title": "My Note",
  "content": "Some content"
}
```

#### `PUT /api/notes/:id`
Update a note  
**Body:** (same as above)

#### `DELETE /api/notes/:id`
Delete a note by ID

---

### AI Route

#### `POST /api/ai/ask`
Ask a question about a note using Groq's model  
**Body:**
```json
{
  "note": "This is a note about JS...",
  "question": "What is JavaScript closure?"
}
```

**Response:**
```json
{
  "answer": "A closure is..."
}
```

---

## 🧠 AI Integration (Groq)

AskVault integrates [Groq](https://groq.com) LLM APIs using `llama-3.3-70b-versatile`. It generates contextual answers from the selected note.

To use:
1. Ask a question via the AI section.
2. Note content + question is sent to Groq.
3. Response is displayed beautifully formatted on frontend.

---

## 🛠️ Getting Started (Development)

### Prerequisites
- Node.js v18+
- MongoDB Atlas or local DB
- Groq API Key

### Clone and Setup

```bash
git clone https://github.com/S-aurav/AskVault.git
cd AskVault/backend

# Install deps
npm install

# Add .env file
touch .env
```

`.env` file:
```
PORT=3000
MONGO_URI=mongodb+srv://<your-mongo>
JWT_SECRET=your-secret
GROQ_API_KEY=your-groq-key
```

### Start Server

```bash
npm start
```

Frontend can be opened by simply opening `frontend/index.html` or deploying via [Vercel](https://vercel.com).

---

## 🚀 Deployment

### Backend
Deployed on [Render](https://render.com) using the `/backend` directory as root.  
Render automatically builds and starts the server with:

- **Build command:** `npm install`
- **Start command:** `npm start`
- **Root directory:** `/backend`

### Frontend
Deployed on [Vercel](https://vercel.com) by uploading `/frontend` directory.  

---
