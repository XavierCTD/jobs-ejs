import styled from "styled-components";

const StyledText = styled.text`
  margin: 0.5em 0;
  padding: 0.5em;
  font-size: 1.2em;
`;

export default function TextInput({ label, value, onChange }) {
  return (
    <div>
      <StyledText>{label}</StyledText>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
