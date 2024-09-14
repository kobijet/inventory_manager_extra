import React from 'react';
import { Link, useOutlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Dashboard from '../components/Dashboard';

const Home = () => {
    const outlet = useOutlet();

    return (
        <div id="home-page">
            <div className="home-sidebar">
                <NavBar />
            </div>
            {outlet || <Dashboard />}
        </div>
    );
}

export default Home;
