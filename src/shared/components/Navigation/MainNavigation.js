import React, { useState } from 'react';
import { Link } from 'react-router-dom';


import MainHeader from './MainHeader';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/Backdrop';
import NavLinks from './NavLinks';
import './MainNavigation.css';

const MainNavigation = (props) => {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawerHandler = () => {
    setIsDrawerOpen(true)
  }

  const closeDrawerHandler = () => {
    setIsDrawerOpen(false)
  }

  return (
    <React.Fragment>
      {isDrawerOpen && <Backdrop onClick={closeDrawerHandler}/>}
      <SideDrawer show={isDrawerOpen} onClick={closeDrawerHandler}>
        <nav>
          <NavLinks />
        </nav>
      </SideDrawer>
    <MainHeader>
      <button className='main-navigation__menu-btn' onClick={openDrawerHandler}>
        <span/>
        <span/>
        <span/>
      </button>
      <h1 className='main-navigation__title'>
        <Link to='/'>UnderDogs TLV</Link>
      </h1>
      <nav className='main-navigation__header-nav'>
        <NavLinks />
      </nav>
    </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
