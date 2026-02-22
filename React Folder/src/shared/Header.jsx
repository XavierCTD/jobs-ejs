import { NavLink } from "react-router";
import styled from "styled-components";

export default function Header({ title }) {
  return (
    <>
      <header>
        <h1 className={styled.title}>{title}</h1>
        <nav>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? styled.active : styled.inactive
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/coder-planet"
            className={({ isActive }) =>
              isActive ? styled.active : styled.inactive
            }
          >
            Coder Planet-X
          </NavLink>
          <NavLink
            to="/logout"
            className={({ isActive }) =>
              isActive ? styled.active : styled.inactive
            }
          >
            Log-out
          </NavLink>
        </nav>
      </header>
    </>
  );
}
