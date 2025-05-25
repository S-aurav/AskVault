const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// Get all notes for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }); // ✅ Filter by userId
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notes.' });
  }
});

// Add a new note
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;
  const newNote = new Note({ title, content, userId: req.userId });
  await newNote.save();
  res.status(201).json(newNote);
});

// Update a note
router.put('/:id', auth, async (req, res) => {
  const { title, content } = req.body;
  const updatedNote = await Note.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { title, content },
    { new: true }
  );
  res.json(updatedNote);
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ success: true });
});

module.exports = router;
