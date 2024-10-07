import React from 'react';

const MenuItem = ({ icon, text, isActive, onClick }) => (
    <li className={`side-nav__item ${isActive ? 'side-nav__item-active' : ''}`} onClick={onClick}>
        {icon}
        <span>{text}</span>
    </li>
);

export default MenuItem;