const mongoose = require("mongoose");
const Note = require("../models/note");

const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({
      title: req.body.title,
      body: req.body.body || "",
      createdBy: req.user._id,
    });
    res.status(201).json({ note });
  } catch (err) {
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

    const note = await Note.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { title: req.body.title, body: req.body.body || "" },
      { new: true, runValidators: true },
    );

    if (!note) {
      return res.status(404).json({ error: "Note not found." });
    }

    return res.status(200).json({ note });
  } catch (err) {
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
