import React from 'react';

const MainContent = ({ navigate, loggedInUser }) => {
    return (
        <div className="user-main-content">
            <h1>Welcome to your Dashboard!</h1>
            <p>This is the control panel for users.</p>

            <div className="dashboard-buttons">
                <button className="btn btn-secondary" onClick={() => navigate("/approved-coaches")}>
                    Ver a tus Coaches
                </button>
            </div>
        </div>
    );
};

export default MainContent;