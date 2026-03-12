import { useEffect, useState } from "react";
import styled from "styled-components";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadNotes = async () => {
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/notes", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setNotes(data.notes || []);
    } catch {
      setError("Failed to load notes.");
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, body }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setNotes((prev) => [data.note, ...prev]);
      setTitle("");
      setBody("");
    } catch {
      setError("Failed to create note.");
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditBody(note.body || "");
  };

  const handleUpdate = async (id) => {
    setError("");
    setNotice("");

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: editTitle, body: editBody }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setNotes((prev) => prev.map((n) => (n._id === id ? data.note : n)));
      setEditingId(null);
      setEditTitle("");
      setEditBody("");
    } catch {
      setError("Failed to update note.");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setNotice("");

    const confirmed = window.confirm(
      "Are you sure you want to delete this note? This action cannot be undone.",
    );
    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        let data = {};
        try {
          data = await res.json();
        } catch {
          data = {};
        }
        setError(data.error);
        return;
      }

      setNotes((prev) => prev.filter((n) => n._id !== id));
      setNotice("Note deleted.");
    } catch {
      setError("Failed to delete note.");
    }
  };

  const Header1 = styled.h1`
    text-shadow: 0px 0px 5px #000000;
    display: inline-block;
    animation: mySpaceAnimation 10s ease-in-out infinite;
    margin: 0;

    @keyframes mySpaceAnimation {
      0% {
        color: #f61613;
      }
      25% {
        color: #08ec13d8;
      }
      50% {
        color: #f424e4c3;
      }
      75% {
        color: #2440f4c3;
      }
      100% {
        color: #eadfda;
      }
    }
  `;

  const ParagraphElement = styled.p`
    font-size: 1.2rem;
    color: #5aece5;
    padding: 0.5rem;
    display: block;
  `;

  return (
    <main className="app-shell">
      <Header1>Notes</Header1>
      <ParagraphElement>
        This is the notes page. Here you can add, edit and delete anything
        you've written.
      </ParagraphElement>

      {error && <div className="msg">{error}</div>}
      {notice && <div className="msg ok">{notice}</div>}

      <section className="secret-word-card">
        <h3>Create Note</h3>
        <form className="secret-word-form" onSubmit={handleCreate}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type Here"
            rows={4}
          />
          <button type="submit">Add note</button>
        </form>
      </section>

      <section>
        {notes.map((note) => (
          <article key={note._id} className="secret-word-card">
            {editingId === note._id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={4}
                />
                <div className="actions">
                  <button type="button" onClick={() => handleUpdate(note._id)}>
                    Save
                  </button>
                  <button type="button" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
                <div className="actions">
                  <button type="button" onClick={() => startEdit(note)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(note._id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
