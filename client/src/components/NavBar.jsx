import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <div id="navbar-component">
            <ul>
                <h3>Inventory Manager Extra</h3>
                <li><Link to="">Home</Link></li>
                <li><Link to="inventory">Inventory</Link></li>
                <ul>
                    <li><Link to="inventory/alerts">Alerts</Link></li>
                    <li><Link to="inventory/new">New Item</Link></li>
                </ul>
                <li><Link to="users/0">Profile</Link></li>
                <li><Link to="/" onClick={() => sessionStorage.clear()}>Sign Out</Link></li>
            </ul>
        </div>
    );
}

export default NavBar;
