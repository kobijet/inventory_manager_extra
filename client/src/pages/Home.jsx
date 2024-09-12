import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';

const Home = () => {
    return (
        <div id="home-page">
            <div className="home-sidebar">
                <NavBar />
            </div>
            <Outlet />
        </div>
    );
}

export default Home;
