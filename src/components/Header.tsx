import icHamburger from "../assets/icHamburger.svg";
import logo from "../assets/logo.svg";
import styled from "styled-components";

const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 0 20px;

  > :first-child {
    width: 150px;
    height: 24px;
  }

  > :last-child {
    width: 30px;
    height: 30px;
  }
`;

const Header = () => {
  return (
    <Container>
      <img src={logo} />
      <img src={icHamburger} />
    </Container>
  );
};

export default Header;
