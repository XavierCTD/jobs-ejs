import { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const NotesSection = styled.section`
  width: min(900px, 92vw);
  margin: 1.5rem auto;
  padding: 1.25rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
`;

const NotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function CoderPlanetNotes() {
  const [notes, setNotes] = useState("");
  useEffect(() => {
    const savedNotes = localStorage.getItem("coderPlanetNotes");
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem("coderPlanetNotes", newNotes);
  };

  return (
    <NotesSection>
      <NotesContainer>
        <h2>Coder Planet-X Notes</h2>
        <p>These are your personal notes for Coder Planet-X.</p>
        <textarea value={notes} onChange={handleNotesChange}></textarea>
        <Link to="/" style={{ marginTop: "20px" }}>
          Back to Home
        </Link>
      </NotesContainer>
    </NotesSection>
  );
}
