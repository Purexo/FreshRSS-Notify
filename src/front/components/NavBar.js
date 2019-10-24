import React from 'react';

import Icon from './Icon';

export default function NavBar({brand, children}) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-sticky navbar-sticky-top bg-secondary">
      {brand}
      
      <ul className="navbar-nav ml-auto d-flex flex-row justify-content-end w-25">
        {children}
      </ul>
    </nav>
  )
}

export function Brand({onClick, image}) {
  return (
    <a className="navbar-brand" onClick={onClick} target="_blank" href="#">
      <img className="logo" src={image} height="30" alt="logo"/>
    </a>
  );
};

export function Item({onClick, title, faIcon, children}) {  
  return (
    <li className="nav-item" onClick={onClick}>
      <a className="nav-link btn btn-dark w-100" title={title} href="#">
        <Icon faIcon={faIcon}/>
        {children}
      </a>
    </li>
  )
};

Object.assign(NavBar, {Brand, Item});