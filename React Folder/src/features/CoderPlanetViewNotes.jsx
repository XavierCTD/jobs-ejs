import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../shared/Header";
import CoderPlanetNotes from "./CoderPlanetNotes";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function CoderPlanetViewNotes() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/logout");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container>
      <Header />
      <CoderPlanetNotes />
    </Container>
  );
}
