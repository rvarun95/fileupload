import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <div className="header">
            <h1>File Upload</h1>
            <nav>
                <NavLink activeClassName='active' to='/home' exact={true}>
                    Home
                </NavLink>
                <NavLink activeClassName='active' to='/list'>
                    Files List
                </NavLink>
            </nav>
        </div>
    )
}

export default Header;