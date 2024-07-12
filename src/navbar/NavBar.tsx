// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar: React.FC = () => {
    return (
        <header className="navbar-header">
            <h1>Home</h1>
            <nav className="navbar">
                <li className="navbar-item">
                    <Link to="/">Home</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/login">Login</Link>
                </li>
            </nav>
        </header>
    );
};

export default NavBar;
