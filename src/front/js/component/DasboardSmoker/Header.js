import React from 'react';

const Header = ({ onLogout }) => {
    return (
        <div className="user-header">
            <h1 className="user-header-title"># User's Control Panel</h1>
            <button className="user-header-button" onClick={onLogout}>Logout</button>
        </div>
    );
};

export default Header;