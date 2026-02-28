import { useState, useEffect } from "react";
import styled from "styled-components";

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
    <NotesContainer>
      <h2>Coder Planet-X Notes</h2>
      <textarea value={notes} onChange={handleNotesChange}></textarea>
    </NotesContainer>
  );
}
