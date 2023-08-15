import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;

`;

const Section = styled.div`
  display: flex;
  align-items: center;
`;

const Left = styled(Section)`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Mid = styled(Section)`
  flex: 1;
  justify-content: center;
  text-align: center;

  & a {
    text-decoration: none;
    margin: 0 15px;
    transition: color 0.3s;

    &:hover {
      color: lightgray;
    }
  }
`;

const Right = styled(Section)`
  font-weight: bold;
  font-size: 1.2rem;

  a {
    text-decoration: none;
    margin: 0 10px;
    transition: color 0.3s;

    &:hover {
      color: lightgray;
    }
  }
`;

function NavBar() {
  return (
    <Container>
      <Left>HackerRank Project</Left>
      <Mid>
        <Link to="/addquestion">add questions</Link>
        <Link to="/question">questions</Link>
      </Mid>
      <Right>
        <Link to="/login">login</Link>
        <Link to="/register">register</Link>
      </Right>
    </Container>
  );
}

export default NavBar;
