import { NavLink } from "react-router-dom";
import styled from "styled-components";
import spaceWithPlanets from "../shared/photos/SpaceWithPlanets.jpg";

const Aboutbody = styled.body`
  padding: 1rem;
  background-image: url(${spaceWithPlanets});
  background-size: cover;
  background-position: center;
`;

const DivElement = styled.div`
  margin-bottom: 1rem;
  padding: 0.5rem;
  color: #14cfd5;
  font-style: sans-serif;
  text-shadow: 0px 0px 4px #000000;
`;

const ParagraphElement = styled.p`
  font-size: 1.2rem;
`;

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

const LinkElement = styled(NavLink)`
  display: inline-block;
  margin-top: 1rem;
  padding: 1rem;
  color: #14f523;
  text-decoration: none;
  border-radius: 5px;
  border: 2px solid #000000;

  &:hover {
    color: #14cfd5;
    text-shadow: 0px 0px 5px #ffeeee;
    cursor: pointer;
  }
`;

export default function About() {
  return (
    <Aboutbody>
      <DivElement>
        <Header1>About CoderPlanet-X:</Header1>
      </DivElement>
      <DivElement>
        <ParagraphElement>
          CoderPlanet-X is a platform that shows links to coding resources and
          tutorials.
        </ParagraphElement>
        <br />
        <ParagraphElement>
          It also has a notes section where you can write and save notes about
          coding topics.
        </ParagraphElement>
        <br />
        <ParagraphElement>
          Once you log in, you can write and save your notes. Your notes will be
          saved in your browser's local storage, so they will persist even if
          you refresh the page or close the browser.
        </ParagraphElement>
        <br />
        <ParagraphElement>
          Feel free to explore the resources and take notes on anything you find
          interesting!
        </ParagraphElement>
      </DivElement>
      <LinkElement to="/">Back to Home</LinkElement>
    </Aboutbody>
  );
}
