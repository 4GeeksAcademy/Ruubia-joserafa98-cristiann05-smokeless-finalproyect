import React from 'react';
import BarChart from './BarChart';

const SpendingStatistics = () => (
    <div className="box spending-box">
        <div className="header-container">
            <h3 className="section-header">Spending Statistics</h3>
            <div className="year-selector">
                <span>2023</span>
                {/* Se pueden agregar iconos para cambiar de año */}
            </div>
        </div>
        <BarChart />
    </div>
);

export default SpendingStatistics;