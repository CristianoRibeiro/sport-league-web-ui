import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <NavLink to="/" exact className="text-white font-bold">
                    <img src="/Images/logo.svg" alt="Logo" className="h-8" />
                </NavLink>
                <ul className="flex space-x-4">
                    <li>
                        <NavLink to="/Schedule" className="flex items-center text-white" activeClassName="text-blue-200">
                            <img src="/Images/schedule.png" className="h-8 mr-2" alt="Ícone" />
                            Schedule
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/Leaderboard" className="flex items-center text-white" activeClassName="text-blue-200">
                            <img src="/Images/leaderboard.png" className="h-8 mr-2" alt="Ícone" /> 
                            Leaderboard
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
