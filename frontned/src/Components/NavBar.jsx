import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { publicRequest } from '../api';
import { logout } from '../redux/userSlice';
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md"
import { AiFillSetting } from "react-icons/ai"
import { CgLogOut } from "react-icons/cg"




const Container = styled.nav`
  z-index:100;
  background-color: white;
  position: sticky;
  top: 0;
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  box-shadow: 0 3px 3px #e7eeef;

  a {
    text-transform: capitalize;
    text-decoration: none;
  }
`;

const Section = styled.div`
  display: flex;
  align-items: center;
`;

const Left = styled(Section)`
  width: 250px;
  font-size: 1.5rem;
  font-weight: bold;
`;

const Mid = styled(Section)`
  flex: 1;
  justify-content: center;
  text-align: center;
  gap: 1rem;

`;
const Right = styled(Section)`
  width: 250px;
  justify-content: flex-end;
  text-align: center;
  gap: 1rem;
`;

const LinkStyle = styled(Link)`
    text-decoration: none;
    transition: color 0.3s;
    background-color: #${p => p.active && "2C4DFF"} !important;
    color: ${p => p.active && "white"};
    padding: 0.5rem 1rem;
    border-radius: 0.2rem;
    font-family: 500;
    transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #c6ceff;
  }
`

const LinkAuth = styled(Link)`
  
`

const DropdownList = styled.div`
    display: ${p => p.open ? "block" : "none"};
`
const DropdownContainer = styled.div`
    background-color: #f5f5f5;
    box-shadow: rgba(0, 0, 0, 0.10) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
   // border: 1px solid black;
    display: flex;
    flex-direction: column;
    position: absolute;   
    top: 110%;
    transform: translate(-35%);
    width: 150px;
    ::before {
        content: "";
        position: absolute;
        left : 50%;
        top: -6px;
        width: 10px;
        height: 10px;
        background-color: #f5f5f5;
        transform: rotate(45deg);
    }
`
const Dropdown = styled.span`
    z-index: 100000000000000000;
    padding: 10px 20px;
    background-color: inherit;
    color: black;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
    &:hover {
        color: black;
        font-weight: 600;
    }
`

const AccountContainer = styled.div`
    display: flex;
    flex-direction: column;
    cursor: pointer;
    height: 100%;
    user-select: none;
    /* &:hover ${DropdownList}{
        display: block;
    } */

`
const Hello = styled.span`
    font-size: 15px;
    font-weight: 400;
`
const Account = styled.span`
    margin-top: 2px;
    font-weight: 600;
    position: relative;
    display: flex;
    align-items: center;
`

const RoleContainer = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 0.2rem;
  background-color: #${p => p.isAdmin ? "EDFDFA" : "c9e3ff"};
  color: #${p => p.isAdmin ? "44A695" : "348dff"};
`


function NavBar({user}) {
  const [optionIsOpen, setOptionIsOpen] = useState(false);
  const location = useLocation()
  const dispatch = useDispatch()
  const handleLogout = async () => {
    try {
      const {data} = await publicRequest.delete("/authentication/logout")
      dispatch(logout())
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container>
      <Left>HackerRank Project</Left>
      <Mid>
        {user?.isAdmin &&
          <>
             <LinkStyle active={location.pathname === "/addquestion"} to="/addquestion">add questions</LinkStyle>
             <LinkStyle active={location.pathname === "/tests"} to="/tests">test</LinkStyle>
          </>
        }
        {user &&
          <>
             <LinkStyle active={location.pathname === "/questions"} to="/questions">questions</LinkStyle>
          </>
        }
        
      </Mid>
      <Right>
        {!user ? <LinkAuth active={true} to="/auth">login</LinkAuth>
          :<>
            <RoleContainer isAdmin={user.isAdmin} >{user.isAdmin ? "Admin" : "Client"}</RoleContainer>
            <AccountContainer onClick={() => setOptionIsOpen(!optionIsOpen)} >
            <Hello>hello, {user.firstname}</Hello>
            <Account>Account {optionIsOpen ? <MdOutlineKeyboardArrowUp/> : <MdOutlineKeyboardArrowDown/>}</Account>
                <DropdownList open={optionIsOpen}>
                    <DropdownContainer onClick={(e) => e.stopPropagation()}>
                        <Dropdown onClick={handleLogout}><CgLogOut/> Logout</Dropdown>
                    </DropdownContainer>
                </DropdownList>
            </AccountContainer>
          </>
        }
        {/* {user ? <LinkAuth onClick={handleLogout} >Logout</LinkAuth>  :  } */}
        
      </Right>
    </Container>
  );
}

export default NavBar;
