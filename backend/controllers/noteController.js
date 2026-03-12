const mongoose = require("mongoose");
const Note = require("../models/note");

const normalizeText = (value) => String(value || "").trim();

const createNote = async (req, res, next) => {
  try {
    const title = normalizeText(req.body.title);
    const body = normalizeText(req.body.body);
    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }

    const duplicate = await Note.findOne({
      createdBy: req.user._id,
      title,
      body,
    });
    if (duplicate) {
      return res.status(409).json({ error: "Duplicate note detected." });
    }

    const note = await Note.create({
      title,
      body,
      createdBy: req.user._id,
    });
    res.status(201).json({ note });
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((item) => item.message)
        .join(", ");
      return res.status(400).json({ error: message });
    }
    next(err);
  }
};

const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ notes });
  } catch (err) {
    next(err);
  }
};

const getNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid note id." });
    }

    const note = await Note.findOne({ _id: id, createdBy: req.user._id });
    if (!note) {
      return res.status(404).json({ error: "Note not found." });
    }

    return res.status(200).json({ note });
  } catch (err) {
    next(err);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid note id." });
    }

    const title = normalizeText(req.body.title);
    const body = normalizeText(req.body.body);
    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }

    const duplicate = await Note.findOne({
      _id: { $ne: id },
      createdBy: req.user._id,
      title,
      body,
    });
    if (duplicate) {
      return res.status(409).json({ error: "Duplicate note detected." });
    }

    const note = await Note.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { title, body },
      { new: true, runValidators: true },
    );

    if (!note) {
      return res.status(404).json({ error: "Note not found." });
    }

    return res.status(200).json({ note });
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((item) => item.message)
        .join(", ");
      return res.status(400).json({ error: message });
    }
    next(err);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid note id." });
    }

    const note = await Note.findOneAndDelete({ _id: id, createdBy: req.user._id });
    if (!note) {
      return res.status(404).json({ error: "Note not found." });
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
};
