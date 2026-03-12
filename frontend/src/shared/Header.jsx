import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";

const HeaderContainer = styled.header`
  padding: 20px;
`;

const navItems = css`
  color: #14cfd5;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  text-decoration: none;
  background: transparent;
  border: 2px solid #000000;
  border-radius: 5px;
  font: inherit;
  line-height: 1;
  margin: 0;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const Wrapper = styled.div`
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Title = styled.h1`
  display: inline-block;
  animation: mySpaceAnimation 10s ease-in-out infinite;
  margin: 0;

  @keyframes mySpaceAnimation {
    0% {
      color: #f61613;
      text-shadow: 0px 0px 5px #f61613;
    }
    25% {
      color: #08ec13d8;
      text-shadow: 0px 0px 5px #08ec13d8;
    }
    50% {
      color: #f424e4c3;
      text-shadow: 0px 0px 5px #f424e4c3;
    }
    75% {
      color: #2440f4c3;
      text-shadow: 0px 0px 5px #2440f4c3;
    }
    100% {
      color: #eadfda;
      text-shadow: 0px 0px 5px #eadfda;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const StyledNavLink = styled(NavLink)`
  ${navItems}
`;

const LogoutForm = styled.form`
  margin: 0;
  padding: 0;
  display: inline-flex;
`;

const LogoutButton = styled.button`
  ${navItems}
`;

export default function Header({ title = "CoderPlanet-X" }) {
  return (
    <HeaderContainer>
      <Wrapper>
        <Title>{title}</Title>
        <Nav>
          <StyledNavLink to="/" end>
            Home
          </StyledNavLink>
          <StyledNavLink to="/about">About</StyledNavLink>
          <StyledNavLink to="/notes">Notes</StyledNavLink>
          <LogoutForm method="POST" action="/sessions/logoff">
            <LogoutButton type="submit">Log out</LogoutButton>
          </LogoutForm>
        </Nav>
      </Wrapper>
    </HeaderContainer>
  );
}
