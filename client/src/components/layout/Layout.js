import React from 'react';
import { Navbar } from '../shared/Navbar';

export const Layout = ({ id, className, children }) => {
  return (
    <div
      className={`home__screen ${className ? className : ''}`}
      id={id ? id : ''}>
      <div className={`home__wrapper complete_screen`}>
        <Navbar />
        <div className="home__panel">{children}</div>
      </div>
    </div>
  );
};
