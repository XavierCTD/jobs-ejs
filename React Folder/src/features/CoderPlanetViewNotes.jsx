import styled from "styled-components";
import CoderPlanetNotes from "./CoderPlanetNotes";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function CoderPlanetViewNotes() {
  return (
    <Container>
      <CoderPlanetNotes />
    </Container>
  );
}
