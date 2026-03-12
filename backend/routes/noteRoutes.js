const express = require("express");
const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

const router = express.Router();

router.route("/").post(createNote).get(getNotes);
router.route("/:id").get(getNote).patch(updateNote).delete(deleteNote);

module.exports = router;
