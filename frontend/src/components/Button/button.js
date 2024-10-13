import { styled } from "styled-components";

const BtnContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: ${(props) =>
    !props.color
      ? props.type === "cancel"
        ? "#af0a0a"
        : "#046708"
      : props.color};
  max-height: 50px;
  max-width: 200px;
  cursor: pointer;
  border: 0px solid;
  border-radius: 15px;
  color: white;
  font-size: 15px;
`;

export const Button = ({ children, type, color, onClick }) => {
  return (
    <BtnContainer type={type} color={color} onClick={onClick}>
      {children}
    </BtnContainer>
  );
};
